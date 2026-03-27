import { useMutation, useQueryClient } from '@tanstack/react-query';
import { adminCourseApi } from '../../../course/api/course.api';

export const useDeleteCourse = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (id: number) => adminCourseApi.delete(id),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['courses'] });
		},
	});
};

