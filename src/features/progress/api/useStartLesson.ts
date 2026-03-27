import { useMutation, useQueryClient } from '@tanstack/react-query';
import { progressApi } from './progress.api';

export const useStartLesson = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (lessonId: number) => progressApi.startLesson(lessonId),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['progress'] });
		},
	});
};
