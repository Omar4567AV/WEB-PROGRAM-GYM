import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Menu, Bell, LogOut, User as UserIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface NavbarProps {
  onMenuClick: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onMenuClick }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="bg-white border-b border-gray-100 h-16 flex items-center justify-between px-4 sm:px-6 sticky top-0 z-20">
      <div className="flex items-center">
        <button 
          onClick={onMenuClick}
          className="p-2 -ml-2 mr-2 text-gray-500 hover:bg-gray-100 rounded-lg lg:hidden"
        >
          <Menu className="w-6 h-6" />
        </button>
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900 m-0 hidden sm:block">
          Welcome back, <span className="text-[var(--primary)]">{user?.name.split(' ')[0]}</span>
        </h1>
      </div>

      <div className="flex items-center gap-2 sm:gap-4">
        <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors relative">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
        </button>

        <div className="h-8 w-px bg-gray-200 mx-1 sm:mx-2"></div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:block text-right">
            <p className="text-sm font-bold text-gray-900 leading-none">{user?.name}</p>
            <p className="text-xs text-gray-500 mt-1 capitalize">{user?.role}</p>
          </div>
          
          <button className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-gray-100 hover:border-[var(--primary)] transition-colors">
            {user?.avatarUrl ? (
              <img src={user.avatarUrl} alt={user.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400">
                <UserIcon className="w-5 h-5" />
              </div>
            )}
          </button>

          <button 
            onClick={handleLogout}
            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
            title="Log out"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
