import { useMutation } from '@tanstack/react-query';
import { parentLinkApi, type ParentLinkRequest } from './parentLink.api';

export const useParentLink = () => {
	return useMutation<void, Error, ParentLinkRequest>({
		mutationFn: parentLinkApi.link,
	});
};
