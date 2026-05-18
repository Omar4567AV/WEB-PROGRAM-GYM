import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth';
import { Button, Input, Select } from '../../../components/ui';
import { User, Mail, Lock, Phone, Calendar, Heart, Weight, Ruler, Globe, ArrowRight } from 'lucide-react';

export const RegisterClientPage: React.FC = () => {
  const { registerClient } = useAuth();
  const navigate = useNavigate();

  // State fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [age, setAge] = useState<number | ''>('');
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [goal, setGoal] = useState<'fat-loss' | 'maintenance' | 'muscle-gain'>('maintenance');
  const [weight, setWeight] = useState<number | ''>('');
  const [height, setHeight] = useState<number | ''>('');
  const [preferredLanguage, setPreferredLanguage] = useState<'en' | 'ar'>('en');

  // Loading & Error States
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (!name || !email || !password || !confirmPassword || !phone || age === '' || weight === '' || height === '') {
      setError('Please fill in all required fields.');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (Number(age) <= 0) {
      setError('Age must be a positive number.');
      return;
    }

    if (Number(weight) <= 0) {
      setError('Weight must be a positive number.');
      return;
    }

    if (Number(height) <= 0) {
      setError('Height must be a positive number.');
      return;
    }

    try {
      setIsSubmitting(true);
      await registerClient({
        name,
        email,
        phone,
        age: Number(age),
        gender,
        goal,
        weight: Number(weight),
        height: Number(height),
        preferredLanguage,
      });
      // Redirect to the checkout subscription plan page
      navigate('/checkout');
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto my-8 bg-white dark:bg-gray-100 rounded-3xl border border-gray-100 dark:border-transparent shadow-xl p-8 lg:p-12 animate-in fade-in duration-300">
      <div className="text-center mb-8">
        <div className="bg-red-50 dark:bg-red-950/20 text-[var(--primary)] w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-red-500/15">
          <User className="w-8 h-8" />
        </div>
        <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight m-0">Start Your Fitness Journey</h2>
        <p className="text-gray-500 font-semibold text-sm mt-2 mb-0">Create your client account and get a custom training split & diet target.</p>
      </div>

      {error && (
        <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/30 text-red-600 dark:text-red-400 p-4 rounded-xl text-sm font-bold mb-6 text-center animate-shake">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Core Auth Details */}
        <div className="border-b border-gray-100 pb-4 mb-4">
          <h4 className="text-xs uppercase font-extrabold tracking-wider text-gray-400 mb-4">1. Account Information</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Full Name"
              type="text"
              placeholder="Omar Ahmed"
              value={name}
              onChange={(e) => setName(e.target.value)}
              icon={<User className="w-5 h-5 text-gray-400" />}
              required
            />
            <Input
              label="Email Address"
              type="email"
              placeholder="omar@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              icon={<Mail className="w-5 h-5 text-gray-400" />}
              required
            />
            <Input
              label="Password"
              type="password"
              placeholder="Min. 8 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              icon={<Lock className="w-5 h-5 text-gray-400" />}
              required
            />
            <Input
              label="Confirm Password"
              type="password"
              placeholder="Match password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              icon={<Lock className="w-5 h-5 text-gray-400" />}
              required
            />
          </div>
        </div>

        {/* Bio & Metrics details */}
        <div className="border-b border-gray-100 pb-4 mb-4">
          <h4 className="text-xs uppercase font-extrabold tracking-wider text-gray-400 mb-4">2. Physical Profile & Goals</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <Input
              label="Phone Number"
              type="tel"
              placeholder="+20 1234567890"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              icon={<Phone className="w-5 h-5 text-gray-400" />}
              required
            />
            <Input
              label="Age"
              type="number"
              placeholder="25"
              value={age}
              onChange={(e) => setAge(e.target.value === '' ? '' : Number(e.target.value))}
              icon={<Calendar className="w-5 h-5 text-gray-400" />}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <Input
              label="Current Weight (kg)"
              type="number"
              placeholder="80"
              value={weight}
              onChange={(e) => setWeight(e.target.value === '' ? '' : Number(e.target.value))}
              icon={<Weight className="w-5 h-5 text-gray-400" />}
              required
            />
            <Input
              label="Height (cm)"
              type="number"
              placeholder="178"
              value={height}
              onChange={(e) => setHeight(e.target.value === '' ? '' : Number(e.target.value))}
              icon={<Ruler className="w-5 h-5 text-gray-400" />}
              required
            />
            <Select
              label="Gender"
              value={gender}
              onChange={(e) => setGender(e.target.value as 'male' | 'female')}
              options={[
                { value: 'male', label: 'Male' },
                { value: 'female', label: 'Female' }
              ]}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              label="Fitness Goal"
              value={goal}
              onChange={(e) => setGoal(e.target.value as any)}
              options={[
                { value: 'fat-loss', label: 'Fat Loss' },
                { value: 'maintenance', label: 'Maintenance' },
                { value: 'muscle-gain', label: 'Muscle Gain' }
              ]}
              required
            />

            <Select
              label="Preferred Language"
              value={preferredLanguage}
              onChange={(e) => setPreferredLanguage(e.target.value as 'en' | 'ar')}
              options={[
                { value: 'en', label: 'English' },
                { value: 'ar', label: 'العربية (Arabic)' }
              ]}
              required
            />
          </div>
        </div>

        <Button
          type="submit"
          fullWidth
          isLoading={isSubmitting}
          rightIcon={<ArrowRight className="w-4 h-4" />}
          className="py-3 rounded-2xl text-base"
        >
          Create Account & Choose Plan
        </Button>
      </form>

      <p className="mt-8 text-center text-sm font-semibold text-gray-500">
        Already have an account?{' '}
        <Link to="/login" className="font-bold text-[var(--primary)] hover:underline ml-1">
          Sign In
        </Link>
      </p>
    </div>
  );
};

export default RegisterClientPage;
