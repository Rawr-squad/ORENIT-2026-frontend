import { useQuery } from '@tanstack/react-query';
import { commentApi } from './comment.api';
import type { LessonComment } from '@/entities/comment/model/comment.types';

export const useLessonComments = (lessonId: number) => {
	return useQuery<LessonComment[]>({
		queryKey: ['comments', 'lesson', lessonId],
		queryFn: () => commentApi.getByLesson(lessonId),
		enabled: !!lessonId,
	});
};