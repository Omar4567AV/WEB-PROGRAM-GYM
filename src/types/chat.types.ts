export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: string;
  isRead: boolean;
}

export interface ChatContact {
  id: string;
  name: string;
  role: 'coach' | 'client';
  avatarUrl?: string;
  lastMessage?: string;
  lastMessageTime?: string;
  unreadCount: number;
}
