import { useMutation, useQueryClient } from '@tanstack/react-query';
import { adminCourseApi } from '../../../course/api/course.api';
import type { CourseCreate } from '@/entities/course/model/course.types';

export const useUpdateCourse = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ id, data }: { id: number; data: CourseCreate }) =>
			adminCourseApi.update(id, data),
		onSuccess: (_, variables) => {
			queryClient.invalidateQueries({ queryKey: ['courses'] });
			queryClient.invalidateQueries({ queryKey: ['course', variables.id] });
		},
	});
};

