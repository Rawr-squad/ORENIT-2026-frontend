import { api } from '@/shared/api/client';
import type { LeaderboardUser } from '@/entities/user/model/leaderboard.types';

export const leaderboardApi = {
	get: async (): Promise<LeaderboardUser[]> => {
		/*
     REAL
    const res = await api.get('/progress/leaderboard');
    return res.data;
    */

		//  MOCK
		await new Promise((r) => setTimeout(r, 500));

		return [
			{ user_id: 1, xp: 200 },
			{ user_id: 2, xp: 150 },
			{ user_id: 3, xp: 120 },
		];
	},
};
