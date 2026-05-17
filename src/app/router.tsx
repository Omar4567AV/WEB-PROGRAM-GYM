import { createBrowserRouter, Navigate } from 'react-router-dom';

// Layouts
import AuthLayout from '../components/layout/AuthLayout';
import DashboardLayout from '../components/layout/DashboardLayout';

// Guards
import ProtectedRoute from '../features/auth/ProtectedRoute';
import RoleRoute from '../features/auth/RoleRoute';

// Auth Features
import HomePage from '../features/auth/HomePage';
import LoginPage from '../features/auth/LoginPage';
import RegisterPage from '../features/auth/RegisterPage';
import NotFoundPage from '../features/auth/NotFoundPage';

// Client Features
import ClientDashboard from '../features/client/ClientDashboard';
import ClientProfile from '../features/client/ClientProfile';
import SettingsPage from '../features/client/SettingsPage';

// Coach Features
import CoachDashboard from '../features/coach/CoachDashboard';
import CoachClients from '../features/coach/CoachClients';
import CoachClientDetails from '../features/coach/CoachClientDetails';
import ProgramEditor from '../features/workout/ProgramEditor';

// Other Features
import CaloriesCalculator from '../features/calories/CaloriesCalculator';
import WorkoutProgram from '../features/workout/WorkoutProgram';
import ProgressTracking from '../features/progress/ProgressTracking';
import PhotosPage from '../features/photos/PhotosPage';

export const router = createBrowserRouter([
  // Public Routes
  {
    path: '/',
    element: <HomePage />,
  },
  {
    element: <AuthLayout />,
    children: [
      {
        path: '/login',
        element: <LoginPage />,
      },
      {
        path: '/register',
        element: <RegisterPage />,
      },
    ],
  },

  // Protected Dashboard Routes
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <DashboardLayout />,
        children: [
          // Coach Routes
          {
            element: <RoleRoute allowedRoles={['coach']} />,
            children: [
              {
                path: '/coach',
                element: <CoachDashboard />,
              },
              {
                path: '/coach/clients',
                element: <CoachClients />,
              },
              {
                path: '/coach/clients/:id',
                element: <CoachClientDetails />,
              },
              {
                path: '/coach/clients/:id/program',
                element: <ProgramEditor />,
              },
            ],
          },
          
          // Client Routes
          {
            element: <RoleRoute allowedRoles={['client']} />,
            children: [
              {
                path: '/client',
                element: <ClientDashboard />,
              },
              {
                path: '/client/profile',
                element: <ClientProfile />,
              },
              {
                path: '/client/workout',
                element: <WorkoutProgram />,
              },
              {
                path: '/client/calories',
                element: <CaloriesCalculator />,
              },
              {
                path: '/client/progress',
                element: <ProgressTracking />,
              },
              {
                path: '/client/photos',
                element: <PhotosPage />,
              },
            ],
          },

          // Shared Protected Routes
          {
            path: '/settings',
            element: <SettingsPage />,
          },
        ],
      },
    ],
  },

  // Fallback Route
  {
    path: '*',
    element: <NotFoundPage />,
  },
]);

export default router;
