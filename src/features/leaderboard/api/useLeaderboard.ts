import { useQuery } from '@tanstack/react-query';
import { leaderboardApi } from './leaderboard.api';
import type { LeaderboardUser } from '@/features/progress/api/progress.types';

export const useLeaderboard = () => {
	return useQuery<LeaderboardUser[]>({
		queryKey: ['leaderboard'],
		queryFn: leaderboardApi.get,
	});
};

