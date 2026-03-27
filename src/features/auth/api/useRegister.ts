import { useMutation } from '@tanstack/react-query';
import type { RegisterRequest, RegisterResponse } from '@/shared/types/auth';
// import { authApi } from '@/shared/api/auth.api'; //  REAL

export const useRegister = () => {
	return useMutation<RegisterResponse, Error, RegisterRequest>({
		//  MOCK
		mutationFn: async () => {
			await new Promise((res) => setTimeout(res, 500));

			return { success: true };
		},

		/*
    //  REAL
    mutationFn: async (data) => {
      const res = await authApi.register(data);
      return res.data;
    },
    */
	});
};
