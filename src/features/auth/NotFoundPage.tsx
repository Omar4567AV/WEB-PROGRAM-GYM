import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { AlertTriangle, Home } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[var(--background)] flex items-center justify-center p-4 text-center">
      <div className="max-w-md w-full">
        <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-red-100 text-[var(--primary)] mb-8 shadow-xl shadow-red-500/20">
          <AlertTriangle className="w-12 h-12" />
        </div>
        <h1 className="text-6xl font-bold text-gray-900 mb-4 font-['Oswald']">404</h1>
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Page Not Found</h2>
        <p className="text-gray-500 mb-8 font-medium">
          Oops! The page you are looking for doesn't exist or has been moved.
        </p>
        <Link to="/">
          <Button leftIcon={<Home className="w-5 h-5" />}>
            Back to Home
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;
