import type {
	CourseCreate,
	CourseFull,
	CoursePreview,
} from '@/entities/course/model/course.types';
import { api } from '@/shared/api/client';

export const adminCourseApi = {
	getAll: async (): Promise<CoursePreview[]> => {
		const res = await api.get('/courses');
		return res.data;
	},

	create: async (data: CourseCreate) => {
		const res = await api.post('/admin/courses', data);
		return res.data;
	},
};

export const courseApi = {
	getAll: async (): Promise<CoursePreview[]> => {
		const res = await api.get('/courses');
		return res.data;
	},

	getById: async (id: number): Promise<CourseFull> => {
		const res = await api.get(`/courses/${id}`);

		return {
			...res.data,
			modules: res.data.modules ?? [],
		};
	},
};
