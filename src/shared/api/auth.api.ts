import type {
	LoginRequest,
	LoginResponse,
	RegisterRequest,
	User,
} from '@/shared/types/auth';
import { normalizeUser } from '@/shared/lib/user/normalize-user';
import { api } from './client';

export const authApi = {
	login: async (data: LoginRequest) => {
		const res = await api.post<LoginResponse>('/auth/login', data);
		const payload = (res.data ?? {}) as Record<string, unknown>;

		return {
			access_token:
				(typeof payload.access_token === 'string' && payload.access_token) ||
				(typeof payload.token === 'string' && payload.token) ||
				'',
			token: typeof payload.token === 'string' ? payload.token : undefined,
		};
	},

	register: async (data: RegisterRequest) => {
		const res = await api.post('/auth/register', data);
		return res.data;
	},

	me: async () => {
		const res = await api.get('/auth/me');
		return normalizeUser(res.data) as User;
	},
};
