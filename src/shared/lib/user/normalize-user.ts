import type { Role, User } from '@/shared/types/auth';

type Dict = Record<string, unknown>;

const asRecord = (value: unknown): Dict | null => {
	if (!value || typeof value !== 'object' || Array.isArray(value)) {
		return null;
	}

	return value as Dict;
};

const pickValue = (sources: Dict[], keys: string[]): unknown => {
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

const toRole = (value: unknown): Role => {
	if (value === 'admin' || value === 'parent' || value === 'student') {
		return value;
	}

	return 'student';
};

const toNumberArray = (value: unknown): number[] | undefined => {
	if (!Array.isArray(value)) {
		return undefined;
	}

	const normalized = value
		.map((item) => toNumber(item, NaN))
		.filter((item) => Number.isFinite(item));

	return normalized.length > 0 ? normalized : [];
};

export const normalizeUser = (payload: unknown): User => {
	const root = asRecord(payload) ?? {};
	const nestedUser = asRecord(root.user) ?? {};
	const profile = asRecord(root.profile) ?? {};
	const settings = asRecord(root.settings) ?? {};

	const sources = [root, nestedUser, profile, settings];

	const id = toNumber(
		pickValue(sources, ['id', 'user_id', 'uid']),
		0,
	);

	const nickname =
		toStringOrUndefined(
			pickValue(sources, ['nickname', 'username', 'name', 'display_name']),
		) ?? `User ${id || ''}`.trim();

	return {
		id,
		email:
			toStringOrUndefined(
				pickValue(sources, ['email', 'mail']),
			) ?? '',
		nickname,
		role: toRole(pickValue(sources, ['role'])),
		xp: toNumber(pickValue(sources, ['xp']), 0),
		coins: toNumber(pickValue(sources, ['coins', 'balance', 'wallet']), 0),
		avatar_url: toStringOrUndefined(
			pickValue(sources, ['avatar_url', 'avatar', 'avatarUrl', 'photo_url']),
		),
		nickname_color: toStringOrUndefined(
			pickValue(sources, ['nickname_color', 'name_color', 'color_hex']),
		),
		custom_status: toStringOrUndefined(
			pickValue(sources, ['custom_status', 'status_title', 'status']),
		),
		owned_color_ids: toNumberArray(
			pickValue(sources, ['owned_color_ids', 'colors_owned', 'purchased_colors']),
		),
		owned_status_ids: toNumberArray(
			pickValue(sources, ['owned_status_ids', 'statuses_owned', 'purchased_statuses']),
		),
	};
};
