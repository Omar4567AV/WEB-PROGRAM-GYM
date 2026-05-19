import { ClientProfile } from '../types/user.types';
import { mockClients as usersWithPasswords } from './mockUsers';

/**
 * Clean client profiles without password fields for data display
 */
export const mockClients: ClientProfile[] = usersWithPasswords.map(
  ({ password: _password, ...client }) => client as ClientProfile
);

/**
 * Helper to get a single client by ID
 */
export const getMockClientById = (id: string): ClientProfile | undefined => {
  return mockClients.find((client) => client.id === id);
};

export default mockClients;
