import { useMutation } from '@tanstack/react-query';
import { taskApi } from './task.api';
import type {
	TaskAttempt,
	SubmitTaskRequest,
	TaskStatus,
} from '@/entities/task/model/taskAttempt.types';

export const useSubmitTask = () => {
	return useMutation<TaskAttempt, Error, SubmitTaskRequest>({
		mutationFn: async ({ taskId, answer }) => {
			const res = await taskApi.submit(taskId, answer);

			return {
				id: res.data.id,
				is_correct: res.data.is_correct,
				status: res.data.status as TaskStatus,
			};
		},
	});
};
