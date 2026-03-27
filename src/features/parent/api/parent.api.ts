import { api } from '@/shared/api/client';

export const parentApi = {
	linkChild: async (parent_email: string) => {
		const res = await api.post('/parent-link', { parent_email });
		return res.data;
	},
};

