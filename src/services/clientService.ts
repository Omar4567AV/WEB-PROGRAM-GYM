import { ClientProfile } from '../types/user.types';
import { mockClients } from '../data/mockClients';
import { notificationService } from './notificationService';

const CLIENTS_KEY = 'coach_pro_clients';

const getStoredClients = (): ClientProfile[] => {
  const stored = localStorage.getItem(CLIENTS_KEY);
  if (!stored) {
    localStorage.setItem(CLIENTS_KEY, JSON.stringify(mockClients));
    return mockClients;
  }
  return JSON.parse(stored);
};

/**
 * Service for managing client data and profiles.
 */
export const clientService = {
  /**
   * Fetch all clients assigned to a coach
   */
  getClients: async (coachId: string): Promise<ClientProfile[]> => {
    await new Promise((resolve) => setTimeout(resolve, 600));
    return getStoredClients().filter((c) => c.coachId === coachId);
  },

  /**
   * Fetch a single client by ID
   */
  getClientById: async (id: string): Promise<ClientProfile | null> => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    const client = getStoredClients().find((c) => c.id === id);
    return client || null;
  },

  /**
   * Create a new client under a coach
   */
  createClient: async (
    coachId: string,
    data: Omit<ClientProfile, 'id' | 'role' | 'createdAt' | 'coachId'>
  ): Promise<ClientProfile> => {
    await new Promise((resolve) => setTimeout(resolve, 800));
    const clients = getStoredClients();
    const newClient: ClientProfile = {
      ...data,
      id: 'client-' + Date.now(),
      role: 'client',
      coachId,
      createdAt: new Date().toISOString(),
    };
    clients.push(newClient);
    localStorage.setItem(CLIENTS_KEY, JSON.stringify(clients));
    return newClient;
  },

  /**
   * Delete a client by ID
   */
  deleteClient: async (id: string): Promise<boolean> => {
    await new Promise((resolve) => setTimeout(resolve, 600));
    const clients = getStoredClients();
    const filtered = clients.filter((c) => c.id !== id);
    localStorage.setItem(CLIENTS_KEY, JSON.stringify(filtered));
    return true;
  },

  /**
   * Update client profile data
   */
  updateProfile: async (id: string, data: Partial<ClientProfile>): Promise<ClientProfile> => {
    await new Promise((resolve) => setTimeout(resolve, 800));
    const clients = getStoredClients();
    const index = clients.findIndex((c) => c.id === id);
    if (index === -1) throw new Error('Client not found');
    
    const updated = { ...clients[index], ...data };
    clients[index] = updated;
    localStorage.setItem(CLIENTS_KEY, JSON.stringify(clients));

    // Notify client if coach updated their diet / nutrition targets
    const dietFields: (keyof ClientProfile)[] = ['targetCalories', 'targetProtein', 'targetCarbs', 'targetFats'];
    const hasDietUpdate = dietFields.some((field) => field in data);
    if (hasDietUpdate) {
      notificationService.writeNotification(id, 'diet');
    }

    return updated;
  },
};

export default clientService;
