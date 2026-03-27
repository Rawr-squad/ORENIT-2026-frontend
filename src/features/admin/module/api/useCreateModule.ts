import { useMutation, useQueryClient } from '@tanstack/react-query';
import { adminModuleApi } from './module.api';

export const useCreateModule = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: adminModuleApi.create,
		onSuccess: (_, variables) => {
			queryClient.invalidateQueries({ queryKey: ['courses'] });
			queryClient.invalidateQueries({ queryKey: ['course', variables.course_id] });
		},
	});
};