import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Button, Input } from '../../components/ui';
import { Mail, Lock } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('coach@gym.com');
  const [password, setPassword] = useState('password123');
  const { login, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = (location.state as any)?.from?.pathname || '/';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password);
      // We rely on RoleRoute to properly route the user, 
      // but if there's a specific 'from' route, we go there.
      if (from !== '/') {
        navigate(from, { replace: true });
      } else {
        // Just go to root, RoleRoute handles the dashboard redirect
        navigate('/', { replace: true });
      }
    } catch (error) {
      // Error is handled by the auth context toast
    }
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900">Welcome Back</h2>
        <p className="text-gray-500 mt-1">Please enter your details to sign in.</p>
      </div>

      {/* For demo purposes, quick fill buttons */}
      <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-100 flex gap-2">
        <Button 
          variant="outline" 
          size="sm" 
          fullWidth
          className="bg-white"
          onClick={() => { setEmail('coach@gym.com'); setPassword('password123'); }}
        >
          Coach Demo
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          fullWidth
          className="bg-white"
          onClick={() => { setEmail('omar@client.com'); setPassword('password123'); }}
        >
          Client Demo
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <Input
          label="Email Address"
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          icon={<Mail className="w-5 h-5" />}
          required
        />
        
        <Input
          label="Password"
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          icon={<Lock className="w-5 h-5" />}
          required
        />

        <div className="flex items-center justify-between">
          <label className="flex items-center">
            <input type="checkbox" className="rounded text-[var(--primary)] focus:ring-[var(--primary)]" />
            <span className="ml-2 text-sm text-gray-600">Remember me</span>
          </label>
          <a href="#" className="text-sm font-bold text-[var(--primary)] hover:underline">
            Forgot password?
          </a>
        </div>

        <Button type="submit" fullWidth isLoading={isLoading}>
          Sign In
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-gray-600">
        Don't have an account?{' '}
        <Link to="/register" className="font-bold text-[var(--primary)] hover:underline">
          Sign up
        </Link>
      </p>
    </div>
  );
};

export default LoginPage;
