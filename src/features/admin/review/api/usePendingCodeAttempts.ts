import { useQuery } from '@tanstack/react-query';
import { adminReviewApi, type PendingCodeAttempt } from './review.api';

export const usePendingCodeAttempts = () => {
	return useQuery<PendingCodeAttempt[]>({
		queryKey: ['admin', 'pending-code-attempts'],
		queryFn: adminReviewApi.getPending,
		refetchInterval: 15_000,
	});
};
