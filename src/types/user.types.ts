/**
 * User roles for application access control
 */
export type UserRole = 'client' | 'coach';

/**
 * Base User interface with core authentication and identity data
 */
export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
  createdAt: string;
}

/**
 * Detailed profile for Client users including physical metrics and goals
 */
export interface ClientProfile extends User {
  role: 'client';
  age: number;
  gender: 'male' | 'female';
  height: number; // in cm
  weight: number; // in kg
  goal: 'fat-loss' | 'maintenance' | 'muscle-gain';
  activityLevel: 'sedentary' | 'light' | 'moderate' | 'active' | 'very-active';
  trainingLevel: 'beginner' | 'intermediate' | 'advanced';
  coachId?: string;
}

/**
 * Detailed profile for Coach/Admin users
 */
export interface CoachProfile extends User {
  role: 'coach';
  specialization: string[];
  clientsCount: number;
}

/**
 * Auth state for context provider
 */
export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export default User;
