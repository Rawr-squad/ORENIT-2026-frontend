import { api } from '@/shared/api/client';
import type { ProgressResponse } from './progress.types';

const toNumber = (value: unknown, fallback = 0): number => {
	if (typeof value === 'number' && Number.isFinite(value)) {
		return value;
	}

	if (typeof value === 'string') {
		const parsed = Number(value);
		if (Number.isFinite(parsed)) {
			return parsed;
		}
	}

	return fallback;
};

const toOptionalNumber = (value: unknown): number | undefined => {
	if (typeof value === 'number' && Number.isFinite(value)) {
		return value;
	}

	if (typeof value === 'string') {
		const parsed = Number(value);
		if (Number.isFinite(parsed)) {
			return parsed;
		}
	}

	return undefined;
};

const asRecord = (value: unknown): Record<string, unknown> | null => {
	if (!value || typeof value !== 'object' || Array.isArray(value)) {
		return null;
	}

	return value as Record<string, unknown>;
};

const normalizeProgress = (payload: unknown): ProgressResponse => {
	const root = asRecord(payload) ?? {};
	const progress = asRecord(root.progress) ?? {};
	const stats = asRecord(root.stats) ?? {};
	const taskProgress = asRecord(root.task_progress) ?? asRecord(root.tasks) ?? {};

	const sources = [root, progress, stats];

	const pick = (keys: string[]) => {
		for (const source of sources) {
			for (const key of keys) {
				const value = source[key];
				if (value !== undefined && value !== null) {
					return value;
				}
			}
		}
		return undefined;
	};

	const completed = toNumber(
		taskProgress.completed ??
			pick(['completed_tasks']),
		0,
	);
	const started = toNumber(
		taskProgress.started ??
			pick(['started_tasks']),
		completed,
	);
	const total = toNumber(
		taskProgress.total ??
			pick(['total_tasks']),
		Math.max(started, completed),
	);
	const notStarted = toNumber(
		taskProgress.not_started ??
			pick(['not_started_tasks']),
		Math.max(0, total - started),
	);

	return {
		xp: toNumber(pick(['xp']), 0),
		coins: toNumber(pick(['coins', 'balance', 'wallet']), 0),
		completed_lessons: toNumber(pick(['completed_lessons', 'lessons_completed']), 0),
		level: toOptionalNumber(pick(['level'])),
		completed_tasks: completed,
		started_tasks: started,
		not_started_tasks: notStarted,
		total_tasks: Math.max(total, completed + Math.max(0, started - completed) + notStarted),
		task_progress: {
			completed,
			started,
			not_started: notStarted,
			total,
		},
	};
};

export const progressApi = {
	getMe: async (): Promise<ProgressResponse> => {
		const res = await api.get('/progress/me');
		return normalizeProgress(res.data);
	},

	startLesson: async (lesson_id: number) => {
		const res = await api.post('/progress/start', { lesson_id });
		return res.data;
	},
};
