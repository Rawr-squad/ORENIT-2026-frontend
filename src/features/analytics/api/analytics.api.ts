import { api } from '@/shared/api/client';

export type WeakLesson = {
	lesson_id: number;
	lesson_title?: string;
	wrong_attempts?: number;
	attempts?: number;
	score?: number;
};

const asRecord = (value: unknown): Record<string, unknown> | null => {
	if (!value || typeof value !== 'object' || Array.isArray(value)) {
		return null;
	}

	return value as Record<string, unknown>;
};

const toArray = (payload: unknown): unknown[] => {
	if (Array.isArray(payload)) {
		return payload;
	}

	const data = asRecord(payload);
	if (!data) {
		return [];
	}

	if (Array.isArray(data.items)) {
		return data.items;
	}
	if (Array.isArray(data.lessons)) {
		return data.lessons;
	}
	if (Array.isArray(data.weak_lessons)) {
		return data.weak_lessons;
	}
	if (Array.isArray(data.data)) {
		return data.data;
	}

	return [];
};

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

const toOptionalString = (value: unknown): string | undefined => {
	if (typeof value === 'string' && value.trim().length > 0) {
		return value.trim();
	}
	return undefined;
};

const normalizeWeakLesson = (payload: unknown, index: number): WeakLesson => {
	const raw = asRecord(payload) ?? {};
	const lesson = asRecord(raw.lesson) ?? {};
	const lessonId = toNumber(raw.lesson_id ?? lesson.id, index + 1);

	return {
		lesson_id: lessonId,
		lesson_title: toOptionalString(raw.lesson_title ?? raw.title ?? lesson.title),
		wrong_attempts: toNumber(raw.wrong_attempts ?? raw.incorrect ?? raw.errors, 0),
		attempts: toNumber(raw.attempts ?? raw.total_attempts, 0),
		score: toNumber(raw.score ?? raw.success_rate, 0),
	};
};

export const analyticsApi = {
	getWeakLessons: async (): Promise<WeakLesson[]> => {
		const res = await api.get('/analytics/weak-lessons');
		return toArray(res.data).map((item, index) => normalizeWeakLesson(item, index));
	},
};
