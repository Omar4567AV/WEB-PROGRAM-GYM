import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth';
import { Button, Input, Select } from '../../../components/ui';
import {
  User, Mail, Lock, Phone, Calendar, Weight, Ruler, ArrowRight,
  Dumbbell, MessageSquare, Flame, ShieldCheck, CheckCircle2
} from 'lucide-react';

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
        password,
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
    <div className="min-h-screen w-full bg-[var(--background)] py-8 sm:py-16 px-4 sm:px-6 transition-colors duration-300 flex items-center justify-center">
      {/* 1. Fully responsive width container */}
      <div className="w-full max-w-md sm:max-w-2xl md:max-w-3xl lg:max-w-5xl mx-auto">
        
        {/* 2. Card with highly comfortable responsive padding & full width */}
        <div className="bg-[var(--card-bg)] border border-[var(--border)] rounded-3xl shadow-xl p-5 sm:p-8 md:p-12 lg:p-16 animate-in fade-in duration-300 w-full">
          
          {/* Centered Brand Header */}
          <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-10">
            <div className="inline-flex items-center gap-2.5 mb-3">
              <div className="bg-red-50 dark:bg-red-950/20 text-[var(--primary)] p-2.5 rounded-xl shadow-sm">
                <Dumbbell className="w-5.5 h-5.5 sm:w-6 h-6" />
              </div>
              <span className="text-xl sm:text-2xl font-bold font-sans tracking-tight text-[var(--text-main)]">
                COACH<span className="text-[var(--primary)]">PRO</span>
              </span>
            </div>

            {/* Top Title fixed for small mobile devices */}
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[var(--text-main)] tracking-tight leading-tight m-0 uppercase break-words px-1">
              Create Your Coach <span className="text-[var(--primary)]">Platform Account</span>
            </h1>

            <p className="text-sm lg:text-base text-[var(--text-muted)] mt-3 leading-relaxed font-semibold">
              Unlock a scientific, customized fitness and nutrition program fully managed by your personal trainer. Register today to access your dashboard.
            </p>
          </div>

          {/* 6. Benefits Card with stacking/wrapping fixes to prevent icon & text overlap */}
          <div className="mb-10 bg-[var(--background)] border border-[var(--border)] rounded-2xl p-5 sm:p-8 shadow-sm">
            <h3 className="text-xs font-extrabold text-[var(--text-main)] uppercase tracking-wider mb-6 text-center">
              What you will unlock:
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { Icon: Flame, label: 'Workouts', desc: 'Personalized workout programs & splits.' },
                { Icon: CheckCircle2, label: 'Nutrition', desc: 'Meal tracking & coach feedback.' },
                { Icon: ShieldCheck, label: 'Progress', desc: 'Weight, height & photo metrics.' },
                { Icon: MessageSquare, label: 'Support', desc: 'Direct messaging with your coach.' },
              ].map(({ Icon, label, desc }) => (
                <div key={label} className="flex flex-col sm:flex-row gap-3 sm:gap-3.5 items-center sm:items-start text-center sm:text-left px-2 sm:px-0">
                  <div className="bg-red-50 dark:bg-red-950/10 text-[var(--primary)] p-2 rounded-lg shrink-0">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-[var(--text-main)] uppercase m-0">{label}</h4>
                    <p className="text-[11px] sm:text-xs text-[var(--text-muted)] mt-1 font-semibold leading-relaxed">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Step Indicator segment bar */}
          <div className="flex flex-wrap justify-between items-center gap-2 mb-8 sm:mb-10 bg-[var(--background)] p-1.5 sm:p-2 rounded-2xl border border-[var(--border)] max-w-2xl mx-auto w-full">
            <div className="flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-[var(--card-bg)] rounded-xl shadow-sm border border-[var(--border)]">
              <span className="flex items-center justify-center w-5 sm:w-6 h-5 sm:h-6 rounded-full bg-[var(--primary)] text-white text-[10px] sm:text-[11px] font-bold">1</span>
              <span className="text-[10px] sm:text-xs font-bold text-[var(--text-main)] uppercase tracking-wider font-sans">Account</span>
            </div>
            <div className="w-4 sm:w-6 h-px bg-[var(--border)] hidden sm:block flex-grow" />
            <div className="flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2">
              <span className="flex items-center justify-center w-5 sm:w-6 h-5 sm:h-6 rounded-full bg-[var(--border)] text-[var(--text-muted)] text-[10px] sm:text-[11px] font-bold font-sans">2</span>
              <span className="text-[10px] sm:text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider font-sans">Profile</span>
            </div>
            <div className="w-4 sm:w-6 h-px bg-[var(--border)] hidden sm:block flex-grow" />
            <div className="flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2">
              <span className="flex items-center justify-center w-5 sm:w-6 h-5 sm:h-6 rounded-full bg-[var(--border)] text-[var(--text-muted)] text-[10px] sm:text-[11px] font-bold font-sans">3</span>
              <span className="text-[10px] sm:text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider font-sans">Goals</span>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/30 text-red-600 dark:text-red-400 p-4 rounded-xl text-sm font-bold mb-8 text-center animate-shake max-w-2xl mx-auto w-full">
              {error}
            </div>
          )}

          {/* Form with mt-8 and space-y-8 for clean readable structure */}
          <form onSubmit={handleSubmit} className="mt-8 space-y-8 sm:space-y-10">

            {/* SECTION 1 — Account Information */}
            <div className="space-y-4">
              <div className="relative mb-5">
                <div className="absolute inset-0 flex items-center" aria-hidden="true">
                  <div className="w-full border-t border-[var(--border)]" />
                </div>
                <div className="relative flex justify-start">
                  <span className="bg-[var(--card-bg)] pr-4 text-xs font-extrabold uppercase tracking-widest text-[var(--primary)]">
                    SECTION 1 — Account Information
                  </span>
                </div>
              </div>

              {/* Stacked on mobile (grid-cols-1), 2 columns on tablet/desktop (sm:grid-cols-2) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <Input
                  label="Full Name"
                  type="text"
                  placeholder="Omar Ahmed"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  icon={<User className="w-5 h-5 text-gray-400" />}
                  className="h-14 rounded-xl border-[var(--border)] bg-[var(--background)] text-[var(--text-main)] focus:border-[var(--primary)] px-4 text-base"
                  required
                />
                <Input
                  label="Email Address"
                  type="email"
                  placeholder="omar@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  icon={<Mail className="w-5 h-5 text-gray-400" />}
                  className="h-14 rounded-xl border-[var(--border)] bg-[var(--background)] text-[var(--text-main)] focus:border-[var(--primary)] px-4 text-base"
                  required
                />
                <Input
                  label="Password"
                  type="password"
                  placeholder="Min. 8 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  icon={<Lock className="w-5 h-5 text-gray-400" />}
                  className="h-14 rounded-xl border-[var(--border)] bg-[var(--background)] text-[var(--text-main)] focus:border-[var(--primary)] px-4 text-base"
                  required
                />
                <Input
                  label="Confirm Password"
                  type="password"
                  placeholder="Match password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  icon={<Lock className="w-5 h-5 text-gray-400" />}
                  className="h-14 rounded-xl border-[var(--border)] bg-[var(--background)] text-[var(--text-main)] focus:border-[var(--primary)] px-4 text-base"
                  required
                />
              </div>
            </div>

            {/* SECTION 2 — Physical Profile */}
            <div className="space-y-4">
              <div className="relative mb-5">
                <div className="absolute inset-0 flex items-center" aria-hidden="true">
                  <div className="w-full border-t border-[var(--border)]" />
                </div>
                <div className="relative flex justify-start">
                  <span className="bg-[var(--card-bg)] pr-4 text-xs font-extrabold uppercase tracking-widest text-[var(--primary)]">
                    SECTION 2 — Physical Profile
                  </span>
                </div>
              </div>

              {/* Stacked on mobile (grid-cols-1), 2 columns on tablet/desktop (sm:grid-cols-2) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <Input
                  label="Phone Number"
                  type="tel"
                  placeholder="+20 1234567890"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  icon={<Phone className="w-5 h-5 text-gray-400" />}
                  className="h-14 rounded-xl border-[var(--border)] bg-[var(--background)] text-[var(--text-main)] focus:border-[var(--primary)] px-4 text-base"
                  required
                />
                <Input
                  label="Age"
                  type="number"
                  placeholder="25"
                  value={age}
                  onChange={(e) => setAge(e.target.value === '' ? '' : Number(e.target.value))}
                  icon={<Calendar className="w-5 h-5 text-gray-400" />}
                  className="h-14 rounded-xl border-[var(--border)] bg-[var(--background)] text-[var(--text-main)] focus:border-[var(--primary)] px-4 text-base"
                  required
                />
              </div>

              {/* Weight, Height, Gender: stacked on mobile, sm:grid-cols-2, md:grid-cols-3 on desktop */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 pt-2">
                <Input
                  label="Weight (kg)"
                  type="number"
                  placeholder="80"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value === '' ? '' : Number(e.target.value))}
                  icon={<Weight className="w-5 h-5 text-gray-400" />}
                  className="h-14 rounded-xl border-[var(--border)] bg-[var(--background)] text-[var(--text-main)] focus:border-[var(--primary)] px-4 text-base"
                  required
                />
                <Input
                  label="Height (cm)"
                  type="number"
                  placeholder="178"
                  value={height}
                  onChange={(e) => setHeight(e.target.value === '' ? '' : Number(e.target.value))}
                  icon={<Ruler className="w-5 h-5 text-gray-400" />}
                  className="h-14 rounded-xl border-[var(--border)] bg-[var(--background)] text-[var(--text-main)] focus:border-[var(--primary)] px-4 text-base"
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
                  className="h-14 rounded-xl border-[var(--border)] bg-[var(--background)] text-[var(--text-main)] focus:border-[var(--primary)] px-4 text-base"
                  required
                />
              </div>
            </div>

            {/* SECTION 3 — Fitness Preferences */}
            <div className="space-y-4">
              <div className="relative mb-5">
                <div className="absolute inset-0 flex items-center" aria-hidden="true">
                  <div className="w-full border-t border-[var(--border)]" />
                </div>
                <div className="relative flex justify-start">
                  <span className="bg-[var(--card-bg)] pr-4 text-xs font-extrabold uppercase tracking-widest text-[var(--primary)]">
                    SECTION 3 — Fitness Preferences
                  </span>
                </div>
              </div>

              {/* Stacked on mobile, 2 columns on tablet/desktop */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <Select
                  label="Fitness Goal"
                  value={goal}
                  onChange={(e) => setGoal(e.target.value as 'fat-loss' | 'maintenance' | 'muscle-gain')}
                  options={[
                    { value: 'fat-loss', label: 'Fat Loss' },
                    { value: 'maintenance', label: 'Maintenance' },
                    { value: 'muscle-gain', label: 'Muscle Gain' }
                  ]}
                  className="h-14 rounded-xl border-[var(--border)] bg-[var(--background)] text-[var(--text-main)] focus:border-[var(--primary)] px-4 text-base"
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
                  className="h-14 rounded-xl border-[var(--border)] bg-[var(--background)] text-[var(--text-main)] focus:border-[var(--primary)] px-4 text-base"
                  required
                />
              </div>
            </div>

            {/* Large full-width button with h-14 height */}
            <Button
              type="submit"
              fullWidth
              isLoading={isSubmitting}
              rightIcon={<ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />}
              className="py-3.5 bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white font-extrabold rounded-xl shadow-lg shadow-red-500/10 active:scale-[0.98] transition-all duration-300 flex justify-center items-center gap-2 group text-sm sm:text-base uppercase tracking-wider mt-4 h-14 w-full"
            >
              Create Account & Choose Plan
            </Button>
          </form>

          <p className="mt-8 text-center text-sm font-semibold text-[var(--text-muted)]">
            Already have an account?{' '}
            <Link to="/login" className="font-bold text-[var(--primary)] hover:underline ml-1">
              Sign In
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
};

export default RegisterClientPage;
