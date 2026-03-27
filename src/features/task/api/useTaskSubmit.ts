import { useMutation, useQueryClient } from '@tanstack/react-query';
import { taskApi } from '../api/task.api';
import type { TaskAttempt } from '@/entities/task/model/taskAttempt.types';

type SubmitPayload = {
	taskId: number;
	lessonId: number; // ✅ добавляем
	answer: string;
};

export const useTaskSubmit = () => {
	const queryClient = useQueryClient();

	return useMutation<TaskAttempt, Error, SubmitPayload>({
		mutationFn: ({ taskId, answer }) => taskApi.submit(taskId, answer),

		onSuccess: (_, variables) => {
			queryClient.invalidateQueries({
				queryKey: ['lesson', variables.lessonId],
			});

			queryClient.invalidateQueries({
				queryKey: ['progress'],
			});
		},
	});
};
