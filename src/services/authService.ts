import { User, UserRole, ClientProfile } from '../types/user.types';
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

    // Support looking in local mock users + any newly registered client in localStorage
    const storedClientsStr = localStorage.getItem('coach_pro_clients_users');
    const storedClients: User[] = storedClientsStr ? JSON.parse(storedClientsStr) : [];
    
    // Check localStorage clients first
    const registeredUser = storedClients.find((u) => u.email === email);
    if (registeredUser) {
      // In a real database we would check passwords. For our mock login we check standard credentials
      const token = 'mock-jwt-token-' + registeredUser.id;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(registeredUser));
      return { user: registeredUser, token };
    }

    const mockUser = allMockUsers.find(
      (u) => u.email === email && u.password === password
    );

    if (mockUser) {
      const { password: _password, ...user } = mockUser;
      const token = 'mock-jwt-token-' + user.id;
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      return { user, token };
    }

    throw new Error('Invalid email or password');
  },

  /**
   * Mock client registration function
   */
  registerClient: async (userData: {
    name: string;
    email: string;
    phone: string;
    age: number;
    gender: 'male' | 'female';
    goal: 'fat-loss' | 'maintenance' | 'muscle-gain';
    weight: number;
    height: number;
    preferredLanguage: 'en' | 'ar';
  }): Promise<{ user: ClientProfile; token: string }> => {
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Create a new client profile user
    const newClient: ClientProfile = {
      id: 'client-' + Date.now(),
      name: userData.name,
      email: userData.email,
      role: 'client',
      age: userData.age,
      gender: userData.gender,
      height: userData.height,
      weight: userData.weight,
      goal: userData.goal,
      activityLevel: 'moderate', // default
      trainingLevel: 'beginner',  // default
      phone: userData.phone,
      preferredLanguage: userData.preferredLanguage,
      subscriptionStatus: 'pending', // Starts as pending
      createdAt: new Date().toISOString(),
    };

    // Save in the localStorage lists of registered users so they can log back in
    const storedClientsStr = localStorage.getItem('coach_pro_clients_users');
    const storedClients: User[] = storedClientsStr ? JSON.parse(storedClientsStr) : [];
    storedClients.push(newClient);
    localStorage.setItem('coach_pro_clients_users', JSON.stringify(storedClients));

    // Also register them into the main client database list for coach-platform to fetch Omar4567AV's client list correctly!
    const key = 'coach_pro_clients';
    const existingClients = localStorage.getItem(key);
    const clientsList = existingClients ? JSON.parse(existingClients) : [];
    clientsList.push({
      ...newClient,
      joinedDate: newClient.createdAt,
      lastCheckIn: null,
      status: 'pending', // matches pending subscription status
    });
    localStorage.setItem(key, JSON.stringify(clientsList));

    const token = 'mock-jwt-token-' + newClient.id;
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(newClient));

    return { user: newClient, token };
  },

  /**
   * Mock registration function (generic)
   */
  register: async (userData: { name: string; email: string; password?: string }): Promise<{ user: User; token: string }> => {
    await new Promise((resolve) => setTimeout(resolve, 800));
    
    const newUser: User = {
      id: 'client-' + Date.now(),
      name: userData.name,
      email: userData.email,
      role: 'client' as UserRole,
      subscriptionStatus: 'active', // default active for quick testing
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
      } catch {
        return null;
      }
    }
    return null;
  },
};

export default authService;
