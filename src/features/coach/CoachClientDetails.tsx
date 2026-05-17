import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { clientService } from '../../services/clientService';
import { ClientProfile } from '../../types/user.types';
import { Badge, Button, Spinner } from '../../components/ui';
import { ArrowLeft, User, Activity, Target, Calendar, MessageSquare, Dumbbell } from 'lucide-react';
import { formatDate } from '../../utils/formatters';

export const CoachClientDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [client, setClient] = useState<ClientProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (id) {
      setIsLoading(true);
      clientService.getClientById(id)
        .then(setClient)
        .catch(console.error)
        .finally(() => setIsLoading(false));
    }
  }, [id]);

  if (isLoading) return <Spinner size="lg" />;
  if (!client) return <div className="text-center py-12">Client not found</div>;

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <Link to="/coach/clients">
          <Button variant="ghost" size="sm" className="p-2">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
        <div>
          <h2 className="text-3xl font-bold text-gray-900">{client.name}'s Profile</h2>
          <p className="text-gray-500 font-medium">Manage this client's programs and progress.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Sidebar info */}
        <div className="space-y-6">
          <div className="card flex flex-col items-center text-center">
            <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-100 border-4 border-white shadow-lg mb-4">
              {client.avatarUrl ? (
                <img src={client.avatarUrl} alt={client.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  <User className="w-16 h-16" />
                </div>
              )}
            </div>
            <h3 className="text-xl font-bold text-gray-900">{client.name}</h3>
            <p className="text-gray-500 mb-4">{client.email}</p>
            
            <div className="w-full flex gap-2">
              <Button fullWidth leftIcon={<MessageSquare className="w-4 h-4" />}>
                Message
              </Button>
            </div>
          </div>

          <div className="card space-y-4">
            <h4 className="font-bold text-gray-900 border-b border-gray-100 pb-2">Client Details</h4>
            
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-500">Goal</span>
              <Badge variant="primary" className="capitalize">{client.goal.replace('-', ' ')}</Badge>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-500">Level</span>
              <span className="font-bold capitalize">{client.trainingLevel}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-500">Joined</span>
              <span className="font-bold">{formatDate(client.createdAt)}</span>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <div className="card">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <Dumbbell className="w-5 h-5 text-[var(--primary)]" /> Current Program
              </h3>
              <Button size="sm" variant="outline">Assign New</Button>
            </div>
            
            <div className="text-center py-8 bg-gray-50 rounded-xl border border-gray-100">
              <p className="text-gray-500 font-medium">Program feature integration coming next.</p>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <Activity className="w-5 h-5 text-[var(--primary)]" /> Recent Progress
              </h3>
              <Button size="sm" variant="outline">View All</Button>
            </div>
            
            <div className="text-center py-8 bg-gray-50 rounded-xl border border-gray-100">
              <p className="text-gray-500 font-medium">Progress tracking feature integration coming next.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoachClientDetails;
