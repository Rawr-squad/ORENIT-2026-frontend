import { api } from '@/shared/api/client';
import type { LessonCreate } from '@/entities/course/model/course.types';

export const adminLessonApi = {
	create: async (data: LessonCreate) => {
		const res = await api.post('/admin/lessons', data);
		return res.data;
	},

	update: async (id: number, data: LessonCreate) => {
		const res = await api.put(`/admin/lessons/${id}`, data);
		return res.data;
	},

	delete: async (id: number) => {
		const res = await api.delete(`/admin/lessons/${id}`);
		return res.data;
	},
};

