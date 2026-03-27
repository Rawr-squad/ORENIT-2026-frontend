import type { ModuleCreate } from '@/entities/course/model/course.types';
import { api } from '@/shared/api/client';

export const adminModuleApi = {
	create: async (data: ModuleCreate) => {
		return api.post('/admin/modules', data);
	},
};
