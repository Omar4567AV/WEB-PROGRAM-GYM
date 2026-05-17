import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useClients } from '../../hooks/useClients';
import { StatCard, ClientCard } from '../../components/cards';
import { Users, TrendingUp, Activity, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../../components/ui';
import { mockPrograms } from '../../data/mockPrograms';

export const CoachDashboard: React.FC = () => {
  const { user } = useAuth();
  const { clients, isLoading } = useClients();

  if (!user || user.role !== 'coach') return null;

  const totalClients = clients.length;
  const activePrograms = mockPrograms.filter(p => p.isActive && p.coachId === user.id).length;
  
  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Coach Dashboard</h2>
          <p className="text-gray-500 font-medium">Overview of your business and clients.</p>
        </div>
        <Link to="/coach/clients">
          <Button>View All Clients</Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Clients"
          value={isLoading ? '--' : totalClients}
          icon={<Users className="w-6 h-6" />}
          trend={{ value: 12, isPositive: true }}
        />
        <StatCard
          title="Active Programs"
          value={isLoading ? '--' : activePrograms}
          icon={<Activity className="w-6 h-6" />}
        />
        <StatCard
          title="Client Engagement"
          value="85%"
          icon={<TrendingUp className="w-6 h-6" />}
          subtitle="Check-in completion"
        />
        <StatCard
          title="Tasks Pending"
          value="3"
          icon={<CheckCircle className="w-6 h-6" />}
          subtitle="Program reviews"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-gray-900">Recent Clients</h3>
            <Link to="/coach/clients" className="text-sm font-bold text-[var(--primary)] hover:underline">
              See all
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {isLoading ? (
              <p>Loading clients...</p>
            ) : clients.slice(0, 4).map(client => (
              <ClientCard key={client.id} client={client} />
            ))}
            {clients.length === 0 && !isLoading && (
              <div className="col-span-2 text-center py-8 text-gray-500">
                You have no clients yet.
              </div>
            )}
          </div>
        </div>
        
        <div className="space-y-6">
          <h3 className="text-xl font-bold text-gray-900">Action Items</h3>
          <div className="card space-y-4">
            {[1, 2, 3].map((_, i) => (
              <div key={i} className={`flex items-start gap-3 pb-4 ${i !== 2 ? 'border-b border-gray-100' : ''}`}>
                <div className="w-2 h-2 rounded-full bg-[var(--primary)] mt-2"></div>
                <div>
                  <p className="font-bold text-gray-900">Review Check-in</p>
                  <p className="text-sm text-gray-500">Client {i + 1} submitted their weekly update.</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoachDashboard;
