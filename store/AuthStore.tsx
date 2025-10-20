import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import Cookies from 'js-cookie';

interface AuthState {
  isAuthenticated: boolean;
  token: string;
  login: (token: string, isAuthenticated:boolean, user:{}) => void;
  logout: () => void;
  user: Record<string, any>;
}

// entityName: string, importLicenseNumber:string, recentBankStatementLink:string

const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      token: '',
      user: {},

      login: (token: string, isAuthenticated:boolean, user:{}) => {
        Cookies.set('token', token);
        set({ isAuthenticated: isAuthenticated, token , user});
      },

      logout: () => {
        Cookies.remove('token');
        set({ user: {}, isAuthenticated: false, token: '' });
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);

export default useAuthStore;