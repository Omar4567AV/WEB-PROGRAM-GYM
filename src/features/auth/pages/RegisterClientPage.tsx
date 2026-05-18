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
    <div className="min-h-screen w-full bg-[var(--background)] py-12 lg:py-16 px-4 sm:px-6 lg:px-8 transition-colors duration-300 flex items-center justify-center">
      <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        
        {/* Left Column: branding & benefits (40% proportional width) */}
        <div className="lg:col-span-5 space-y-6 lg:pr-4 animate-in fade-in duration-500">
          <div>
            <div className="inline-flex items-center gap-2.5 mb-4">
              <div className="bg-red-50 dark:bg-red-950/20 text-[var(--primary)] p-2 rounded-xl shadow-sm">
                <Dumbbell className="w-6 h-6" />
              </div>
              <span className="text-xl font-bold font-sans tracking-tight text-[var(--text-main)]">
                COACH<span className="text-[var(--primary)]">PRO</span>
              </span>
            </div>
            
            <h1 className="text-3xl lg:text-4xl font-extrabold text-[var(--text-main)] tracking-tight leading-tight m-0 uppercase">
              Create Your Coach <br />
              <span className="text-[var(--primary)]">Platform Account</span>
            </h1>
            
            <p className="text-sm lg:text-base text-[var(--text-muted)] mt-3 leading-relaxed max-w-md font-semibold">
              Unlock a scientific, customized fitness and nutrition program fully managed by your personal trainer. Register today to access your dashboard.
            </p>
          </div>

          {/* Benefits Grid */}
          <div className="space-y-4 bg-[var(--card-bg)] border border-[var(--border)] rounded-2xl p-5 sm:p-6 shadow-sm">
            <h3 className="text-sm font-bold text-[var(--text-main)] uppercase tracking-wide m-0 mb-1">
              What you will unlock:
            </h3>
            
            <div className="space-y-3.5">
              <div className="flex gap-3.5 items-start">
                <div className="bg-red-50 dark:bg-red-950/10 text-[var(--primary)] p-1.5 rounded-lg mt-0.5">
                  <Flame className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[var(--text-main)] uppercase m-0">Personalized workout programs</h4>
                  <p className="text-[11px] text-[var(--text-muted)] mt-0.5 font-semibold leading-relaxed">Tailored splits, target volumes, and custom training cycles.</p>
                </div>
              </div>

              <div className="flex gap-3.5 items-start">
                <div className="bg-red-50 dark:bg-red-950/10 text-[var(--primary)] p-1.5 rounded-lg mt-0.5">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[var(--text-main)] uppercase m-0">Meal tracking & coach feedback</h4>
                  <p className="text-[11px] text-[var(--text-muted)] mt-0.5 font-semibold leading-relaxed">Track daily macro targets and receive scientific diet reviews.</p>
                </div>
              </div>

              <div className="flex gap-3.5 items-start">
                <div className="bg-red-50 dark:bg-red-950/10 text-[var(--primary)] p-1.5 rounded-lg mt-0.5">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[var(--text-main)] uppercase m-0">Progress photos & metrics</h4>
                  <p className="text-[11px] text-[var(--text-muted)] mt-0.5 font-semibold leading-relaxed">Sleek charts for logging bodyweight, height, and photo history.</p>
                </div>
              </div>

              <div className="flex gap-3.5 items-start">
                <div className="bg-red-50 dark:bg-red-950/10 text-[var(--primary)] p-1.5 rounded-lg mt-0.5">
                  <MessageSquare className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[var(--text-main)] uppercase m-0">Direct messaging with coach</h4>
                  <p className="text-[11px] text-[var(--text-muted)] mt-0.5 font-semibold leading-relaxed">Ask questions, submit change requests, and stay accountable.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Registration Card (60% proportional width) */}
        <div className="lg:col-span-7">
          <div className="bg-[var(--card-bg)] border border-[var(--border)] rounded-3xl shadow-xl p-6 sm:p-8 lg:p-10 animate-in fade-in duration-300">
            
            {/* Step Indicator segment bar */}
            <div className="flex flex-wrap justify-between items-center gap-3 mb-8 bg-[var(--background)] p-1.5 rounded-2xl border border-[var(--border)]">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-[var(--card-bg)] rounded-xl shadow-sm border border-[var(--border)]">
                <span className="flex items-center justify-center w-5 h-5 rounded-full bg-[var(--primary)] text-white text-[10px] font-bold">1</span>
                <span className="text-[10px] sm:text-xs font-bold text-[var(--text-main)] uppercase tracking-wider">Account</span>
              </div>
              <div className="w-4 h-px bg-[var(--border)] hidden sm:block flex-grow" />
              <div className="flex items-center gap-2 px-3 py-1.5">
                <span className="flex items-center justify-center w-5 h-5 rounded-full bg-[var(--border)] text-[var(--text-muted)] text-[10px] font-bold">2</span>
                <span className="text-[10px] sm:text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">Profile</span>
              </div>
              <div className="w-4 h-px bg-[var(--border)] hidden sm:block flex-grow" />
              <div className="flex items-center gap-2 px-3 py-1.5">
                <span className="flex items-center justify-center w-5 h-5 rounded-full bg-[var(--border)] text-[var(--text-muted)] text-[10px] font-bold">3</span>
                <span className="text-[10px] sm:text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">Goals</span>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/30 text-red-600 dark:text-red-400 p-4 rounded-xl text-sm font-bold mb-6 text-center animate-shake">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* SECTION 1 — Account Information */}
              <div>
                <div className="relative mb-5">
                  <div className="absolute inset-0 flex items-center" aria-hidden="true">
                    <div className="w-full border-t border-[var(--border)]" />
                  </div>
                  <div className="relative flex justify-start">
                    <span className="bg-[var(--card-bg)] pr-4 text-xs font-bold uppercase tracking-widest text-[var(--primary)]">
                      SECTION 1 — Account Information
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Full Name"
                    type="text"
                    placeholder="Omar Ahmed"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    icon={<User className="w-5 h-5 text-gray-400" />}
                    className="h-[46px] rounded-xl border-[var(--border)] bg-[var(--background)] text-[var(--text-main)] focus:border-[var(--primary)]"
                    required
                  />
                  <Input
                    label="Email Address"
                    type="email"
                    placeholder="omar@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    icon={<Mail className="w-5 h-5 text-gray-400" />}
                    className="h-[46px] rounded-xl border-[var(--border)] bg-[var(--background)] text-[var(--text-main)] focus:border-[var(--primary)]"
                    required
                  />
                  <Input
                    label="Password"
                    type="password"
                    placeholder="Min. 8 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    icon={<Lock className="w-5 h-5 text-gray-400" />}
                    className="h-[46px] rounded-xl border-[var(--border)] bg-[var(--background)] text-[var(--text-main)] focus:border-[var(--primary)]"
                    required
                  />
                  <Input
                    label="Confirm Password"
                    type="password"
                    placeholder="Match password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    icon={<Lock className="w-5 h-5 text-gray-400" />}
                    className="h-[46px] rounded-xl border-[var(--border)] bg-[var(--background)] text-[var(--text-main)] focus:border-[var(--primary)]"
                    required
                  />
                </div>
              </div>

              {/* SECTION 2 — Physical Profile */}
              <div>
                <div className="relative mb-5">
                  <div className="absolute inset-0 flex items-center" aria-hidden="true">
                    <div className="w-full border-t border-[var(--border)]" />
                  </div>
                  <div className="relative flex justify-start">
                    <span className="bg-[var(--card-bg)] pr-4 text-xs font-bold uppercase tracking-widest text-[var(--primary)]">
                      SECTION 2 — Physical Profile
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                  <Input
                    label="Phone Number"
                    type="tel"
                    placeholder="+20 1234567890"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    icon={<Phone className="w-5 h-5 text-gray-400" />}
                    className="h-[46px] rounded-xl border-[var(--border)] bg-[var(--background)] text-[var(--text-main)] focus:border-[var(--primary)]"
                    required
                  />
                  <Input
                    label="Age"
                    type="number"
                    placeholder="25"
                    value={age}
                    onChange={(e) => setAge(e.target.value === '' ? '' : Number(e.target.value))}
                    icon={<Calendar className="w-5 h-5 text-gray-400" />}
                    className="h-[46px] rounded-xl border-[var(--border)] bg-[var(--background)] text-[var(--text-main)] focus:border-[var(--primary)]"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <Input
                    label="Weight (kg)"
                    type="number"
                    placeholder="80"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value === '' ? '' : Number(e.target.value))}
                    icon={<Weight className="w-5 h-5 text-gray-400" />}
                    className="h-[46px] rounded-xl border-[var(--border)] bg-[var(--background)] text-[var(--text-main)] focus:border-[var(--primary)]"
                    required
                  />
                  <Input
                    label="Height (cm)"
                    type="number"
                    placeholder="178"
                    value={height}
                    onChange={(e) => setHeight(e.target.value === '' ? '' : Number(e.target.value))}
                    icon={<Ruler className="w-5 h-5 text-gray-400" />}
                    className="h-[46px] rounded-xl border-[var(--border)] bg-[var(--background)] text-[var(--text-main)] focus:border-[var(--primary)]"
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
                    className="h-[46px] rounded-xl border-[var(--border)] bg-[var(--background)] text-[var(--text-main)] focus:border-[var(--primary)]"
                    required
                  />
                </div>
              </div>

              {/* SECTION 3 — Fitness Preferences */}
              <div>
                <div className="relative mb-5">
                  <div className="absolute inset-0 flex items-center" aria-hidden="true">
                    <div className="w-full border-t border-[var(--border)]" />
                  </div>
                  <div className="relative flex justify-start">
                    <span className="bg-[var(--card-bg)] pr-4 text-xs font-bold uppercase tracking-widest text-[var(--primary)]">
                      SECTION 3 — Fitness Preferences
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Select
                    label="Fitness Goal"
                    value={goal}
                    onChange={(e) => setGoal(e.target.value as any)}
                    options={[
                      { value: 'fat-loss', label: 'Fat Loss' },
                      { value: 'maintenance', label: 'Maintenance' },
                      { value: 'muscle-gain', label: 'Muscle Gain' }
                    ]}
                    className="h-[46px] rounded-xl border-[var(--border)] bg-[var(--background)] text-[var(--text-main)] focus:border-[var(--primary)]"
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
                    className="h-[46px] rounded-xl border-[var(--border)] bg-[var(--background)] text-[var(--text-main)] focus:border-[var(--primary)]"
                    required
                  />
                </div>
              </div>

              <Button
                type="submit"
                fullWidth
                isLoading={isSubmitting}
                rightIcon={<ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />}
                className="py-3 bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white font-extrabold rounded-xl shadow-lg shadow-red-500/10 active:scale-[0.98] transition-all duration-300 flex justify-center items-center gap-2 group text-sm uppercase tracking-wider mt-2"
              >
                Create Account & Choose Plan
              </Button>
            </form>

            <p className="mt-6 text-center text-sm font-semibold text-[var(--text-muted)]">
              Already have an account?{' '}
              <Link to="/login" className="font-bold text-[var(--primary)] hover:underline ml-1">
                Sign In
              </Link>
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default RegisterClientPage;
