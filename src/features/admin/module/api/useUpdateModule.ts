import { useMutation, useQueryClient } from '@tanstack/react-query';
import { adminModuleApi } from './module.api';
import type { ModuleCreate } from '@/entities/course/model/course.types';

export const useUpdateModule = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ id, data }: { id: number; data: ModuleCreate }) =>
			adminModuleApi.update(id, data),
		onSuccess: (_, variables) => {
			queryClient.invalidateQueries({ queryKey: ['courses'] });
			queryClient.invalidateQueries({ queryKey: ['course', variables.data.course_id] });
			queryClient.invalidateQueries({ queryKey: ['module', variables.id] });
		},
	});
};