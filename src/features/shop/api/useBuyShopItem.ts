import { useMutation, useQueryClient } from '@tanstack/react-query';
import { shopApi } from './shop.api';

export const useBuyShopColor = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (colorId: number) => shopApi.buyColor(colorId),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['shop', 'colors'] });
			queryClient.invalidateQueries({ queryKey: ['shop', 'statuses'] });
			queryClient.invalidateQueries({ queryKey: ['me'] });
			queryClient.invalidateQueries({ queryKey: ['progress'] });
			queryClient.invalidateQueries({ queryKey: ['leaderboard'] });
		},
	});
};

export const useBuyShopStatus = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (statusId: number) => shopApi.buyStatus(statusId),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['shop', 'colors'] });
			queryClient.invalidateQueries({ queryKey: ['shop', 'statuses'] });
			queryClient.invalidateQueries({ queryKey: ['me'] });
			queryClient.invalidateQueries({ queryKey: ['progress'] });
			queryClient.invalidateQueries({ queryKey: ['leaderboard'] });
		},
	});
};
