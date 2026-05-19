import { createContext } from 'react';
import { User, UserRole } from '../../types/user.types';

export interface AuthContextType {
  user: User | null;
  role: UserRole | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<User>;
  registerClient: (userData: {
    name: string;
    email: string;
    password: string;
    phone: string;
    age: number;
    gender: 'male' | 'female';
    goal: 'fat-loss' | 'maintenance' | 'muscle-gain';
    weight: number;
    height: number;
    preferredLanguage: 'en' | 'ar';
  }) => Promise<User>;
  logout: () => void;
  updateUserSubscription: (status: 'active' | 'failed') => void;
  updateCurrentUser: (partial: Partial<User>) => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);
