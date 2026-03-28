import { api } from '@/shared/api/client';

export type ParentLinkRequest = {
	parent_email: string;
};

export const parentLinkApi = {
	link: async (data: ParentLinkRequest) => {
		const res = await api.post('/parent-link', data);
		return res.data;
	},
};
