import type {
	CourseCreate,
	CoursePreview,
} from '@/entities/course/model/course.types';
import { api } from '@/shared/api/client';

export const adminCourseApi = {
	getAll: async (): Promise<CoursePreview[]> => {
		// ✅ REAL
		const res = await api.get('/courses');
		return res.data;

		//  MOCK
		// await new Promise((r) => setTimeout(r, 300));

		// return [
		// 	{ id: 1, title: 'React', description: 'Основы' },
		// 	{ id: 2, title: 'JS', description: 'Продвинутый JS' },
		// ];
	},

	create: async (data: CourseCreate) => {
		/*
    ✅ REAL
    const res = await api.post('/admin/courses', data);
    return res.data;
    */

		await new Promise((r) => setTimeout(r, 300));

		return { id: Math.random(), ...data };
	},
};

export const courseApi = {
	getAll: async (): Promise<CoursePreview[]> => {
		const res = await api.get('/courses');
		return res.data;
	},
};
