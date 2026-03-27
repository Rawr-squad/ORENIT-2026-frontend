import { useMutation, useQueryClient } from '@tanstack/react-query';
import { adminCourseApi } from '../../../course/api/course.api';
import type { CourseCreate } from '@/entities/course/model/course.types';

export const useCreateCourse = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (data: CourseCreate) => adminCourseApi.create(data),

		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ['courses'],
			});
		},
	});
};
