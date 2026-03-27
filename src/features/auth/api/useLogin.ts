import { useMutation, useQueryClient } from '@tanstack/react-query';
import { authApi } from '@/shared/api/auth.api';
import { useAuthStore } from '@/entities/user/model/auth.store';
import type { LoginRequest, User } from '@/shared/types/auth';

type LoginPayload = {
	token: string;
	user: User;
};

export const useLogin = () => {
	const setToken = useAuthStore((s) => s.setToken);
	const setUser = useAuthStore((s) => s.setUser);
	const logout = useAuthStore((s) => s.logout);
	const queryClient = useQueryClient();

	return useMutation<LoginPayload, Error, LoginRequest>({
		onMutate: () => {
			queryClient.removeQueries({ queryKey: ['me'] });
		},
		mutationFn: async (data) => {
			const loginRes = await authApi.login(data);
			const token = loginRes.access_token || loginRes.token;

			if (!token) {
				throw new Error('В ответе логина отсутствует токен');
			}

			try {
				setToken(token);
				const user = await authApi.me();
				return { token, user };
			} catch (error) {
				logout();
				throw error;
			}
		},
		onSuccess: ({ user, token }) => {
			setUser(user);
			queryClient.setQueryData(['me', token], user);
			queryClient.invalidateQueries({ queryKey: ['courses'] });
			queryClient.invalidateQueries({ queryKey: ['progress'] });
			queryClient.invalidateQueries({ queryKey: ['leaderboard'] });
		},
	});
};
