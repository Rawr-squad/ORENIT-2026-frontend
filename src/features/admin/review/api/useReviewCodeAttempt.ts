import { useMutation, useQueryClient } from '@tanstack/react-query';
import { adminReviewApi } from './review.api';

export const useReviewCodeAttempt = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({
			attemptId,
			isCorrect,
			feedback,
		}: {
			attemptId: number;
			isCorrect: boolean;
			feedback?: string;
		}) => adminReviewApi.review(attemptId, isCorrect, feedback),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['admin', 'pending-code-attempts'] });
			queryClient.invalidateQueries({ queryKey: ['lesson'] });
			queryClient.invalidateQueries({ queryKey: ['progress'] });
		},
	});
};