import { useAuthStore } from '@/entities/user/model/auth.store';
import axios from 'axios';

export const api = axios.create({
	baseURL: import.meta.env.VITE_API_URL,
	withCredentials: false,
});

api.interceptors.request.use((config) => {
	const token = useAuthStore.getState().token;

	if (token) {
		config.headers.Authorization = `Bearer ${token}`;
	}

	return config;
});

api.interceptors.response.use(
	(response) => response,
	(error) => {
		const status = error.response?.status;

		if (status === 401) {
			const { logout } = useAuthStore.getState();
			logout();
		}

		return Promise.reject(error);
	},
);
