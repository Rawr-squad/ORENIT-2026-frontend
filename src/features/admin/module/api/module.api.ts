import type { ModuleCreate } from '@/entities/course/model/course.types';
import { api } from '@/shared/api/client';

export const adminModuleApi = {
	create: async (data: ModuleCreate) => {
		const res = await api.post('/admin/modules', data);
		return res.data;
	},

	update: async (id: number, data: ModuleCreate) => {
		const res = await api.put(`/admin/modules/${id}`, data);
		return res.data;
	},

	delete: async (id: number) => {
		const res = await api.delete(`/admin/modules/${id}`);
		return res.data;
	},
};

