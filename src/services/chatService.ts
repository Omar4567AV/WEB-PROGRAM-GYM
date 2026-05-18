import { Message, ChatContact } from '../types/chat.types';
import { mockCoach, mockClients } from '../data/mockUsers';

const MESSAGES_KEY = 'coach_pro_messages';

// Seed initial message data if none exists
const seedInitialMessages = (): Message[] => {
  const initialMessages: Message[] = [
    {
      id: 'm1',
      senderId: 'coach-1',
      receiverId: 'client-1',
      content: 'Hey Omar! I reviewed your progress tracking. Your weight is shifting nicely, but make sure you hit your daily protein goal of 170g!',
      timestamp: new Date(Date.now() - 3600000 * 24 * 2).toISOString(), // 2 days ago
      isRead: true,
    },
    {
      id: 'm2',
      senderId: 'client-1',
      receiverId: 'coach-1',
      content: 'Thanks Coach! I did struggle a bit with getting enough protein on Tuesday. Should I add an extra scoop of whey or focus more on eggs/chicken?',
      timestamp: new Date(Date.now() - 3600000 * 24 * 1.9).toISOString(),
      isRead: true,
    },
    {
      id: 'm3',
      senderId: 'coach-1',
      receiverId: 'client-1',
      content: 'Try adding 150g of chicken breast to your lunch first. It is more filling. If you still fall short, a shake is a great tool!',
      timestamp: new Date(Date.now() - 3600000 * 24).toISOString(), // 1 day ago
      isRead: true,
    },
    {
      id: 'm4',
      senderId: 'client-1',
      receiverId: 'coach-1',
      content: 'Perfect, I will prep the chicken tonight. Also, should I increase the weight on my squats tomorrow? The last set felt a bit too easy.',
      timestamp: new Date(Date.now() - 3600000 * 4).toISOString(), // 4 hours ago
      isRead: false,
    },
    {
      id: 'm5',
      senderId: 'coach-1',
      receiverId: 'client-2',
      content: 'Hi Sara! Great work completing all training sessions this week! How did the lower body day feel for your knees?',
      timestamp: new Date(Date.now() - 3600000 * 24 * 3).toISOString(), // 3 days ago
      isRead: true,
    },
    {
      id: 'm6',
      senderId: 'client-2',
      receiverId: 'coach-1',
      content: 'Hello! It felt much better this time since I focused on pushing through my heels like you said. No knee pain at all!',
      timestamp: new Date(Date.now() - 3600000 * 24 * 2.8).toISOString(),
      isRead: true,
    },
    {
      id: 'm7',
      senderId: 'client-3',
      receiverId: 'coach-1',
      content: 'Coach, I am feeling quite sore after yesterday\'s session. Should I skip today\'s workout or just do cardio?',
      timestamp: new Date(Date.now() - 3600000 * 5).toISOString(), // 5 hours ago
      isRead: false,
    },
  ];

  localStorage.setItem(MESSAGES_KEY, JSON.stringify(initialMessages));
  return initialMessages;
};

export const chatService = {
  getMessages: async (): Promise<Message[]> => {
    const stored = localStorage.getItem(MESSAGES_KEY);
    if (!stored) {
      return seedInitialMessages();
    }
    return JSON.parse(stored);
  },

  getChatHistory: async (user1Id: string, user2Id: string): Promise<Message[]> => {
    const messages = await chatService.getMessages();
    return messages
      .filter(
        (m) =>
          (m.senderId === user1Id && m.receiverId === user2Id) ||
          (m.senderId === user2Id && m.receiverId === user1Id)
      )
      .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  },

  sendMessage: async (senderId: string, receiverId: string, content: string): Promise<Message> => {
    const messages = await chatService.getMessages();
    const newMessage: Message = {
      id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      senderId,
      receiverId,
      content: content.trim(),
      timestamp: new Date().toISOString(),
      isRead: false,
    };

    messages.push(newMessage);
    localStorage.setItem(MESSAGES_KEY, JSON.stringify(messages));
    return newMessage;
  },

  markAsRead: async (userId: string, contactId: string): Promise<void> => {
    const messages = await chatService.getMessages();
    const updated = messages.map((m) => {
      if (m.senderId === contactId && m.receiverId === userId && !m.isRead) {
        return { ...m, isRead: true };
      }
      return m;
    });
    localStorage.setItem(MESSAGES_KEY, JSON.stringify(updated));
  },

  getContactsForUser: async (userId: string, role: 'coach' | 'client'): Promise<ChatContact[]> => {
    const messages = await chatService.getMessages();
    
    if (role === 'coach') {
      // Coach's contacts are their clients
      return mockClients.map((client) => {
        const chatWithClient = messages.filter(
          (m) =>
            (m.senderId === userId && m.receiverId === client.id) ||
            (m.senderId === client.id && m.receiverId === userId)
        ).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

        const lastMsg = chatWithClient[0];
        const unreadCount = messages.filter(
          (m) => m.senderId === client.id && m.receiverId === userId && !m.isRead
        ).length;

        return {
          id: client.id,
          name: client.name,
          role: 'client' as 'client' | 'coach',
          avatarUrl: client.avatarUrl,
          lastMessage: lastMsg ? lastMsg.content : undefined,
          lastMessageTime: lastMsg ? lastMsg.timestamp : undefined,
          unreadCount,
        };
      }).sort((a, b) => {
        if (!a.lastMessageTime) return 1;
        if (!b.lastMessageTime) return -1;
        return new Date(b.lastMessageTime).getTime() - new Date(a.lastMessageTime).getTime();
      });
    } else {
      // Client's contact is their coach
      const chatWithCoach = messages.filter(
        (m) =>
          (m.senderId === userId && m.receiverId === mockCoach.id) ||
          (m.senderId === mockCoach.id && m.receiverId === userId)
      ).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

      const lastMsg = chatWithCoach[0];
      const unreadCount = messages.filter(
        (m) => m.senderId === mockCoach.id && m.receiverId === userId && !m.isRead
      ).length;

      return [
        {
          id: mockCoach.id,
          name: mockCoach.name,
          role: 'coach' as 'client' | 'coach',
          avatarUrl: mockCoach.avatarUrl,
          lastMessage: lastMsg ? lastMsg.content : 'Send your first message to Coach Ahmed!',
          lastMessageTime: lastMsg ? lastMsg.timestamp : undefined,
          unreadCount,
        },
      ];
    }
  },
};
