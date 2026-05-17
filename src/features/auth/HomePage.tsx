import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { Dumbbell, ArrowRight, ShieldCheck, Zap, Users } from 'lucide-react';

export const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[var(--background)]">
      {/* Navbar */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-[var(--primary)] text-white p-1.5 rounded-lg">
              <Dumbbell className="w-6 h-6" />
            </div>
            <span className="text-2xl font-bold font-['Oswald'] tracking-wider text-gray-900">
              COACH<span className="text-[var(--primary)]">PRO</span>
            </span>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/login" className="text-sm font-bold uppercase tracking-wider text-gray-600 hover:text-[var(--primary)] transition-colors">
              Log In
            </Link>
            <Link to="/register">
              <Button size="sm">Get Started</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
        <div className="text-center max-w-3xl mx-auto">
          <Badge variant="primary" className="mb-6">
            The Ultimate Coaching Platform
          </Badge>
          <h1 className="text-5xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight">
            Transform Your Fitness <br className="hidden sm:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--primary)] to-[var(--accent)]">
              Journey Today
            </span>
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 mb-10 max-w-2xl mx-auto font-medium">
            Connect with expert coaches, track your workouts, and hit your macros with precision. The only tool you need to get results.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/register">
              <Button size="lg" rightIcon={<ArrowRight className="w-5 h-5" />}>
                Start Your Free Trial
              </Button>
            </Link>
            <Link to="/login">
              <Button variant="outline" size="lg">
                I already have an account
              </Button>
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mt-24">
          <div className="card text-center hover:-translate-y-2 transition-transform duration-300">
            <div className="w-16 h-16 mx-auto bg-red-50 text-[var(--primary)] rounded-full flex items-center justify-center mb-6">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold mb-3">Expert Guidance</h3>
            <p className="text-gray-600">Get personalized programs from certified coaches tailored exactly to your goals.</p>
          </div>
          <div className="card text-center hover:-translate-y-2 transition-transform duration-300">
            <div className="w-16 h-16 mx-auto bg-orange-50 text-[var(--accent)] rounded-full flex items-center justify-center mb-6">
              <Zap className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold mb-3">Progress Tracking</h3>
            <p className="text-gray-600">Log your workouts, track your calories, and watch your progress soar over time.</p>
          </div>
          <div className="card text-center hover:-translate-y-2 transition-transform duration-300">
            <div className="w-16 h-16 mx-auto bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-6">
              <Users className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold mb-3">Direct Communication</h3>
            <p className="text-gray-600">Stay in constant contact with your coach through weekly check-ins and updates.</p>
          </div>
        </div>
      </main>
    </div>
  );
};

// Import Badge since it's used
import { Badge } from '../../components/ui/Badge';

export default HomePage;
