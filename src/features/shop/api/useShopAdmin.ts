import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
	shopApi,
	type CreateShopColorPayload,
	type CreateShopStatusPayload,
} from './shop.api';

export const useSeedShop = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: shopApi.seed,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['shop', 'colors'] });
			queryClient.invalidateQueries({ queryKey: ['shop', 'statuses'] });
		},
	});
};

export const useCreateShopColorAdmin = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (payload: CreateShopColorPayload) =>
			shopApi.createColorAdmin(payload),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['shop', 'colors'] });
		},
	});
};

export const useCreateShopStatusAdmin = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (payload: CreateShopStatusPayload) =>
			shopApi.createStatusAdmin(payload),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['shop', 'statuses'] });
		},
	});
};