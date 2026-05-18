import { useState, useEffect, useMemo } from 'react';
import { ClientProfile } from '../types/user.types';
import { clientService } from '../services/clientService';
import { useAuth } from './useAuth';

/**
 * Custom hook for managing and filtering a coach's client list
 */
export const useClients = () => {
  const { user } = useAuth();
  const [clients, setClients] = useState<ClientProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterGoal, setFilterGoal] = useState<string>('all');

  useEffect(() => {
    const fetchClients = async () => {
      if (user?.role === 'coach') {
        setIsLoading(true);
        try {
          const data = await clientService.getClients(user.id);
          setClients(data);
        } catch (error) {
          console.error('Failed to fetch clients:', error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchClients();
  }, [user]);

  /**
   * Filtered list based on search term and goal
   */
  const filteredClients = useMemo(() => {
    return clients.filter((client) => {
      const matchesSearch = client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            client.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesGoal = filterGoal === 'all' || client.goal === filterGoal;
      return matchesSearch && matchesGoal;
    });
  }, [clients, searchTerm, filterGoal]);

  const prependClient = (client: ClientProfile) => {
    setClients((prev) => [client, ...prev]);
  };

  const removeClient = (id: string) => {
    setClients((prev) => prev.filter((c) => c.id !== id));
  };

  return {
    clients: filteredClients,
    totalCount: clients.length,
    isLoading,
    searchTerm,
    setSearchTerm,
    filterGoal,
    setFilterGoal,
    prependClient,
    removeClient,
  };
};

export default useClients;
