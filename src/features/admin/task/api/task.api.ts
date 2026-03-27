import { api } from '@/shared/api/client';
import type { TaskCreate } from '@/entities/task/model/task.types';

export const adminTaskApi = {
	create: async (data: TaskCreate) => {
		const res = await api.post('/admin/tasks', data);
		return res.data;
	},

	update: async (id: number, data: TaskCreate) => {
		const res = await api.put(`/admin/tasks/${id}`, data);
		return res.data;
	},

	delete: async (id: number) => {
		const res = await api.delete(`/admin/tasks/${id}`);
		return res.data;
	},
};

