import type { TaskAttempt } from '@/entities/task/model/taskAttempt.types';
import { api } from '@/shared/api/client';

export const taskApi = {
	submit: async (taskId: number, answer: string) => {
		const res = await api.post<TaskAttempt>(`/tasks/${taskId}/submit`, {
			answer,
		});

		return res.data;
	},
};
