import { useQuery } from '@tanstack/react-query';
import { achievementApi, type Achievement } from './achievement.api';

export const useAchievementById = (id: number) => {
	return useQuery<Achievement>({
		queryKey: ['achievement', id],
		queryFn: () => achievementApi.getById(id),
		enabled: !!id,
	});
};