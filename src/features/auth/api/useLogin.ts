import { useMutation } from '@tanstack/react-query';
import { useAuthStore } from '@/entities/user/model/auth.store';
import type { LoginRequest, LoginResponse, Role } from '@/shared/types/auth';
// import { authApi } from '@/shared/api/auth.api'; //  REAL

export const useLogin = () => {
	const setAuth = useAuthStore((s) => s.setAuth);

	return useMutation<LoginResponse, Error, LoginRequest>({
		//  MOCK
		mutationFn: async (data) => {
			await new Promise((res) => setTimeout(res, 500));

			let role: Role = 'student';

			if (data.email.includes('admin')) role = 'admin';
			if (data.email.includes('parent')) role = 'parent';

			return {
				token: 'mock-token',
				role,
			};
		},

		/*
    //  REAL
    mutationFn: async (data) => {
      const res = await authApi.login(data);
      return res.data;
    },
    */

		onSuccess: (data) => {
			setAuth(data.token, data.role);
		},
	});
};
