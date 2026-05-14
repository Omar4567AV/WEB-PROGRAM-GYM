import { User, ClientProfile, CoachProfile } from '../types/user.types';

/**
 * Interface for mock users that includes credentials for simulation
 */
export interface MockUser extends User {
  password: string;
}

export const mockCoach: CoachProfile & { password: string } = {
  id: 'coach-1',
  name: 'Ahmed Coach',
  email: 'coach@gym.com',
  password: 'password123',
  role: 'coach',
  avatarUrl: 'https://images.unsplash.com/photo-1583454110551-21f2fa202214?w=400',
  specialization: ['Bodybuilding', 'Powerlifting', 'Fat Loss'],
  clientsCount: 5,
  createdAt: '2024-01-01T10:00:00Z',
};

export const mockClients: (ClientProfile & { password: string })[] = [
  {
    id: 'client-1',
    name: 'Omar Hassan',
    email: 'omar@client.com',
    password: 'password123',
    role: 'client',
    avatarUrl: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400',
    age: 28,
    gender: 'male',
    height: 180,
    weight: 85,
    goal: 'muscle-gain',
    activityLevel: 'moderate',
    trainingLevel: 'intermediate',
    coachId: 'coach-1',
    createdAt: '2024-01-15T10:00:00Z',
  },
  {
    id: 'client-2',
    name: 'Sara Ali',
    email: 'sara@client.com',
    password: 'password123',
    role: 'client',
    avatarUrl: 'https://images.unsplash.com/photo-1548690312-e3b507d8c110?w=400',
    age: 24,
    gender: 'female',
    height: 165,
    weight: 65,
    goal: 'fat-loss',
    activityLevel: 'active',
    trainingLevel: 'beginner',
    coachId: 'coach-1',
    createdAt: '2024-02-01T10:00:00Z',
  },
  {
    id: 'client-3',
    name: 'Khalid Mansour',
    email: 'khalid@client.com',
    password: 'password123',
    role: 'client',
    avatarUrl: 'https://images.unsplash.com/photo-1597347343908-2937e7dcc560?w=400',
    age: 35,
    gender: 'male',
    height: 175,
    weight: 95,
    goal: 'fat-loss',
    activityLevel: 'sedentary',
    trainingLevel: 'beginner',
    coachId: 'coach-1',
    createdAt: '2024-02-10T10:00:00Z',
  },
  {
    id: 'client-4',
    name: 'Layla Fawzi',
    email: 'layla@client.com',
    password: 'password123',
    role: 'client',
    avatarUrl: 'https://images.unsplash.com/photo-1518310383802-640c2de311b2?w=400',
    age: 30,
    gender: 'female',
    height: 170,
    weight: 60,
    goal: 'maintenance',
    activityLevel: 'very-active',
    trainingLevel: 'advanced',
    coachId: 'coach-1',
    createdAt: '2024-03-05T10:00:00Z',
  },
  {
    id: 'client-5',
    name: 'Youssef Eid',
    email: 'youssef@client.com',
    password: 'password123',
    role: 'client',
    avatarUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400',
    age: 22,
    gender: 'male',
    height: 185,
    weight: 78,
    goal: 'muscle-gain',
    activityLevel: 'moderate',
    trainingLevel: 'intermediate',
    coachId: 'coach-1',
    createdAt: '2024-03-20T10:00:00Z',
  },
];

export const allMockUsers = [mockCoach, ...mockClients];

export default allMockUsers;
