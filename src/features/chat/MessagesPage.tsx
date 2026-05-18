import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { chatService } from '../../services/chatService';
import { Message, ChatContact } from '../../types/chat.types';
import { Send, MessageSquare, Search, ArrowLeft, User as UserIcon } from 'lucide-react';
import { Spinner } from '../../components/ui/Spinner';
import { Button } from '../../components/ui/Button';
import { formatDate } from '../../utils/formatters';

export const MessagesPage: React.FC = () => {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  
  // Check if a client id was passed to start chatting directly
  const targetContactId = location.state?.contactId;

  const [contacts, setContacts] = useState<ChatContact[]>([]);
  const [selectedContact, setSelectedContact] = useState<ChatContact | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessageText, setNewMessageText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoadingContacts, setIsLoadingContacts] = useState(true);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [isMobileChatOpen, setIsMobileChatOpen] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Load Contacts
  useEffect(() => {
    if (!user) return;
    
    const loadContacts = async () => {
      try {
        const loaded = await chatService.getContactsForUser(user.id, user.role);
        setContacts(loaded);
        
        // If targetContactId was passed (e.g., from client details "Message" click), select it
        if (targetContactId) {
          const contact = loaded.find(c => c.id === targetContactId);
          if (contact) {
            setSelectedContact(contact);
            setIsMobileChatOpen(true);
          }
        } else if (loaded.length > 0 && !selectedContact && window.innerWidth >= 1024) {
          // Auto-select first contact on desktop
          setSelectedContact(loaded[0]);
        }
      } catch (err) {
        console.error('Failed to load contacts', err);
      } finally {
        setIsLoadingContacts(false);
      }
    };

    loadContacts();

    // Poll contacts and messages every 4 seconds for pseudo-realtime updates
    const interval = setInterval(loadContacts, 4000);
    return () => clearInterval(interval);
  }, [user, targetContactId]);

  // Load Messages for Selected Contact
  useEffect(() => {
    if (!user || !selectedContact) return;

    const loadMessages = async () => {
      try {
        const history = await chatService.getChatHistory(user.id, selectedContact.id);
        setMessages(history);
        await chatService.markAsRead(user.id, selectedContact.id);
      } catch (err) {
        console.error('Failed to load chat history', err);
      }
    };

    setIsLoadingMessages(true);
    loadMessages().finally(() => setIsLoadingMessages(false));

    const interval = setInterval(loadMessages, 3000);
    return () => clearInterval(interval);
  }, [user, selectedContact]);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !selectedContact || !newMessageText.trim()) return;

    const textToSend = newMessageText;
    setNewMessageText(''); // Clear input instantly for snappy UI

    try {
      const sent = await chatService.sendMessage(user.id, selectedContact.id, textToSend);
      setMessages(prev => [...prev, sent]);
      
      // Update last message in local contact state instantly
      setContacts(prev => 
        prev.map(c => 
          c.id === selectedContact.id 
            ? { ...c, lastMessage: textToSend, lastMessageTime: sent.timestamp } 
            : c
        ).sort((a, b) => {
          if (!a.lastMessageTime) return 1;
          if (!b.lastMessageTime) return -1;
          return new Date(b.lastMessageTime).getTime() - new Date(a.lastMessageTime).getTime();
        })
      );
    } catch (err) {
      console.error('Failed to send message', err);
    }
  };

  const handleContactSelect = (contact: ChatContact) => {
    setSelectedContact(contact);
    setIsMobileChatOpen(true);
  };

  const filteredContacts = contacts.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!user) return null;

  return (
    <div className="h-[calc(100vh-8rem)] flex border border-gray-100 rounded-2xl overflow-hidden bg-white dark:bg-gray-100 shadow-sm">
      {/* LEFT PANEL: Contacts List */}
      <div 
        className={`w-full lg:w-80 flex flex-col border-r border-gray-100 bg-white dark:bg-gray-100
          ${isMobileChatOpen ? 'hidden lg:flex' : 'flex'}
        `}
      >
        <div className="p-4 border-b border-gray-100 space-y-4">
          <h2 className="text-2xl font-bold text-gray-900 m-0">Messages</h2>
          
          <div className="relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-gray-50 dark:bg-gray-50/50 border border-gray-200 rounded-xl pl-9 pr-4 py-2 outline-none focus:border-[var(--primary)] transition-colors text-sm"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto divide-y divide-gray-100">
          {isLoadingContacts ? (
            <div className="flex items-center justify-center p-8">
              <Spinner size="md" />
            </div>
          ) : filteredContacts.length === 0 ? (
            <div className="text-center py-12 text-gray-500 space-y-2">
              <MessageSquare className="w-8 h-8 mx-auto text-gray-300" />
              <p className="text-sm font-medium">No conversations found</p>
            </div>
          ) : (
            filteredContacts.map(contact => {
              const isSelected = selectedContact?.id === contact.id;
              return (
                <button
                  key={contact.id}
                  onClick={() => handleContactSelect(contact)}
                  className={`w-full flex items-start gap-3 p-4 text-left transition-colors relative
                    ${isSelected 
                      ? 'bg-red-50/50 dark:bg-red-950/10 border-l-4 border-[var(--primary)]' 
                      : 'hover:bg-gray-50 border-l-4 border-transparent'
                    }
                  `}
                >
                  <div className="w-11 h-11 rounded-full overflow-hidden bg-gray-100 flex-shrink-0 relative">
                    {contact.avatarUrl ? (
                      <img src={contact.avatarUrl} alt={contact.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <UserIcon className="w-5 h-5" />
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-baseline mb-0.5">
                      <h4 className="font-bold text-sm text-gray-900 truncate m-0">{contact.name}</h4>
                      {contact.lastMessageTime && (
                        <span className="text-[10px] text-gray-400 font-medium">
                          {formatDate(contact.lastMessageTime)}
                        </span>
                      )}
                    </div>
                    {contact.lastMessage ? (
                      <p className="text-xs text-gray-500 truncate m-0 font-medium pr-4">
                        {contact.lastMessage}
                      </p>
                    ) : (
                      <p className="text-xs text-[var(--primary)] m-0 font-semibold italic">
                        New Conversation
                      </p>
                    )}
                  </div>

                  {contact.unreadCount > 0 && (
                    <span className="absolute right-4 bottom-4 w-5 h-5 bg-[var(--primary)] text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-md shadow-red-500/20">
                      {contact.unreadCount}
                    </span>
                  )}
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* RIGHT PANEL: Active Chat Thread */}
      <div 
        className={`flex-1 flex flex-col bg-gray-50/30 dark:bg-gray-50/10
          ${!isMobileChatOpen ? 'hidden lg:flex' : 'flex'}
        `}
      >
        {selectedContact ? (
          <>
            {/* Active Contact Header */}
            <div className="h-16 flex items-center justify-between px-6 border-b border-gray-100 bg-white dark:bg-gray-100">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setIsMobileChatOpen(false)}
                  className="p-1.5 -ml-1 text-gray-400 hover:text-gray-600 rounded-lg lg:hidden"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-100 relative">
                  {selectedContact.avatarUrl ? (
                    <img src={selectedContact.avatarUrl} alt={selectedContact.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <UserIcon className="w-5 h-5" />
                    </div>
                  )}
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 m-0 leading-none">{selectedContact.name}</h4>
                  <p className="text-[10px] text-gray-500 mt-1 capitalize font-semibold tracking-wider">
                    {selectedContact.role}
                  </p>
                </div>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {isLoadingMessages && messages.length === 0 ? (
                <div className="flex items-center justify-center h-full">
                  <Spinner size="lg" />
                </div>
              ) : messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center p-8 text-gray-500">
                  <div className="bg-red-50 dark:bg-red-950/20 p-4 rounded-full text-[var(--primary)] mb-4">
                    <MessageSquare className="w-8 h-8" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-1">No Messages Yet</h3>
                  <p className="max-w-xs text-sm">Send a message to start chatting with {selectedContact.name}.</p>
                </div>
              ) : (
                messages.map((msg, index) => {
                  const isOwnMessage = msg.senderId === user.id;
                  
                  return (
                    <div 
                      key={msg.id}
                      className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}
                    >
                      <div className="max-w-[70%] space-y-1">
                        <div 
                          className={`px-4 py-3 rounded-2xl text-sm font-medium shadow-sm leading-relaxed
                            ${isOwnMessage 
                              ? 'bg-[var(--primary)] text-white rounded-tr-none' 
                              : 'bg-white dark:bg-gray-100 text-gray-900 border border-gray-100 dark:border-transparent rounded-tl-none'
                            }
                          `}
                        >
                          {msg.content}
                        </div>
                        <p className={`text-[10px] text-gray-400 font-medium ${isOwnMessage ? 'text-right' : 'text-left'}`}>
                          {formatDate(msg.timestamp)}
                        </p>
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Send Message Input */}
            <form onSubmit={handleSendMessage} className="p-4 bg-white dark:bg-gray-100 border-t border-gray-100 flex gap-3">
              <input
                type="text"
                placeholder="Type your message here..."
                value={newMessageText}
                onChange={(e) => setNewMessageText(e.target.value)}
                className="flex-1 bg-gray-50 dark:bg-gray-50/50 border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[var(--primary)] transition-colors"
              />
              <Button type="submit" size="sm" className="px-4 shrink-0 rounded-xl">
                <Send className="w-4 h-4" />
              </Button>
            </form>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-8 text-gray-500">
            <div className="bg-red-50 dark:bg-red-950/10 p-6 rounded-full text-[var(--primary)] mb-4">
              <MessageSquare className="w-12 h-12 animate-bounce" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Your Inbox</h3>
            <p className="max-w-sm text-sm">Select a conversation from the left to start chatting with your coach or client.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MessagesPage;
