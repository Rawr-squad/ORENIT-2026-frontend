import { useMutation } from '@tanstack/react-query';
import { parentApi } from './parent.api';

export const useLinkChild = () => {
	return useMutation({
		mutationFn: (parent_email: string) => parentApi.linkChild(parent_email),
	});
};

