import { api } from '@/shared/api/client';
import { normalizeTask } from '@/entities/task/lib/normalizeTask';
import type { Task } from '@/entities/task/model/task.types';

type LessonResponse = {
	id: number;
	title: string;
	theory_content: string;
	tasks: unknown[];
};

export const lessonApi = {
	getById: async (id: number) => {
		const res = await api.get<LessonResponse>(`/lessons/${id}`);

		return {
			...res.data,
			tasks: (res.data.tasks ?? []).map((t) =>
				normalizeTask(t as Record<string, unknown>),
			) as Task[],
		};
	},
};

