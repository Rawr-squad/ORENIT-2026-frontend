import { api } from '@/shared/api/client';
import type { LeaderboardUser } from '@/features/progress/api/progress.types';

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
	if (Array.isArray(data.results)) {
		return data.results;
	}
	if (Array.isArray(data.leaderboard)) {
		return data.leaderboard;
	}
	if (Array.isArray(data.users)) {
		return data.users;
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

const toStringOrUndefined = (value: unknown): string | undefined => {
	if (typeof value === 'string' && value.trim().length > 0) {
		return value.trim();
	}

	return undefined;
};

const normalizeLeaderboardUser = (payload: unknown, index: number): LeaderboardUser => {
	const row = asRecord(payload) ?? {};
	const nestedUser = asRecord(row.user) ?? {};
	const profile = asRecord(row.profile) ?? {};
	const sources = [row, nestedUser, profile];

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

	const id = toNumber(pick(['user_id', 'id']), index + 1);

	return {
		id,
		user_id: id,
		nickname: toStringOrUndefined(
			pick(['nickname', 'username', 'name', 'display_name']),
		),
		xp: toNumber(pick(['xp', 'score', 'points']), 0),
		coins: toNumber(pick(['coins', 'balance', 'wallet']), 0),
		avatar_url: toStringOrUndefined(
			pick(['avatar_url', 'avatar', 'avatarUrl', 'photo_url']),
		),
		nickname_color: toStringOrUndefined(
			pick(['nickname_color', 'name_color', 'color_hex']),
		),
		custom_status: toStringOrUndefined(
			pick(['custom_status', 'status_title', 'status']),
		),
	};
};

export const leaderboardApi = {
	get: async (): Promise<LeaderboardUser[]> => {
		const res = await api.get('/progress/leaderboard');
		return toArray(res.data).map((entry, index) =>
			normalizeLeaderboardUser(entry, index),
		);
	},
};
