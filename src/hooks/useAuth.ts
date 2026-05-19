import { useContext } from 'react';
import { AuthContext } from '../app/providers/AuthContext';

/**
 * Custom hook to access authentication state and methods
 * @returns {AuthContextType} The authentication context value
 * @throws {Error} If used outside of an AuthProvider
 */
export const useAuth = () => {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
};

export default useAuth;
