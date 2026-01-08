import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface User {
  id?: number;
  name: string;
  email: string;
  current_role?: string;
  target_role?: string;
  years_of_experience?: number;
  skills?: string[];
}

interface AuthStore {
  user: User | null;
  token: string | null;
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  logout: () => void;
  isAuthenticated: () => boolean;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      setUser: (user: User | null) => set({ user }),
      setToken: (token: string | null) => set({ token }),
      logout: () => {
        set({ user: null, token: null });
        if (typeof window !== 'undefined') {
          localStorage.removeItem('auth-storage');
        }
      },
      isAuthenticated: () => !!get().token,
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
