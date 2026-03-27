import { api } from '@/shared/api/client';

export type ProgressResponse = {
	xp: number;
	completed_lessons: number;
};

export const progressApi = {
	getMe: async (): Promise<ProgressResponse> => {
		/*
     REAL
    const res = await api.get('/progress/me');
    return res.data;
    */

		//  MOCK
		await new Promise((r) => setTimeout(r, 300));

		return {
			xp: 120,
			completed_lessons: 3,
		};
	},
};
