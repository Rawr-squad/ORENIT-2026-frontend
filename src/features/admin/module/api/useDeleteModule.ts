import { useMutation, useQueryClient } from '@tanstack/react-query';
import { adminModuleApi } from './module.api';

export const useDeleteModule = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (id: number) => adminModuleApi.delete(id),
		onSuccess: (_, moduleId) => {
			queryClient.invalidateQueries({ queryKey: ['courses'] });
			queryClient.invalidateQueries({ queryKey: ['course'] });
			queryClient.invalidateQueries({ queryKey: ['module', moduleId] });
		},
	});
};