import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import { ClientProfile as ClientProfileType } from '../../types/user.types';
import { Badge, Button } from '../../components/ui';
import { User, Mail, Calendar, Activity, Target, Edit2 } from 'lucide-react';
import { formatDate } from '../../utils/formatters';

export const ClientProfile: React.FC = () => {
  const { user } = useAuth();
  
  // We cast to ClientProfileType since this page is only accessible to clients
  const profile = user as ClientProfileType | null;

  if (!profile) return null;

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-gray-900">My Profile</h2>
        <Button variant="outline" leftIcon={<Edit2 className="w-4 h-4" />}>
          Edit Profile
        </Button>
      </div>

      <div className="card">
        <div className="flex flex-col md:flex-row gap-8 items-start">
          {/* Avatar Section */}
          <div className="flex flex-col items-center space-y-4">
            <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-100 border-4 border-white shadow-lg relative group">
              {profile.avatarUrl ? (
                <img src={profile.avatarUrl} alt={profile.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  <User className="w-16 h-16" />
                </div>
              )}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                <span className="text-white text-sm font-bold">Change</span>
              </div>
            </div>
            <Badge variant="primary" className="capitalize">
              {profile.role}
            </Badge>
          </div>

          {/* Details Section */}
          <div className="flex-1 w-full grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1">
              <label className="text-sm font-bold text-gray-500 uppercase tracking-wider flex items-center gap-2">
                <User className="w-4 h-4" /> Full Name
              </label>
              <p className="text-lg font-medium text-gray-900">{profile.name}</p>
            </div>
            
            <div className="space-y-1">
              <label className="text-sm font-bold text-gray-500 uppercase tracking-wider flex items-center gap-2">
                <Mail className="w-4 h-4" /> Email Address
              </label>
              <p className="text-lg font-medium text-gray-900">{profile.email}</p>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-bold text-gray-500 uppercase tracking-wider flex items-center gap-2">
                <Calendar className="w-4 h-4" /> Member Since
              </label>
              <p className="text-lg font-medium text-gray-900">{formatDate(profile.createdAt)}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="card space-y-6">
          <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <Activity className="w-5 h-5 text-[var(--primary)]" /> Physical Metrics
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
              <p className="text-sm text-gray-500 mb-1">Age</p>
              <p className="text-2xl font-bold text-gray-900">{profile.age} <span className="text-sm font-normal text-gray-500">yrs</span></p>
            </div>
            <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
              <p className="text-sm text-gray-500 mb-1">Gender</p>
              <p className="text-2xl font-bold text-gray-900 capitalize">{profile.gender}</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
              <p className="text-sm text-gray-500 mb-1">Height</p>
              <p className="text-2xl font-bold text-gray-900">{profile.height} <span className="text-sm font-normal text-gray-500">cm</span></p>
            </div>
            <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
              <p className="text-sm text-gray-500 mb-1">Current Weight</p>
              <p className="text-2xl font-bold text-gray-900">{profile.weight} <span className="text-sm font-normal text-gray-500">kg</span></p>
            </div>
          </div>
        </div>

        <div className="card space-y-6">
          <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <Target className="w-5 h-5 text-[var(--primary)]" /> Fitness Profile
          </h3>
          <div className="space-y-4">
            <div>
              <p className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-2">Primary Goal</p>
              <Badge variant="success" size="md" className="capitalize px-4 py-1.5 text-sm">
                {profile.goal.replace('-', ' ')}
              </Badge>
            </div>
            <div>
              <p className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-2">Activity Level</p>
              <p className="text-lg font-medium text-gray-900 capitalize">{profile.activityLevel.replace('-', ' ')}</p>
            </div>
            <div>
              <p className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-2">Training Experience</p>
              <p className="text-lg font-medium text-gray-900 capitalize">{profile.trainingLevel}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientProfile;
