import { useQuery } from '@tanstack/react-query';
import type { ModuleFull } from '../models/module.types';
import { moduleApi } from './module.api';

export const useModule = (id: number) => {
	return useQuery<ModuleFull>({
		queryKey: ['module', id],
		queryFn: () => moduleApi.getById(id),
		enabled: !!id, // важно
	});
};
