import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { progressApi } from './progress.api';
import type { ProgressResponse } from './progress.types';
import { useUserStore } from '@/entities/user/model/user.store';
import { useAuthStore } from '@/entities/user/model/auth.store';

export const useProgress = () => {
	const setProgress = useUserStore((s) => s.setProgress);
	const user = useAuthStore((s) => s.user);
	const setUser = useAuthStore((s) => s.setUser);

	const query = useQuery<ProgressResponse>({
		queryKey: ['progress'],
		queryFn: progressApi.getMe,
	});

	useEffect(() => {
		if (!query.data) {
			return;
		}

		setProgress(query.data.xp, query.data.completed_lessons);

		if (user) {
			const nextCoins = query.data.coins ?? user.coins;
			if (user.xp === query.data.xp && user.coins === nextCoins) {
				return;
			}

			setUser({
				...user,
				xp: query.data.xp,
				coins: nextCoins,
			});
		}
	}, [query.data, setProgress, setUser, user]);

	return query;
};
