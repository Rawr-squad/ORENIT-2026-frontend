import { api } from '@/shared/api/client';

export type PendingCodeAttempt = {
	id: number;
	task_id: number;
	lesson_id?: number;
	user_id: number;
	user_nickname?: string;
	user_avatar_url?: string;
	user_nickname_color?: string;
	user_custom_status?: string;
	task_question?: string;
	answer: string;
	status: 'pending' | 'checked';
	created_at?: string;
};

type Dict = Record<string, unknown>;

const asRecord = (value: unknown): Dict | null => {
	if (!value || typeof value !== 'object' || Array.isArray(value)) {
		return null;
	}

	return value as Dict;
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
	if (Array.isArray(data.attempts)) {
		return data.attempts;
	}
	if (Array.isArray(data.pending)) {
		return data.pending;
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

const normalizePendingAttempt = (
	payload: unknown,
	index: number,
): PendingCodeAttempt => {
	const raw = asRecord(payload) ?? {};
	const nestedUser = asRecord(raw.user) ?? {};
	const sources = [raw, nestedUser];

	const pick = (keys: string[]) => {
		for (const source of sources) {
			for (const key of keys) {
				const value = source[key];
				if (value !== undefined && value !== null && value !== '') {
					return value;
				}
			}
		}
		return undefined;
	};

	const id = toNumber(pick(['id', 'attempt_id']), index + 1);
	const statusRaw = pick(['status']);
	const status: 'pending' | 'checked' =
		statusRaw === 'checked' ? 'checked' : 'pending';

	return {
		id,
		task_id: toNumber(pick(['task_id', 'taskId']), 0),
		lesson_id: toNumber(pick(['lesson_id', 'lessonId']), 0) || undefined,
		user_id: toNumber(pick(['user_id', 'id']), 0),
		user_nickname: toOptionalString(
			pick(['user_nickname', 'nickname', 'username', 'name']),
		),
		user_avatar_url: toOptionalString(
			pick(['user_avatar_url', 'avatar_url', 'avatar', 'photo_url']),
		),
		user_nickname_color: toOptionalString(
			pick(['user_nickname_color', 'nickname_color', 'name_color', 'color_hex']),
		),
		user_custom_status: toOptionalString(
			pick(['user_custom_status', 'custom_status', 'status_title']),
		),
		task_question: toOptionalString(pick(['task_question', 'question'])),
		answer: toOptionalString(pick(['answer'])) ?? '',
		status,
		created_at: toOptionalString(pick(['created_at'])),
	};
};

export const adminReviewApi = {
	getPending: async (): Promise<PendingCodeAttempt[]> => {
		const res = await api.get('/admin/attempts/pending');
		return toArray(res.data).map((item, index) =>
			normalizePendingAttempt(item, index),
		);
	},

	review: async (attemptId: number, is_correct: boolean, feedback?: string) => {
		const payload: Record<string, unknown> = { is_correct };
		if (feedback && feedback.trim().length > 0) {
			payload.feedback = feedback.trim();
		}

		const res = await api.post(`/admin/attempts/${attemptId}/review`, payload);
		return res.data;
	},
};
