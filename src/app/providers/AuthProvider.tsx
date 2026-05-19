import React, { useState, ReactNode } from 'react';
import { User } from '../../types/user.types';
import { authService } from '../../services/authService';
import { toast } from 'react-hot-toast';
import { AuthContext, AuthContextType } from './AuthContext';

/**
 * Provider component that wraps the app and provides auth state
 */
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => authService.getCurrentUser());
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const login = async (email: string, password: string): Promise<User> => {
    try {
      setIsLoading(true);
      const { user: loggedInUser } = await authService.login(email, password);
      setUser(loggedInUser);
      return loggedInUser;
    } catch (error: unknown) {
      toast.error((error as Error).message || 'Login failed');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const registerClient = async (userData: Parameters<AuthContextType['registerClient']>[0]): Promise<User> => {
    try {
      setIsLoading(true);
      const { user: registeredUser } = await authService.registerClient(userData);
      setUser(registeredUser);
      return registeredUser;
    } catch (error: unknown) {
      toast.error((error as Error).message || 'Registration failed');
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
        const idx = clientsList.findIndex((c: { id: string }) => c.id === user.id);
        if (idx !== -1) {
          clientsList[idx].subscriptionStatus = status;
          clientsList[idx].status = status === 'active' ? 'active' : 'pending';
          localStorage.setItem(key, JSON.stringify(clientsList));
        }
      }
    }
  };

  /** Merges a partial update into the current auth-session user (state + localStorage). */
  const updateCurrentUser = (partial: Partial<User>) => {
    if (!user) return;
    const updatedUser = { ...user, ...partial };
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  const logout = () => {
    authService.logout();
    setUser(null);
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
    updateCurrentUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
