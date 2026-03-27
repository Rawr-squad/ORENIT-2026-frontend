import { useQuery } from '@tanstack/react-query';
import { achievementApi, type Achievement } from './achievement.api';

export const useAchievements = () => {
	return useQuery<Achievement[]>({
		queryKey: ['achievements'],
		queryFn: achievementApi.getAll,
	});
};