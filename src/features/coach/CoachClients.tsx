import React from 'react';
import { useClients } from '../../hooks/useClients';
import { ClientCard } from '../../components/cards';
import { Input, Select, Button, Spinner } from '../../components/ui';
import { Search, Plus } from 'lucide-react';

export const CoachClients: React.FC = () => {
  const { 
    clients, 
    isLoading, 
    searchTerm, 
    setSearchTerm, 
    filterGoal, 
    setFilterGoal 
  } = useClients();

  const goalOptions = [
    { value: 'all', label: 'All Goals' },
    { value: 'fat-loss', label: 'Fat Loss' },
    { value: 'muscle-gain', label: 'Muscle Gain' },
    { value: 'maintenance', label: 'Maintenance' },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">My Clients</h2>
          <p className="text-gray-500 font-medium">Manage and monitor all your active clients.</p>
        </div>
        <Button leftIcon={<Plus className="w-5 h-5" />}>
          Add New Client
        </Button>
      </div>

      <div className="card">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <Input
              placeholder="Search clients by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              icon={<Search className="w-5 h-5" />}
            />
          </div>
          <div className="md:w-64">
            <Select
              options={goalOptions}
              value={filterGoal}
              onChange={(e) => setFilterGoal(e.target.value)}
            />
          </div>
        </div>
      </div>

      {isLoading ? (
        <Spinner size="lg" />
      ) : clients.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {clients.map(client => (
            <ClientCard key={client.id} client={client} />
          ))}
        </div>
      ) : (
        <div className="card text-center py-16">
          <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-900 mb-2">No Clients Found</h3>
          <p className="text-gray-500">
            {searchTerm || filterGoal !== 'all' 
              ? 'Try adjusting your search or filters.'
              : 'You haven\'t added any clients yet. Start by adding your first client.'}
          </p>
        </div>
      )}
    </div>
  );
};

// Import Users icon
import { Users } from 'lucide-react';

export default CoachClients;
