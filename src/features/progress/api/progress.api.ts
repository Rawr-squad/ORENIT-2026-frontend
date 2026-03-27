import { api } from '@/shared/api/client';
export type LeaderboardUser = {
	user_id: number;
	xp: number;
};

export type ProgressResponse = {
	xp: number;
	completed_lessons: number;
};

export const progressApi = {
	getMe: async (): Promise<ProgressResponse> => {
		const res = await api.get('/progress/me');
		return res.data;
	},

	getLeaderboard: async (): Promise<LeaderboardUser[]> => {
		const res = await api.get('/progress/leaderboard');
		return res.data;
	},
};
