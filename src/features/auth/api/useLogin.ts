import { useMutation, useQueryClient } from '@tanstack/react-query';
import { authApi } from '@/shared/api/auth.api';
import { useAuthStore } from '@/entities/user/model/auth.store';
import type { LoginRequest, User } from '@/shared/types/auth';

type LoginResponse = {
	access_token: string;
};

export const useLogin = () => {
	const setToken = useAuthStore((s) => s.setToken);
	const setUser = useAuthStore((s) => s.setUser);

	const queryClient = useQueryClient();

	return useMutation<User, Error, LoginRequest>({
		mutationFn: async (data) => {
			// 1. логин
			const loginRes = await authApi.login(data);

			const token = (loginRes as LoginResponse).access_token;

			// 2. сохраняем токен
			setToken(token);

			// 3. получаем пользователя
			const user = await authApi.me();

			return user;
		},

		onSuccess: (user) => {
			// 4. сохраняем пользователя
			setUser(user);

			// 5. можно инвалидировать связанные данные
			queryClient.invalidateQueries({ queryKey: ['courses'] });
			queryClient.invalidateQueries({ queryKey: ['course'] });
			queryClient.invalidateQueries({ queryKey: ['progress'] });
		},
	});
};
