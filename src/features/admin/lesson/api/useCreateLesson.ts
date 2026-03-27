import { useMutation, useQueryClient } from '@tanstack/react-query';
import { adminLessonApi } from './lesson.api';

export const useCreateLesson = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: adminLessonApi.create,
		onSuccess: (_, variables) => {
			queryClient.invalidateQueries({
				queryKey: ['module', variables.module_id],
			});
		},
	});
};
