import { useQuery } from '@tanstack/react-query';
import { lessonApi } from './lesson.api';
import type { Lesson } from '../model/lesson.types';

export const useLesson = (id: number) => {
	return useQuery<Lesson>({
		queryKey: ['lesson', id],
		queryFn: () => lessonApi.getById(id),
		enabled: !!id,
	});
};
