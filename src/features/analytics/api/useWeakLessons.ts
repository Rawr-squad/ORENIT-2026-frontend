import { useQuery } from '@tanstack/react-query';
import { analyticsApi, type WeakLesson } from './analytics.api';

export const useWeakLessons = () => {
	return useQuery<WeakLesson[]>({
		queryKey: ['analytics', 'weak-lessons'],
		queryFn: analyticsApi.getWeakLessons,
	});
};
