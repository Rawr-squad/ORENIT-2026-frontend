import { useMutation, useQueryClient } from '@tanstack/react-query';
import { adminLessonApi } from './lesson.api';

export const useDeleteLesson = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (id: number) => adminLessonApi.delete(id),
		onSuccess: (_, lessonId) => {
			queryClient.invalidateQueries({ queryKey: ['course'] });
			queryClient.invalidateQueries({ queryKey: ['module'] });
			queryClient.invalidateQueries({ queryKey: ['lesson', lessonId] });
			queryClient.invalidateQueries({ queryKey: ['progress'] });
		},
	});
};