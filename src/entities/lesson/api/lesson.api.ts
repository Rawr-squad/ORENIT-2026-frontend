import { api } from '@/shared/api/client';

export const lessonApi = {
	getById: async (id: number) => {
		const res = await api.get(`/lessons/${id}`);
		return res.data;
	},
};
