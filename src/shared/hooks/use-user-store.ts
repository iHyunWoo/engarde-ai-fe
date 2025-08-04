import { create } from 'zustand';
import {createJSONStorage, persist} from 'zustand/middleware';
import type { User } from '@/entities/user';

interface UserStore {
  user: User | null;
  setUser: (user: User) => void;
  cleanUser: () => void;
}

export const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      user: null,
      setUser: (user: User) => {
        set({ user });
      },
      cleanUser: () => {
        set({ user: null });
      },
    }),
    {
      name: 'user-storage',
      storage: createJSONStorage(() => localStorage),
    },
  ),
);