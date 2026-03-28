import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { progressApi } from './progress.api';
import { useAuthStore } from '@/entities/user/model/auth.store';

export const useProgress = () => {
	const setUser = useAuthStore((s) => s.setUser);
	const user = useAuthStore((s) => s.user);

	const query = useQuery({
		queryKey: ['progress'],
		queryFn: progressApi.getMe,
	});

	useEffect(() => {
		if (query.data && user) {
			setUser({
				...user,
				coins: query.data.coins,
			});
		}
	}, [query.data]);

	return query;
};

