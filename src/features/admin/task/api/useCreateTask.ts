import { useMutation, useQueryClient } from '@tanstack/react-query';
import { adminTaskApi } from './task.api';

export const useCreateTask = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: adminTaskApi.create,
		onSuccess: (_, variables) => {
			queryClient.invalidateQueries({ queryKey: ['lesson', variables.lesson_id] });
			queryClient.invalidateQueries({ queryKey: ['course'] });
			queryClient.invalidateQueries({ queryKey: ['progress'] });
		},
	});
};