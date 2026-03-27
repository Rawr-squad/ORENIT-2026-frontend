import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { authApi } from '@/shared/api/auth.api';
import { useAuthStore } from '@/entities/user/model/auth.store';
import type { User } from '@/shared/types/auth';

export const useMe = () => {
	const token = useAuthStore((s) => s.token);
	const setUser = useAuthStore((s) => s.setUser);

	const query = useQuery<User>({
		queryKey: ['me'],
		queryFn: authApi.me,
		enabled: !!token,
	});

	useEffect(() => {
		if (query.data) {
			setUser(query.data);
		}
	}, [query.data, setUser]);

	return query;
};
