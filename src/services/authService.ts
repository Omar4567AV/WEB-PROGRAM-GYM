import { User, UserRole } from '../types/user.types';
import { allMockUsers } from '../data/mockUsers';

/**
 * Authentication service handling login, registration, and session management.
 * Currently uses mock data but structured for future API integration.
 */
export const authService = {
  /**
   * Mock login function
   */
  login: async (email: string, password: string): Promise<{ user: User; token: string }> => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    const mockUser = allMockUsers.find(
      (u) => u.email === email && u.password === password
    );

    if (mockUser) {
      const { password, ...user } = mockUser;
      const token = 'mock-jwt-token-' + user.id;
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      return { user, token };
    }

    throw new Error('Invalid email or password');
  },

  /**
   * Mock registration function
   */
  register: async (userData: any): Promise<{ user: User; token: string }> => {
    await new Promise((resolve) => setTimeout(resolve, 800));
    
    const newUser: User = {
      id: 'client-' + Date.now(),
      name: userData.name,
      email: userData.email,
      role: 'client' as UserRole,
      createdAt: new Date().toISOString(),
    };

    const token = 'mock-jwt-token-' + newUser.id;
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(newUser));

    return { user: newUser, token };
  },

  /**
   * Logout function
   */
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  /**
   * Get current user from local storage
   */
  getCurrentUser: (): User | null => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        return JSON.parse(userStr);
      } catch (e) {
        return null;
      }
    }
    return null;
  },
};

export default authService;
