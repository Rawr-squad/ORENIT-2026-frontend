import type {
	CourseCreate,
	CourseFull,
	CoursePreview,
	Module,
} from '@/entities/course/model/course.types';
import { api } from '@/shared/api/client';

const toArray = <T>(payload: unknown): T[] => {
	if (Array.isArray(payload)) {
		return payload as T[];
	}

	if (
		payload &&
		typeof payload === 'object' &&
		'items' in payload &&
		Array.isArray((payload as { items: unknown[] }).items)
	) {
		return (payload as { items: T[] }).items;
	}

	if (
		payload &&
		typeof payload === 'object' &&
		'courses' in payload &&
		Array.isArray((payload as { courses: unknown[] }).courses)
	) {
		return (payload as { courses: T[] }).courses;
	}

	return [];
};

const normalizeModules = (modules: unknown): Module[] => {
	if (!Array.isArray(modules)) {
		return [];
	}

	return modules.map((module, index) => {
		const source = module as Partial<Module> & { lessons?: unknown[] };

		return {
			id: Number(source.id ?? index + 1),
			title: String(source.title ?? `Module ${index + 1}`),
			order: source.order,
			lessons: Array.isArray(source.lessons)
				? source.lessons.map((lesson, lessonIndex) => {
					const item = lesson as { id?: number; title?: string; order?: number };

					return {
						id: Number(item.id ?? lessonIndex + 1),
						title: String(item.title ?? `Lesson ${lessonIndex + 1}`),
						order: item.order,
					};
				})
				: [],
		};
	});
};

export const adminCourseApi = {
	getAll: async (): Promise<CoursePreview[]> => {
		const res = await api.get('/courses');
		return toArray<CoursePreview>(res.data);
	},

	create: async (data: CourseCreate) => {
		const res = await api.post('/admin/courses', data);
		return res.data;
	},

	update: async (id: number, data: CourseCreate) => {
		const res = await api.put(`/admin/courses/${id}`, data);
		return res.data;
	},

	delete: async (id: number) => {
		const res = await api.delete(`/admin/courses/${id}`);
		return res.data;
	},
};

export const courseApi = {
	getAll: async (): Promise<CoursePreview[]> => {
		const res = await api.get('/courses');
		return toArray<CoursePreview>(res.data);
	},

	getById: async (id: number): Promise<CourseFull> => {
		const res = await api.get(`/courses/${id}`);
		const data = res.data as Partial<CourseFull>;

		return {
			id: Number(data.id ?? id),
			title: String(data.title ?? `Course ${id}`),
			description: String(data.description ?? ''),
			modules: normalizeModules(data.modules),
		};
	},
};

