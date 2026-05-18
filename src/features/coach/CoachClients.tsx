import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useClients } from '../../hooks/useClients';
import { ClientCard } from '../../components/cards';
import { Input, Select, Button, Spinner, Modal } from '../../components/ui';
import { Search, Plus, Users } from 'lucide-react';
import { clientService } from '../../services/clientService';
import { ClientProfile } from '../../types/user.types';
import { toast } from 'react-hot-toast';

const defaultForm = {
  name: '',
  email: '',
  age: '',
  gender: 'male' as ClientProfile['gender'],
  height: '',
  weight: '',
  goal: 'muscle-gain' as ClientProfile['goal'],
  activityLevel: 'moderate' as ClientProfile['activityLevel'],
  trainingLevel: 'beginner' as ClientProfile['trainingLevel'],
};

export const CoachClients: React.FC = () => {
  const { user } = useAuth();
  const {
    clients,
    isLoading,
    searchTerm,
    setSearchTerm,
    filterGoal,
    setFilterGoal,
    prependClient,
    removeClient,
  } = useClients();

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [form, setForm] = useState(defaultForm);

  const handleDeleteClient = async (id: string) => {
    if (!window.confirm('Remove this client? This cannot be undone.')) return;
    try {
      await clientService.deleteClient(id);
      removeClient(id);
      toast.success('Client removed');
    } catch {
      toast.error('Failed to remove client');
    }
  };

  const set = (field: keyof typeof defaultForm) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleClose = () => {
    setForm(defaultForm);
    setIsAddOpen(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setIsSaving(true);
    try {
      const newClient = await clientService.createClient(user.id, {
        name: form.name,
        email: form.email,
        age: Number(form.age),
        gender: form.gender,
        height: Number(form.height),
        weight: Number(form.weight),
        goal: form.goal,
        activityLevel: form.activityLevel,
        trainingLevel: form.trainingLevel,
      });
      prependClient(newClient);
      toast.success(`${newClient.name} added successfully!`);
      handleClose();
    } catch {
      toast.error('Failed to add client');
    } finally {
      setIsSaving(false);
    }
  };

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
        <Button leftIcon={<Plus className="w-5 h-5" />} onClick={() => setIsAddOpen(true)}>
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
            <ClientCard key={client.id} client={client} onDelete={handleDeleteClient} />
          ))}
        </div>
      ) : (
        <div className="card text-center py-16">
          <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-900 mb-2">No Clients Found</h3>
          <p className="text-gray-500">
            {searchTerm || filterGoal !== 'all'
              ? 'Try adjusting your search or filters.'
              : "You haven't added any clients yet. Start by adding your first client."}
          </p>
        </div>
      )}

      <Modal isOpen={isAddOpen} onClose={handleClose} title="Add New Client" maxWidth="lg">
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Identity */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Full Name"
              placeholder="e.g. John Smith"
              value={form.name}
              onChange={set('name')}
              required
            />
            <Input
              label="Email Address"
              type="email"
              placeholder="john@example.com"
              value={form.email}
              onChange={set('email')}
              required
            />
          </div>

          {/* Physical */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <Input
              label="Age"
              type="number"
              placeholder="e.g. 28"
              value={form.age}
              onChange={set('age')}
              required
            />
            <Select
              label="Gender"
              value={form.gender}
              onChange={set('gender')}
              options={[
                { value: 'male', label: 'Male' },
                { value: 'female', label: 'Female' },
              ]}
            />
            <Input
              label="Height (cm)"
              type="number"
              placeholder="e.g. 175"
              value={form.height}
              onChange={set('height')}
              required
            />
            <Input
              label="Weight (kg)"
              type="number"
              step="0.1"
              placeholder="e.g. 80"
              value={form.weight}
              onChange={set('weight')}
              required
            />
          </div>

          {/* Fitness profile */}
          <Select
            label="Primary Goal"
            value={form.goal}
            onChange={set('goal')}
            options={[
              { value: 'fat-loss', label: 'Fat Loss' },
              { value: 'muscle-gain', label: 'Muscle Gain' },
              { value: 'maintenance', label: 'Maintenance' },
            ]}
          />
          <Select
            label="Activity Level"
            value={form.activityLevel}
            onChange={set('activityLevel')}
            options={[
              { value: 'sedentary', label: 'Sedentary (Office job, no exercise)' },
              { value: 'light', label: 'Lightly Active (1–3 days/week)' },
              { value: 'moderate', label: 'Moderately Active (3–5 days/week)' },
              { value: 'active', label: 'Active (6–7 days/week)' },
              { value: 'very-active', label: 'Very Active (Physical job + training)' },
            ]}
          />
          <Select
            label="Training Level"
            value={form.trainingLevel}
            onChange={set('trainingLevel')}
            options={[
              { value: 'beginner', label: 'Beginner' },
              { value: 'intermediate', label: 'Intermediate' },
              { value: 'advanced', label: 'Advanced' },
            ]}
          />

          <div className="pt-2 flex gap-3">
            <Button
              type="button"
              variant="outline"
              fullWidth
              onClick={handleClose}
              disabled={isSaving}
            >
              Cancel
            </Button>
            <Button type="submit" fullWidth isLoading={isSaving}>
              Add Client
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default CoachClients;
