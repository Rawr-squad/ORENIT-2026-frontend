import { api } from '@/shared/api/client';
import type { LessonCreate } from '@/entities/course/model/course.types';

export const adminLessonApi = {
	create: async (data: LessonCreate) => {
		return api.post('/admin/lessons', data);
	},
};
