import axios from 'axios';
import { useAuthStore } from '@/entities/user/model/auth.store';

export const api = axios.create({
	baseURL: import.meta.env.VITE_API_URL,
});

api.interceptors.request.use((config) => {
	const token = useAuthStore.getState().token;

	if (token) {
		config.headers.Authorization = `Bearer ${token}`;
	}

	return config;
});

api.interceptors.response.use(
	(res) => res,
	(error) => {
		const status = error?.response?.status;

		if (status === 401) {
			const { logout } = useAuthStore.getState();

			logout();

			// ❗ важно: полный редирект, не navigate
			window.location.href = '/login';
		}

		return Promise.reject(error);
	},
);

