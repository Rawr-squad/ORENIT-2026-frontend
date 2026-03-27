import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User } from '@/shared/types/auth';

type AuthState = {
	token: string | null;
	user: User | null;
	hydrated: boolean;

	setToken: (token: string) => void;
	setUser: (user: User) => void;
	setHydrated: (value: boolean) => void;
	logout: () => void;
};

export const useAuthStore = create<AuthState>()(
	persist(
		(set) => ({
			token: null,
			user: null,
			hydrated: false,

			setToken: (token) => set({ token }),
			setUser: (user) => set({ user }),
			setHydrated: (value) => set({ hydrated: value }),

			logout: () => set({ token: null, user: null }),
		}),
		{
			name: 'auth-storage',
			partialize: (state) => ({
				token: state.token,
				user: state.user,
			}),
			onRehydrateStorage: () => (state) => {
				if (!state) {
					return;
				}

				if (state.user && !state.token) {
					state.logout();
				}

				state.setHydrated(true);
			},
		},
	),
);
