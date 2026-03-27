import { api } from '@/shared/api/client';
import type { LeaderboardUser } from '@/features/progress/api/progress.types';

export const leaderboardApi = {
	get: async (): Promise<LeaderboardUser[]> => {
		const res = await api.get('/progress/leaderboard');
		return res.data;
	},
};
