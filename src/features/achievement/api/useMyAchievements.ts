import { useQuery } from '@tanstack/react-query';
import { achievementApi, type Achievement } from './achievement.api';

export const useMyAchievements = () => {
	return useQuery<Achievement[]>({
		queryKey: ['achievements', 'me'],
		queryFn: achievementApi.getMy,
	});
};

