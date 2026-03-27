import { api } from '@/shared/api/client';

export type Achievement = {
	id: number;
	title: string;
	description?: string;
	reward_coins?: number;
	icon?: string;
	earned?: boolean;
};

export type CreateAchievementPayload = {
	title: string;
	description: string;
	type: string;
	condition_value: number;
	reward_coins: number;
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
	if (Array.isArray(data.achievements)) {
		return data.achievements;
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

const toOptionalBoolean = (value: unknown): boolean | undefined => {
	if (typeof value === 'boolean') {
		return value;
	}
	if (typeof value === 'number') {
		return value === 1;
	}
	if (typeof value === 'string') {
		const normalized = value.trim().toLowerCase();
		if (normalized === 'true' || normalized === '1') {
			return true;
		}
		if (normalized === 'false' || normalized === '0') {
			return false;
		}
	}

	return undefined;
};

const normalizeAchievement = (payload: unknown, index: number): Achievement => {
	const raw = asRecord(payload) ?? {};
	const id = toNumber(raw.id, index + 1);

	return {
		id,
		title:
			toOptionalString(raw.title) ??
			toOptionalString(raw.name) ??
			`Achievement #${id}`,
		description: toOptionalString(raw.description),
		reward_coins: toNumber(raw.reward_coins ?? raw.coins, 0),
		icon: toOptionalString(raw.icon),
		earned: toOptionalBoolean(raw.earned ?? raw.is_earned ?? raw.unlocked),
	};
};

const normalizeAchievements = (payload: unknown): Achievement[] =>
	toArray(payload).map((item, index) => normalizeAchievement(item, index));

export const achievementApi = {
	getAll: async (): Promise<Achievement[]> => {
		const res = await api.get('/achievements');
		return normalizeAchievements(res.data);
	},
	getMy: async (): Promise<Achievement[]> => {
		const res = await api.get('/achievements/me');
		return normalizeAchievements(res.data);
	},
	getById: async (id: number): Promise<Achievement> => {
		const res = await api.get(`/achievements/${id}`);
		return normalizeAchievement(res.data, 0);
	},
	seed: async () => {
		const res = await api.post('/achievements/seed');
		return res.data;
	},
	createAdmin: async (payload: CreateAchievementPayload) => {
		const res = await api.post('/admin/achievements', null, {
			params: payload,
		});
		return res.data;
	},
};
