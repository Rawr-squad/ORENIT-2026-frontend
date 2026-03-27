import { api } from '@/shared/api/client';

export type NextLessonRecommendation = {
	lesson_id: number;
	module_id?: number;
	course_id?: number;
	title?: string;
};

const asRecord = (value: unknown): Record<string, unknown> | null => {
	if (!value || typeof value !== 'object' || Array.isArray(value)) {
		return null;
	}

	return value as Record<string, unknown>;
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

const normalizeRecommendation = (payload: unknown): NextLessonRecommendation | null => {
	const root = asRecord(payload);
	if (!root) {
		return null;
	}

	const data = asRecord(root.data) ?? root;
	const lesson = asRecord(data.lesson) ?? {};

	const lessonId = toNumber(
		data.lesson_id ?? lesson.id,
		0,
	);

	if (!lessonId) {
		return null;
	}

	return {
		lesson_id: lessonId,
		module_id: toNumber(data.module_id ?? lesson.module_id, 0) || undefined,
		course_id: toNumber(data.course_id ?? lesson.course_id, 0) || undefined,
		title: toOptionalString(data.title ?? lesson.title),
	};
};

export const recommendationApi = {
	getNext: async (): Promise<NextLessonRecommendation | null> => {
		const res = await api.get('/recommendations/next');
		return normalizeRecommendation(res.data);
	},
};
