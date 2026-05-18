import { ClientProfile } from '../types/user.types';
import { mockClients } from '../data/mockClients';

/**
 * Service for managing client data and profiles.
 */
export const clientService = {
  /**
   * Fetch all clients assigned to a coach
   */
  getClients: async (coachId: string): Promise<ClientProfile[]> => {
    await new Promise((resolve) => setTimeout(resolve, 600));
    return mockClients.filter((c) => c.coachId === coachId);
  },

  /**
   * Fetch a single client by ID
   */
  getClientById: async (id: string): Promise<ClientProfile | null> => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    const client = mockClients.find((c) => c.id === id);
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
    const newClient: ClientProfile = {
      ...data,
      id: 'client-' + Date.now(),
      role: 'client',
      coachId,
      createdAt: new Date().toISOString(),
    };
    return newClient;
  },

  /**
   * Delete a client by ID
   */
  deleteClient: async (id: string): Promise<boolean> => {
    await new Promise((resolve) => setTimeout(resolve, 600));
    return true;
  },

  /**
   * Update client profile data
   */
  updateProfile: async (id: string, data: Partial<ClientProfile>): Promise<ClientProfile> => {
    await new Promise((resolve) => setTimeout(resolve, 800));
    const client = mockClients.find((c) => c.id === id);
    if (!client) throw new Error('Client not found');
    
    // In a real app, this would be an axios.patch call
    return { ...client, ...data };
  },
};

export default clientService;
