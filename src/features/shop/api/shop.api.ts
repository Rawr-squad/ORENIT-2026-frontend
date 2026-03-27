import { api } from '@/shared/api/client';

export type ShopColor = {
	id: number;
	name: string;
	hex_code: string;
	price: number;
	owned: boolean;
	active: boolean;
};

export type ShopStatus = {
	id: number;
	title: string;
	price: number;
	owned: boolean;
	active: boolean;
};

export type CreateShopColorPayload = {
	name: string;
	hex_code: string;
	price: number;
};

export type CreateShopStatusPayload = {
	title: string;
	price: number;
};

type Dict = Record<string, unknown>;

const asRecord = (value: unknown): Dict | null => {
	if (!value || typeof value !== 'object' || Array.isArray(value)) {
		return null;
	}

	return value as Dict;
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

const toBoolean = (value: unknown, fallback = false): boolean => {
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

	return fallback;
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
	if (Array.isArray(data.colors)) {
		return data.colors;
	}
	if (Array.isArray(data.statuses)) {
		return data.statuses;
	}
	if (Array.isArray(data.data)) {
		return data.data;
	}

	return [];
};

const normalizeColor = (payload: unknown, index: number): ShopColor => {
	const raw = asRecord(payload) ?? {};
	const id = toNumber(raw.id ?? raw.color_id, index + 1);

	return {
		id,
		name:
			(typeof raw.name === 'string' && raw.name.trim()) ||
			(typeof raw.title === 'string' && raw.title.trim()) ||
			`Color ${id}`,
		hex_code:
			(typeof raw.hex_code === 'string' && raw.hex_code.trim()) ||
			(typeof raw.hex === 'string' && raw.hex.trim()) ||
			paletteFallbackByIndex(index),
		price: toNumber(raw.price ?? raw.cost ?? raw.coins, 0),
		owned: toBoolean(raw.owned ?? raw.is_owned ?? raw.purchased ?? raw.mine, false),
		active: toBoolean(raw.active ?? raw.is_active ?? raw.selected ?? raw.current, false),
	};
};

const normalizeStatus = (payload: unknown, index: number): ShopStatus => {
	const raw = asRecord(payload) ?? {};
	const id = toNumber(raw.id ?? raw.status_id, index + 1);

	return {
		id,
		title:
			(typeof raw.title === 'string' && raw.title.trim()) ||
			(typeof raw.name === 'string' && raw.name.trim()) ||
			`Status ${id}`,
		price: toNumber(raw.price ?? raw.cost ?? raw.coins, 0),
		owned: toBoolean(raw.owned ?? raw.is_owned ?? raw.purchased ?? raw.mine, false),
		active: toBoolean(raw.active ?? raw.is_active ?? raw.selected ?? raw.current, false),
	};
};

const paletteFallbackByIndex = (index: number) => {
	const fallback = ['#243168', '#A8A3F6', '#F97373', '#53A653', '#F59E0B'];
	return fallback[index % fallback.length];
};

export const shopApi = {
	getColors: async (): Promise<ShopColor[]> => {
		const res = await api.get('/shop/colors');
		return toArray(res.data).map((item, index) => normalizeColor(item, index));
	},
	getStatuses: async (): Promise<ShopStatus[]> => {
		const res = await api.get('/shop/statuses');
		return toArray(res.data).map((item, index) => normalizeStatus(item, index));
	},
	buyColor: async (colorId: number) => {
		const res = await api.post(`/shop/buy/color/${colorId}`);
		return res.data;
	},
	buyStatus: async (statusId: number) => {
		const res = await api.post(`/shop/buy/status/${statusId}`);
		return res.data;
	},
	seed: async () => {
		const res = await api.post('/shop/seed');
		return res.data;
	},
	createColorAdmin: async (payload: CreateShopColorPayload) => {
		const res = await api.post('/admin/shop/colors', null, {
			params: payload,
		});
		return res.data;
	},
	createStatusAdmin: async (payload: CreateShopStatusPayload) => {
		const res = await api.post('/admin/shop/admin/statuses', null, {
			params: payload,
		});
		return res.data;
	},
};
