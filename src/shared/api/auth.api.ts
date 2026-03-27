import { api } from './client';
import type { LoginRequest } from '@/shared/types/auth';

export const authApi = {
	login: async (data: LoginRequest) => {
		const res = await api.post('/auth/login', data);
		return res.data; // { access_token }
	},
};
