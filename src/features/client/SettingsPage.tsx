import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Button, Input } from '../../components/ui';
import { Bell, Shield, Key, User as UserIcon, Save } from 'lucide-react';
import { toast } from 'react-hot-toast';

export const SettingsPage: React.FC = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      toast.success('Settings updated successfully');
    }, 1000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-gray-900">Settings</h2>
        <p className="text-gray-500 font-medium mt-1">Manage your account preferences and settings.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Settings Navigation */}
        <div className="space-y-1">
          <button className="w-full flex items-center gap-3 px-4 py-3 bg-red-50 text-[var(--primary)] font-medium rounded-lg transition-colors">
            <UserIcon className="w-5 h-5" /> Account Details
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 font-medium rounded-lg transition-colors">
            <Bell className="w-5 h-5" /> Notifications
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 font-medium rounded-lg transition-colors">
            <Shield className="w-5 h-5" /> Privacy & Security
          </button>
        </div>

        {/* Settings Content */}
        <div className="md:col-span-3 space-y-8">
          <div className="card space-y-6">
            <h3 className="text-xl font-bold text-gray-900 border-b border-gray-100 pb-4">Profile Information</h3>
            <form onSubmit={handleSave} className="space-y-6">
              <div className="flex items-center gap-6">
                <div className="w-20 h-20 rounded-full bg-gray-100 overflow-hidden shrink-0 border-2 border-gray-200">
                  {user?.avatarUrl ? (
                    <img src={user.avatarUrl} alt={user.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <UserIcon className="w-8 h-8" />
                    </div>
                  )}
                </div>
                <div>
                  <Button type="button" variant="outline" size="sm" className="mb-2">Change Avatar</Button>
                  <p className="text-xs text-gray-500">JPG, GIF or PNG. Max size of 2MB.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <Input label="Full Name" defaultValue={user?.name} />
                <Input label="Email Address" type="email" defaultValue={user?.email} />
              </div>

              <div className="flex justify-end pt-4 border-t border-gray-100">
                <Button type="submit" leftIcon={<Save className="w-4 h-4" />} isLoading={isLoading}>
                  Save Changes
                </Button>
              </div>
            </form>
          </div>

          <div className="card space-y-6">
            <h3 className="text-xl font-bold text-gray-900 border-b border-gray-100 pb-4 flex items-center gap-2">
              <Key className="w-5 h-5" /> Change Password
            </h3>
            <form onSubmit={handleSave} className="space-y-6">
              <Input label="Current Password" type="password" />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <Input label="New Password" type="password" />
                <Input label="Confirm New Password" type="password" />
              </div>

              <div className="flex justify-end pt-4 border-t border-gray-100">
                <Button type="submit" variant="secondary" isLoading={isLoading}>
                  Update Password
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
