import { useMutation } from '@tanstack/react-query';
import { achievementApi, type CreateAchievementPayload } from './achievement.api';

export const useCreateAchievementAdmin = () => {
	return useMutation({
		mutationFn: (payload: CreateAchievementPayload) =>
			achievementApi.createAdmin(payload),
	});
};