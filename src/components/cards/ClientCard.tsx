import React from 'react';
import { ClientProfile } from '../../types/user.types';
import { Badge } from '../ui/Badge';
import { User, Activity, Target } from 'lucide-react';
import { Link } from 'react-router-dom';

interface ClientCardProps {
  client: ClientProfile;
}

export const ClientCard: React.FC<ClientCardProps> = ({ client }) => {
  return (
    <Link to={`/coach/clients/${client.id}`} className="block">
      <div className="card hover:border-[var(--primary)] transition-colors cursor-pointer group">
        <div className="flex items-start gap-4">
          {/* Avatar */}
          <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-100 flex-shrink-0 border-2 border-transparent group-hover:border-[var(--primary)] transition-colors">
            {client.avatarUrl ? (
              <img 
                src={client.avatarUrl} 
                alt={client.name} 
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                <User className="w-8 h-8" />
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-bold text-gray-900 truncate">{client.name}</h3>
            
            <div className="mt-2 space-y-2">
              <div className="flex items-center text-sm text-gray-600">
                <Target className="w-4 h-4 mr-2 text-gray-400" />
                <span className="capitalize">{client.goal.replace('-', ' ')}</span>
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <Activity className="w-4 h-4 mr-2 text-gray-400" />
                <span className="capitalize">{client.trainingLevel}</span>
              </div>
            </div>

            <div className="mt-4 flex gap-2">
              <Badge variant="ghost" size="sm">{client.weight} kg</Badge>
              <Badge variant="ghost" size="sm">{client.age} yrs</Badge>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ClientCard;
