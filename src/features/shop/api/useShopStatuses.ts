import { useQuery } from '@tanstack/react-query';
import { shopApi, type ShopStatus } from './shop.api';

export const useShopStatuses = () => {
	return useQuery<ShopStatus[]>({
		queryKey: ['shop', 'statuses'],
		queryFn: shopApi.getStatuses,
	});
};