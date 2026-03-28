import { api } from '@/shared/api/client';
import type { LessonDistribution, ProgressResponse } from './progress.types';

export const getLessonDistribution = (
	progress?: ProgressResponse,
): LessonDistribution => {
	if (!progress) {
		return {
			completed: 0,
			startedNotCompleted: 0,
			notStarted: 0,
			total: 0,
		};
	}

	const completed = progress.completed_lessons ?? 0;
	const started = progress.started_lessons ?? 0;
	const notStarted = progress.not_started_lessons ?? 0;

	// важно: started включает completed
	const startedNotCompleted = Math.max(0, started - completed);

	const total = completed + startedNotCompleted + notStarted;

	return {
		completed,
		startedNotCompleted,
		notStarted,
		total,
	};
};

export const progressApi = {
	getMe: async (): Promise<ProgressResponse> => {
		const res = await api.get('/progress/me');
		return res.data;
	},

	startLesson: async (lesson_id: number) => {
		const res = await api.post('/progress/start', { lesson_id });
		return res.data;
	},
};

