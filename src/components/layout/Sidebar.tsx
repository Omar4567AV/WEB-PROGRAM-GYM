import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { 
  LayoutDashboard, 
  Users, 
  Dumbbell, 
  Utensils, 
  LineChart, 
  Camera, 
  Settings,
  X
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { role } = useAuth();
  
  const coachLinks = [
    { to: '/coach', icon: <LayoutDashboard />, label: 'Dashboard', end: true },
    { to: '/coach/clients', icon: <Users />, label: 'My Clients' },
    { to: '/settings', icon: <Settings />, label: 'Settings' },
  ];

  const clientLinks = [
    { to: '/client', icon: <LayoutDashboard />, label: 'Dashboard', end: true },
    { to: '/client/workout', icon: <Dumbbell />, label: 'Workout Program' },
    { to: '/client/calories', icon: <Utensils />, label: 'Nutrition' },
    { to: '/client/progress', icon: <LineChart />, label: 'Progress Tracking' },
    { to: '/client/photos', icon: <Camera />, label: 'Progress Photos' },
    { to: '/settings', icon: <Settings />, label: 'Settings' },
  ];

  const links = role === 'coach' ? coachLinks : clientLinks;

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar Content */}
      <aside 
        className={`
          fixed lg:static inset-y-0 left-0 z-40 w-64 bg-white border-r border-gray-100 flex flex-col transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        <div className="h-16 flex items-center justify-between px-6 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="bg-[var(--primary)] text-white p-1.5 rounded-lg shadow-lg shadow-red-500/30">
              <Dumbbell className="w-6 h-6" />
            </div>
            <span className="text-xl font-bold font-['Oswald'] tracking-wider text-gray-900">
              COACH<span className="text-[var(--primary)]">PRO</span>
            </span>
          </div>
          <button onClick={onClose} className="lg:hidden text-gray-400 hover:text-gray-600">
            <X className="w-6 h-6" />
          </button>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              onClick={() => {
                if (window.innerWidth < 1024) onClose();
              }}
              className={({ isActive }) => `
                flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200
                ${isActive 
                  ? 'bg-red-50 text-[var(--primary)]' 
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }
              `}
            >
              {React.cloneElement(link.icon as React.ReactElement<any>, {
                className: `w-5 h-5 ${
                  window.location.pathname === link.to || (link.to !== '/' && window.location.pathname.startsWith(link.to)) 
                    ? 'text-[var(--primary)]' 
                    : 'text-gray-400'
                }`
              })}
              {link.label}
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
