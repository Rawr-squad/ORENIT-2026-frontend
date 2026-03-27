import { useMutation, useQueryClient } from '@tanstack/react-query';
import { adminModuleApi } from './module.api';

export const useCreateModule = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: adminModuleApi.create,

		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ['course'],
			});
		},
	});
};
