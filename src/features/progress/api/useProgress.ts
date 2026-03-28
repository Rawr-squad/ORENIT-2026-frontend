import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';

import { progressApi } from './progress.api';
import { useUserStore } from '@/entities/user/model/user.store';
import type { ProgressResponse } from './progress.types';

export const useProgress = () => {
	const setProgress = useUserStore((s) => s.setProgress);

	const query = useQuery<ProgressResponse>({
		queryKey: ['progress'],
		queryFn: progressApi.getMe,
	});

	useEffect(() => {
		if (query.data) {
			setProgress(query.data);
		}
	}, [query.data, setProgress]);

	return query;
};

