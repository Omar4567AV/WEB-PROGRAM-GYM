import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { User, UserRole } from '../../types/user.types';
import { authService } from '../../services/authService';
import { toast } from 'react-hot-toast';

/**
 * Interface for the Auth Context value
 */
interface AuthContextType {
  user: User | null;
  role: UserRole | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<User>;
  registerClient: (userData: {
    name: string;
    email: string;
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
}

/**
 * Create the context with a default undefined value
 */
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * Provider component that wraps the app and provides auth state
 */
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Initialize auth state from local storage on mount
  useEffect(() => {
    const storedUser = authService.getCurrentUser();
    if (storedUser) {
      setUser(storedUser);
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<User> => {
    try {
      setIsLoading(true);
      const { user: loggedInUser } = await authService.login(email, password);
      setUser(loggedInUser);
      toast.success(`Welcome back, ${loggedInUser.name}!`);
      return loggedInUser;
    } catch (error: any) {
      toast.error(error.message || 'Login failed');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const registerClient = async (userData: any): Promise<User> => {
    try {
      setIsLoading(true);
      const { user: registeredUser } = await authService.registerClient(userData);
      setUser(registeredUser);
      toast.success('Registration successful! Setup your subscription plan next.');
      return registeredUser;
    } catch (error: any) {
      toast.error(error.message || 'Registration failed');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const updateUserSubscription = (status: 'active' | 'failed') => {
    if (user) {
      const updatedUser = { ...user, subscriptionStatus: status };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      // Update in localStorage lists of registered users so persistent session reflects it
      const storedClientsStr = localStorage.getItem('coach_pro_clients_users');
      if (storedClientsStr) {
        const storedClients: User[] = JSON.parse(storedClientsStr);
        const index = storedClients.findIndex((u) => u.id === user.id);
        if (index !== -1) {
          storedClients[index].subscriptionStatus = status;
          localStorage.setItem('coach_pro_clients_users', JSON.stringify(storedClients));
        }
      }
      
      // Also update in coach_pro_clients list
      const key = 'coach_pro_clients';
      const existingClients = localStorage.getItem(key);
      if (existingClients) {
        const clientsList = JSON.parse(existingClients);
        const idx = clientsList.findIndex((c: any) => c.id === user.id);
        if (idx !== -1) {
          clientsList[idx].subscriptionStatus = status;
          clientsList[idx].status = status === 'active' ? 'active' : 'pending';
          localStorage.setItem(key, JSON.stringify(clientsList));
        }
      }
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    toast.success('Logged out successfully');
  };

  const value = {
    user,
    role: user?.role || null,
    isAuthenticated: !!user,
    isLoading,
    login,
    registerClient,
    logout,
    updateUserSubscription,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
