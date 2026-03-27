import { useMutation, useQueryClient } from '@tanstack/react-query';
import { rewardApi } from './reward.api';

export const useClaimDailyReward = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: rewardApi.claimDaily,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['progress'] });
			queryClient.invalidateQueries({ queryKey: ['me'] });
			queryClient.invalidateQueries({ queryKey: ['leaderboard'] });
		},
	});
};
