import { api } from '@/shared/api/client';
import type { TaskStatus } from '@/entities/task/model/taskAttempt.types';

type RawSubmitResponse = {
	id: number;
	is_correct?: boolean;
	status: TaskStatus;
};

export const taskApi = {
	submit: async (taskId: number, answer: string) => {
		/*
     REAL
    return api.post<RawSubmitResponse>(`/tasks/${taskId}/submit`, { answer });
    */

		//  MOCK
		await new Promise((r) => setTimeout(r, 500));

		//  эмуляция разных типов задач
		if (answer.includes('function')) {
			return {
				data: {
					id: taskId,
					status: 'pending' as TaskStatus,
				},
			};
		}

		return {
			data: {
				id: taskId,
				is_correct: answer === 'facebook',
				status: 'checked' as TaskStatus,
			},
		};
	},
};
