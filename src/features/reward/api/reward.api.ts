import { api } from '@/shared/api/client';

export type DailyRewardResponse = {
	coins: number;
	xp: number;
	message: string;
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

const normalizeDailyReward = (payload: unknown): DailyRewardResponse => {
	const raw = asRecord(payload) ?? {};

	return {
		coins: toNumber(raw.coins, 0),
		xp: toNumber(raw.xp, 0),
		message:
			(typeof raw.message === 'string' && raw.message.trim()) ||
			'Ежедневная награда получена',
	};
};

export const rewardApi = {
	claimDaily: async (): Promise<DailyRewardResponse> => {
		const res = await api.post('/reward/daily');
		return normalizeDailyReward(res.data);
	},
};
