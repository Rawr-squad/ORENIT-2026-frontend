import { useQuery } from '@tanstack/react-query';
import { courseApi } from './course.api';
import type { CourseFull } from '@/entities/course/model/course.types';

export const useCourse = (id: number) => {
	return useQuery<CourseFull>({
		queryKey: ['course', id],
		queryFn: () => courseApi.getById(id),
		enabled: !!id,
	});
};
