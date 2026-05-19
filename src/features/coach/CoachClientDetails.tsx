import React, { useCallback, useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { clientService } from '../../services/clientService';
import { ClientProfile } from '../../types/user.types';
import { Badge, Button, Spinner, Modal, Input, Select } from '../../components/ui';
import { ArrowLeft, User, Activity, Target, MessageSquare, Dumbbell, Edit2, Trash2 } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { formatDate } from '../../utils/formatters';
import { useWorkout } from '../../hooks/useWorkout';
import { ProgramCard } from '../../components/cards';
import { progressService } from '../../services/progressService';
import { WeeklyEntry } from '../../types/progress.types';
import { Program, ProgramType } from '../../types/workout.types';

export const CoachClientDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [client, setClient] = useState<ClientProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);

  const { program, updateProgram } = useWorkout(id);
  const [latestProgress, setLatestProgress] = useState<WeeklyEntry | null>(null);
  const [allProgress, setAllProgress] = useState<WeeklyEntry[]>([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isProgressModalOpen, setIsProgressModalOpen] = useState(false);
  const [isProgramModalOpen, setIsProgramModalOpen] = useState(false);
  const [isDietModalOpen, setIsDietModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editFormData, setEditFormData] = useState<Partial<ClientProfile>>({});
  const [dietFormData, setDietFormData] = useState<{
    targetCalories?: number;
    targetProtein?: number;
    targetCarbs?: number;
    targetFats?: number;
  }>({});

  const loadClientData = useCallback(async () => {
    if (!id) return;
    setIsLoading(true);
    try {
      const [clientData, progressData] = await Promise.all([
        clientService.getClientById(id),
        progressService.getProgressByClientId(id),
      ]);
      setClient(clientData);
      setAllProgress(progressData);
      setLatestProgress(progressData.length > 0 ? progressData[0] : null);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadClientData();
  }, [loadClientData]);

  const handleDelete = async () => {
    if (!id || !window.confirm(`Remove ${client?.name}? This cannot be undone.`)) return;
    setIsDeleting(true);
    try {
      await clientService.deleteClient(id);
      toast.success('Client removed');
      navigate('/coach/clients', { replace: true });
    } catch {
      toast.error('Failed to remove client');
      setIsDeleting(false);
    }
  };

  if (isLoading) return <Spinner size="lg" />;
  if (!client) return <div className="text-center py-12">Client not found</div>;

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-gray-100 pb-5">
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
        <div className="flex flex-wrap gap-2 w-full sm:w-auto justify-start sm:justify-end">
          <Button
            variant="outline"
            leftIcon={<Edit2 className="w-4 h-4" />}
            onClick={() => {
              setEditFormData({
                goal: client.goal,
                trainingLevel: client.trainingLevel,
                weight: client.weight,
                height: client.height,
                age: client.age,
                gender: client.gender,
                activityLevel: client.activityLevel,
              });
              setIsEditModalOpen(true);
            }}
          >
            Edit Client
          </Button>
          <Button
            variant="danger"
            leftIcon={<Trash2 className="w-4 h-4" />}
            onClick={handleDelete}
            isLoading={isDeleting}
          >
            Remove Client
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
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
              <Button
                fullWidth
                leftIcon={<MessageSquare className="w-4 h-4" />}
                onClick={() => navigate('/messages', { state: { contactId: client.id } })}
              >
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
              <div className="flex flex-wrap gap-2 justify-end">
                {program && (
                  <Link to={`/coach/clients/${id}/program`}>
                    <Button size="sm">Edit Exercises</Button>
                  </Link>
                )}
                <Button size="sm" variant="outline" onClick={() => setIsProgramModalOpen(true)}>Assign New</Button>
              </div>
            </div>
            {program ? (
              <ProgramCard program={program} />
            ) : (
              <div className="text-center py-8 bg-gray-50 rounded-xl border border-gray-100">
                <p className="text-gray-500 font-medium">No active program assigned yet.</p>
              </div>
            )}
          </div>

          <div className="card">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <Target className="w-5 h-5 text-[var(--primary)]" /> Custom Diet Targets
              </h3>
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  setDietFormData({
                    targetCalories: client.targetCalories,
                    targetProtein: client.targetProtein,
                    targetCarbs: client.targetCarbs,
                    targetFats: client.targetFats,
                  });
                  setIsDietModalOpen(true);
                }}
              >
                Edit Diet
              </Button>
            </div>
            {client.targetCalories ? (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="bg-gray-50 p-4 rounded-xl text-center">
                  <span className="text-gray-500 block text-xs uppercase font-bold tracking-wider mb-1">Calories</span>
                  <span className="font-bold text-2xl text-gray-900">{client.targetCalories}</span>
                </div>
                <div className="bg-gray-50 p-4 rounded-xl text-center">
                  <span className="text-gray-500 block text-xs uppercase font-bold tracking-wider mb-1">Protein</span>
                  <span className="font-bold text-2xl text-[var(--primary)]">{client.targetProtein}g</span>
                </div>
                <div className="bg-gray-50 p-4 rounded-xl text-center">
                  <span className="text-gray-500 block text-xs uppercase font-bold tracking-wider mb-1">Carbs</span>
                  <span className="font-bold text-2xl text-blue-600 dark:text-blue-400">{client.targetCarbs}g</span>
                </div>
                <div className="bg-gray-50 p-4 rounded-xl text-center">
                  <span className="text-gray-500 block text-xs uppercase font-bold tracking-wider mb-1">Fats</span>
                  <span className="font-bold text-2xl text-yellow-600 dark:text-yellow-400">{client.targetFats}g</span>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 bg-gray-50 rounded-xl border border-gray-100">
                <p className="text-gray-500 font-medium">No custom diet targets assigned.</p>
              </div>
            )}
          </div>

          <div className="card">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <Activity className="w-5 h-5 text-[var(--primary)]" /> Recent Progress
              </h3>
              <Button size="sm" variant="outline" onClick={() => setIsProgressModalOpen(true)}>View All</Button>
            </div>
            {latestProgress ? (
              <div className="space-y-4">
                <div className="pb-4 border-b border-gray-100">
                  <p className="text-sm text-gray-500 mb-1">Latest Check-in</p>
                  <p className="font-bold">{formatDate(latestProgress.date)}</p>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-1">Weight</p>
                    <p className="font-bold text-gray-900">{latestProgress.measurements.weight} kg</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-1">Mood</p>
                    <p className="font-bold text-gray-900 capitalize">{latestProgress.mood}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-1">Energy</p>
                    <p className="font-bold text-gray-900">{latestProgress.energyLevel}/10</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 bg-gray-50 rounded-xl border border-gray-100">
                <p className="text-gray-500 font-medium">No progress entries submitted yet.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <Modal
        isOpen={isEditModalOpen}
        onClose={() => !isSaving && setIsEditModalOpen(false)}
        title="Edit Client Details"
      >
        <form
          className="space-y-4"
          onSubmit={async (e) => {
            e.preventDefault();
            if (!id) return;
            setIsSaving(true);
            try {
              const updated = await clientService.updateProfile(id, editFormData);
              setClient(updated);
              toast.success('Client updated successfully');
              setIsEditModalOpen(false);
            } catch {
              toast.error('Failed to update client');
            } finally {
              setIsSaving(false);
            }
          }}
        >
          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Gender"
              value={editFormData.gender || ''}
              onChange={(e) => setEditFormData({ ...editFormData, gender: e.target.value as ClientProfile['gender'] })}
              options={[
                { value: 'male', label: 'Male' },
                { value: 'female', label: 'Female' },
              ]}
            />
            <Input
              label="Age"
              type="number"
              value={editFormData.age || ''}
              onChange={(e) => setEditFormData({ ...editFormData, age: Number(e.target.value) })}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Weight (kg)"
              type="number"
              value={editFormData.weight || ''}
              onChange={(e) => setEditFormData({ ...editFormData, weight: Number(e.target.value) })}
            />
            <Input
              label="Height (cm)"
              type="number"
              value={editFormData.height || ''}
              onChange={(e) => setEditFormData({ ...editFormData, height: Number(e.target.value) })}
            />
          </div>
          <Select
            label="Goal"
            value={editFormData.goal || ''}
            onChange={(e) => setEditFormData({ ...editFormData, goal: e.target.value as ClientProfile['goal'] })}
            options={[
              { value: 'fat-loss', label: 'Fat Loss' },
              { value: 'muscle-gain', label: 'Muscle Gain' },
              { value: 'maintenance', label: 'Maintenance' },
            ]}
          />
          <Select
            label="Activity Level"
            value={editFormData.activityLevel || ''}
            onChange={(e) => setEditFormData({ ...editFormData, activityLevel: e.target.value as ClientProfile['activityLevel'] })}
            options={[
              { value: 'sedentary', label: 'Sedentary' },
              { value: 'light', label: 'Lightly Active' },
              { value: 'moderate', label: 'Moderately Active' },
              { value: 'active', label: 'Very Active' },
              { value: 'very-active', label: 'Extra Active' },
            ]}
          />
          <Select
            label="Training Level"
            value={editFormData.trainingLevel || ''}
            onChange={(e) => setEditFormData({ ...editFormData, trainingLevel: e.target.value as ClientProfile['trainingLevel'] })}
            options={[
              { value: 'beginner', label: 'Beginner' },
              { value: 'intermediate', label: 'Intermediate' },
              { value: 'advanced', label: 'Advanced' },
            ]}
          />

          <div className="pt-4 flex gap-3">
            <Button
              type="button"
              variant="outline"
              fullWidth
              onClick={() => setIsEditModalOpen(false)}
              disabled={isSaving}
            >
              Cancel
            </Button>
            <Button type="submit" fullWidth isLoading={isSaving}>
              Save Changes
            </Button>
          </div>
        </form>
      </Modal>

      {/* Progress History Modal */}
      <Modal
        isOpen={isProgressModalOpen}
        onClose={() => setIsProgressModalOpen(false)}
        title="Full Progress History"
      >
        <div className="space-y-4 max-h-[60vh] overflow-y-auto">
          {allProgress.length === 0 ? (
            <div className="text-center py-8 text-gray-500">No check-in history found.</div>
          ) : (
            allProgress.map((entry) => (
              <div key={entry.id} className="p-4 border border-gray-100 rounded-xl bg-gray-50">
                <div className="flex justify-between items-center mb-3">
                  <span className="font-bold text-gray-900">{formatDate(entry.date)}</span>
                  <Badge variant="primary" className="capitalize">{entry.mood}</Badge>
                </div>
                <div className="grid grid-cols-3 gap-2 text-sm">
                  <div>
                    <span className="text-gray-500 block text-xs uppercase font-bold tracking-wider">Weight</span>
                    <span className="font-medium text-gray-900">{entry.measurements.weight} kg</span>
                  </div>
                  <div>
                    <span className="text-gray-500 block text-xs uppercase font-bold tracking-wider">Energy</span>
                    <span className="font-medium text-gray-900">{entry.energyLevel}/10</span>
                  </div>
                  <div>
                    <span className="text-gray-500 block text-xs uppercase font-bold tracking-wider">Sleep</span>
                    <span className="font-medium text-gray-900">{entry.sleepQuality}/10</span>
                  </div>
                </div>
                {entry.notes && (
                  <p className="mt-3 text-sm text-gray-600 bg-white p-3 rounded-lg border border-gray-100">
                    "{entry.notes}"
                  </p>
                )}
              </div>
            ))
          )}
        </div>
      </Modal>

      {/* Assign Program Modal */}
      <Modal
        isOpen={isProgramModalOpen}
        onClose={() => !isSaving && setIsProgramModalOpen(false)}
        title="Assign New Program"
      >
        <form
          className="space-y-4"
          onSubmit={async (e) => {
            e.preventDefault();
            if (!id || !client) return;
            setIsSaving(true);
            try {
              const formData = new FormData(e.currentTarget);
              const newProgram: Program = {
                id: 'prog-' + Date.now(),
                clientId: id,
                coachId: client.coachId ?? '',
                title: formData.get('title') as string,
                description: formData.get('description') as string,
                type: formData.get('type') as ProgramType,
                startDate: new Date().toISOString().split('T')[0],
                days: [],
                isActive: true,
              };
              await updateProgram(newProgram);
              setIsProgramModalOpen(false);
            } catch {
              // handled by hook
            } finally {
              setIsSaving(false);
            }
          }}
        >
          <Input label="Program Title" name="title" required placeholder="e.g. 12-Week Shred" />
          <div className="space-y-1.5">
            <label className="text-sm font-bold uppercase tracking-wide text-gray-700">Description</label>
            <textarea
              name="description"
              required
              className="w-full bg-white border-2 border-gray-200 rounded-lg px-4 py-2.5 outline-none focus:border-[var(--primary)] focus:ring-2 focus:ring-red-500/10 transition-all duration-200 min-h-[100px]"
              placeholder="Program overview..."
            />
          </div>
          <Select
            label="Program Type"
            name="type"
            required
            options={[
              { value: 'Full Body', label: 'Full Body' },
              { value: 'Push Pull Legs', label: 'Push Pull Legs' },
              { value: 'Upper Lower', label: 'Upper Lower' },
              { value: 'Fat Loss', label: 'Fat Loss' },
              { value: 'Muscle Gain', label: 'Muscle Gain' },
            ]}
          />

          <div className="pt-4 flex gap-3">
            <Button
              type="button"
              variant="outline"
              fullWidth
              onClick={() => setIsProgramModalOpen(false)}
              disabled={isSaving}
            >
              Cancel
            </Button>
            <Button type="submit" fullWidth isLoading={isSaving}>
              Create & Assign
            </Button>
          </div>
        </form>
      </Modal>

      {/* Edit Diet Modal */}
      <Modal
        isOpen={isDietModalOpen}
        onClose={() => !isSaving && setIsDietModalOpen(false)}
        title="Custom Diet Targets"
      >
        <form
          className="space-y-4"
          onSubmit={async (e) => {
            e.preventDefault();
            if (!id) return;
            setIsSaving(true);
            try {
              const updated = await clientService.updateProfile(id, { ...client, ...dietFormData });
              setClient(updated);
              toast.success('Diet targets updated successfully');
              setIsDietModalOpen(false);
            } catch {
              toast.error('Failed to update diet');
            } finally {
              setIsSaving(false);
            }
          }}
        >
          <div className="p-4 bg-red-50 text-red-800 rounded-lg text-sm mb-4">
            Setting custom values here overrides the automatic calculator for this client.
          </div>
          <Input
            label="Daily Calories (kcal)"
            type="number"
            required
            value={dietFormData.targetCalories || ''}
            onChange={(e) => setDietFormData({ ...dietFormData, targetCalories: Number(e.target.value) })}
          />
          <div className="grid grid-cols-3 gap-4">
            <Input
              label="Protein (g)"
              type="number"
              required
              value={dietFormData.targetProtein || ''}
              onChange={(e) => setDietFormData({ ...dietFormData, targetProtein: Number(e.target.value) })}
            />
            <Input
              label="Carbs (g)"
              type="number"
              required
              value={dietFormData.targetCarbs || ''}
              onChange={(e) => setDietFormData({ ...dietFormData, targetCarbs: Number(e.target.value) })}
            />
            <Input
              label="Fats (g)"
              type="number"
              required
              value={dietFormData.targetFats || ''}
              onChange={(e) => setDietFormData({ ...dietFormData, targetFats: Number(e.target.value) })}
            />
          </div>

          <div className="pt-4 flex gap-3">
            <Button
              type="button"
              variant="outline"
              fullWidth
              onClick={() => setIsDietModalOpen(false)}
              disabled={isSaving}
            >
              Cancel
            </Button>
            <Button type="submit" fullWidth isLoading={isSaving}>
              Save Targets
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default CoachClientDetails;
