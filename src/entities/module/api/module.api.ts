import { api } from '@/shared/api/client';

export const moduleApi = {
	getById: async (id: number) => {
		const res = await api.get(`/modules/${id}`);
		console.log(res.data);
		return res.data;
	},
};
