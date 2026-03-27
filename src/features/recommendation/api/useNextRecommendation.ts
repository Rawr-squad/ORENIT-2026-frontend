import { useQuery } from '@tanstack/react-query';
import { recommendationApi, type NextLessonRecommendation } from './recommendation.api';

export const useNextRecommendation = () => {
	return useQuery<NextLessonRecommendation | null>({
		queryKey: ['recommendations', 'next'],
		queryFn: recommendationApi.getNext,
	});
};
