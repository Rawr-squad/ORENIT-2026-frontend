import { useQuery } from '@tanstack/react-query';
import { courseApi } from './course.api';
import type { CoursePreview } from '@/entities/course/model/course.types';

export const useCourses = () => {
	return useQuery<CoursePreview[]>({
		queryKey: ['courses'],
		queryFn: courseApi.getAll,
	});
};
