import { useMutation, useQueryClient } from '@tanstack/react-query';
import { adminTaskApi } from './task.api';

export const useDeleteTask = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (id: number) => adminTaskApi.delete(id),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['lesson'] });
			queryClient.invalidateQueries({ queryKey: ['course'] });
			queryClient.invalidateQueries({ queryKey: ['progress'] });
		},
	});
};