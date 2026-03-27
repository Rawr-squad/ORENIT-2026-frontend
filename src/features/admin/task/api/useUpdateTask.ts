import { useMutation, useQueryClient } from '@tanstack/react-query';
import { adminTaskApi } from './task.api';
import type { TaskCreate } from '@/entities/task/model/task.types';

export const useUpdateTask = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ id, data }: { id: number; data: TaskCreate }) =>
			adminTaskApi.update(id, data),
		onSuccess: (_, variables) => {
			queryClient.invalidateQueries({ queryKey: ['lesson', variables.data.lesson_id] });
			queryClient.invalidateQueries({ queryKey: ['course'] });
			queryClient.invalidateQueries({ queryKey: ['progress'] });
		},
	});
};