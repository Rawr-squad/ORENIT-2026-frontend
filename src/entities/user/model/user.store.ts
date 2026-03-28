import type { ProgressResponse } from '@/features/progress/api/progress.types';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type UserState = {
	xp: number;
	level: number;
	completedLessons: number;
	progress: ProgressResponse | null;

	setProgress: (progress: ProgressResponse) => void;
};

export const useUserStore = create<UserState>()(
	persist(
		(set) => ({
			xp: 0,
			level: 1,
			completedLessons: 0,
			progress: null,

			setProgress: (progress: ProgressResponse) => {
				set(progress);
			},
		}),
		{
			name: 'user-storage',
		},
	),
);

