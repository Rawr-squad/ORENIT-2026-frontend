import { useQuery } from '@tanstack/react-query';
import type { ModuleFull } from '../model/module.types';
import { moduleApi } from './module.api';

export const useModules = () => {
	return useQuery<ModuleFull[]>({
		queryKey: ['modules'],
		queryFn: moduleApi.getAll,
	});
};