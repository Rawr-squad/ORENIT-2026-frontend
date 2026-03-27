import { useMutation, useQueryClient } from '@tanstack/react-query';
import { adminLessonApi } from './lesson.api';
import type { LessonCreate } from '@/entities/course/model/course.types';

export const useUpdateLesson = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ id, data }: { id: number; data: LessonCreate }) =>
			adminLessonApi.update(id, data),
		onSuccess: (_, variables) => {
			queryClient.invalidateQueries({ queryKey: ['module', variables.data.module_id] });
			queryClient.invalidateQueries({ queryKey: ['lesson', variables.id] });
			queryClient.invalidateQueries({ queryKey: ['course'] });
			queryClient.invalidateQueries({ queryKey: ['courses'] });
		},
	});
};