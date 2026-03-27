import { useMutation } from '@tanstack/react-query';
import { achievementApi } from './achievement.api';

export const useSeedAchievements = () => {
	return useMutation({
		mutationFn: achievementApi.seed,
	});
};