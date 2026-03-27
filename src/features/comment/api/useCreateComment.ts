import { useMutation, useQueryClient } from '@tanstack/react-query';
import { commentApi } from './comment.api';
import type { CommentCreateRequest } from '@/entities/comment/model/comment.types';

export const useCreateComment = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (payload: CommentCreateRequest) => commentApi.create(payload),
		onSuccess: (_, variables) => {
			queryClient.invalidateQueries({
				queryKey: ['comments', 'lesson', variables.lesson_id],
			});
		},
	});
};