import { useQuery } from '@tanstack/react-query';
import { progressApi, type ProgressResponse } from './progress.api';
import { useUserStore } from '@/entities/user/model/user.store';
import { useEffect } from 'react';

export const useProgress = () => {
	const setProgress = useUserStore((s) => s.setProgress);

	const query = useQuery<ProgressResponse>({
		queryKey: ['progress'],
		queryFn: progressApi.getMe,
	});

	useEffect(() => {
		if (query.data) {
			setProgress(query.data.xp, query.data.completed_lessons);
		}
	}, [query.data, setProgress]);

	return query;
};
