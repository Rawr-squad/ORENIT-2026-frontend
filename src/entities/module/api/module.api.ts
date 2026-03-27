import { api } from '@/shared/api/client';
import type { ModuleFull } from '../model/module.types';

const toArray = <T>(payload: unknown): T[] => {
	if (Array.isArray(payload)) {
		return payload as T[];
	}

	if (payload && typeof payload === 'object') {
		const data = payload as Record<string, unknown>;
		if (Array.isArray(data.items)) {
			return data.items as T[];
		}
		if (Array.isArray(data.modules)) {
			return data.modules as T[];
		}
	}

	return [];
};

const normalizeModule = (payload: unknown, fallbackId: number): ModuleFull => {
	const data = payload as Partial<ModuleFull>;
	return {
		id: Number(data.id ?? fallbackId),
		title: String(data.title ?? `Module ${fallbackId}`),
		order: data.order,
		lessons: Array.isArray(data.lessons)
			? data.lessons.map((lesson, index) => ({
				id: Number(lesson.id ?? index + 1),
				title: String(lesson.title ?? `Lesson ${index + 1}`),
				order: lesson.order,
			}))
			: [],
	};
};

export const moduleApi = {
	getAll: async (): Promise<ModuleFull[]> => {
		const res = await api.get('/modules');
		const modules = toArray<unknown>(res.data);
		return modules.map((module, index) => normalizeModule(module, index + 1));
	},

	getById: async (id: number): Promise<ModuleFull> => {
		const res = await api.get(`/modules/${id}`);
		return normalizeModule(res.data, id);
	},
};