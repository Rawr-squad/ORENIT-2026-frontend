import { useQuery } from '@tanstack/react-query';
import { shopApi, type ShopColor } from './shop.api';

export const useShopColors = () => {
	return useQuery<ShopColor[]>({
		queryKey: ['shop', 'colors'],
		queryFn: shopApi.getColors,
	});
};