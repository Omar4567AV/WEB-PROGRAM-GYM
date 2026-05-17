import { createBrowserRouter, Navigate } from 'react-router-dom';

// Layouts
import AuthLayout from '../components/layout/AuthLayout';
import DashboardLayout from '../components/layout/DashboardLayout';

// Guards
import ProtectedRoute from '../features/auth/ProtectedRoute';
import RoleRoute from '../features/auth/RoleRoute';

// Features (We will create these next)
import HomePage from '../features/auth/HomePage';
import LoginPage from '../features/auth/LoginPage';
import RegisterPage from '../features/auth/RegisterPage';
import NotFoundPage from '../features/auth/NotFoundPage';

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
                // element: <CoachDashboard />,
                element: <div>Coach Dashboard (Coming Soon)</div>,
              },
              {
                path: '/coach/clients',
                // element: <CoachClients />,
                element: <div>Coach Clients (Coming Soon)</div>,
              },
              {
                path: '/coach/clients/:id',
                // element: <CoachClientDetails />,
                element: <div>Client Details (Coming Soon)</div>,
              },
            ],
          },
          
          // Client Routes
          {
            element: <RoleRoute allowedRoles={['client']} />,
            children: [
              {
                path: '/client',
                // element: <ClientDashboard />,
                element: <div>Client Dashboard (Coming Soon)</div>,
              },
              {
                path: '/client/profile',
                // element: <ClientProfile />,
                element: <div>Client Profile (Coming Soon)</div>,
              },
              {
                path: '/client/workout',
                // element: <WorkoutProgram />,
                element: <div>Workout Program (Coming Soon)</div>,
              },
              {
                path: '/client/calories',
                // element: <CaloriesCalculator />,
                element: <div>Calories Calculator (Coming Soon)</div>,
              },
              {
                path: '/client/progress',
                // element: <ProgressTracking />,
                element: <div>Progress Tracking (Coming Soon)</div>,
              },
              {
                path: '/client/photos',
                // element: <PhotosPage />,
                element: <div>Photos Page (Coming Soon)</div>,
              },
            ],
          },

          // Shared Protected Routes
          {
            path: '/settings',
            // element: <SettingsPage />,
            element: <div>Settings Page (Coming Soon)</div>,
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
