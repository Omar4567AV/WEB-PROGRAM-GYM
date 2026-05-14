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
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
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

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const { user: loggedInUser } = await authService.login(email, password);
      setUser(loggedInUser);
      toast.success(`Welcome back, ${loggedInUser.name}!`);
    } catch (error: any) {
      toast.error(error.message || 'Login failed');
      throw error;
    } finally {
      setIsLoading(false);
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
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
