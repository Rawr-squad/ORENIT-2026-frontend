import type { RegisterRequest, LoginRequest, User } from '@/shared/types/auth';
import { api } from './client';

export const authApi = {
	login: async (data: LoginRequest) => {
		const res = await api.post('/auth/login', data);
		return res.data;
	},

	register: async (data: RegisterRequest) => {
		const res = await api.post('/auth/register', data);
		return res.data;
	},

	me: async () => {
		const res = await api.get<User>('/auth/me');
		return res.data;
	},
};
