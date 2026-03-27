import type { CoursePreview } from '@/entities/course/model/course.types';
import { useQuery } from '@tanstack/react-query';
import { adminCourseApi } from '../../../course/api/course.api';

export const useCoursesAdmin = () => {
	return useQuery<CoursePreview[]>({
		queryKey: ['courses'],
		queryFn: adminCourseApi.getAll,
	});
};

