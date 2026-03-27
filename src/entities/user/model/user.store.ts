import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type UserState = {
	xp: number;
	level: number;
	completedLessons: number;

	setProgress: (xp: number, completedLessons: number) => void;
};

export const useUserStore = create<UserState>()(
	persist(
		(set) => ({
			xp: 0,
			level: 1,
			completedLessons: 0,

			setProgress: (xp, completedLessons) => {
				const level = Math.floor(xp / 100) + 1;

				set({
					xp,
					level,
					completedLessons,
				});
			},
		}),
		{
			name: 'user-storage',
		},
	),
);

