import { useMutation } from '@tanstack/react-query';
import { authApi } from '@/shared/api/auth.api';
import type { RegisterRequest } from '@/shared/types/auth';

export const useRegister = () => {
	return useMutation({
		mutationFn: (data: RegisterRequest) => authApi.register(data),
	});
};
