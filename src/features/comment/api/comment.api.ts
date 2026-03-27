import { api } from '@/shared/api/client';
import type {
	CommentCreateRequest,
	LessonComment,
} from '@/entities/comment/model/comment.types';

const toArray = <T>(payload: unknown): T[] => {
	if (Array.isArray(payload)) {
		return payload as T[];
	}

	if (payload && typeof payload === 'object') {
		const data = payload as Record<string, unknown>;
		if (Array.isArray(data.items)) {
			return data.items as T[];
		}
		if (Array.isArray(data.comments)) {
			return data.comments as T[];
		}
		if (Array.isArray(data.data)) {
			return data.data as T[];
		}
	}

	return [];
};

const parseComment = (payload: unknown, fallbackId: number): LessonComment => {
	const raw = (payload ?? {}) as Record<string, unknown>;
	const rawUser = (raw.user ?? {}) as Record<string, unknown>;
	const repliesRaw = Array.isArray(raw.replies) ? raw.replies : [];

	return {
		id: Number(raw.id ?? fallbackId),
		lesson_id: Number(raw.lesson_id ?? 0),
		content: String(raw.content ?? ''),
		parent_id:
			raw.parent_id == null || raw.parent_id === '' ? null : Number(raw.parent_id),
		user_id: raw.user_id == null ? undefined : Number(raw.user_id),
		user_nickname:
			typeof raw.user_nickname === 'string'
				? raw.user_nickname
				: typeof raw.nickname === 'string'
					? String(raw.nickname)
					: typeof rawUser.nickname === 'string'
						? String(rawUser.nickname)
						: undefined,
		user_avatar_url:
			typeof raw.user_avatar_url === 'string'
				? raw.user_avatar_url
				: typeof raw.avatar_url === 'string'
					? raw.avatar_url
					: typeof rawUser.avatar_url === 'string'
						? String(rawUser.avatar_url)
						: typeof rawUser.avatar === 'string'
							? String(rawUser.avatar)
							: undefined,
		user_nickname_color:
			typeof raw.user_nickname_color === 'string'
				? raw.user_nickname_color
				: typeof raw.nickname_color === 'string'
					? raw.nickname_color
					: typeof rawUser.nickname_color === 'string'
						? String(rawUser.nickname_color)
						: typeof rawUser.color_hex === 'string'
							? String(rawUser.color_hex)
							: undefined,
		user_custom_status:
			typeof raw.user_custom_status === 'string'
				? raw.user_custom_status
				: typeof raw.custom_status === 'string'
					? raw.custom_status
					: typeof rawUser.custom_status === 'string'
						? String(rawUser.custom_status)
						: typeof rawUser.status_title === 'string'
							? String(rawUser.status_title)
							: undefined,
		created_at: typeof raw.created_at === 'string' ? raw.created_at : undefined,
		replies: repliesRaw.map((reply, index) =>
			parseComment(reply, Number(raw.id ?? fallbackId) * 1_000 + index + 1),
		),
	};
};

const buildTree = (comments: LessonComment[]): LessonComment[] => {
	const map = new Map<number, LessonComment>();
	for (const comment of comments) {
		map.set(comment.id, { ...comment, replies: [] });
	}

	const roots: LessonComment[] = [];
	for (const comment of comments) {
		const current = map.get(comment.id);
		if (!current) {
			continue;
		}

		if (comment.parent_id && map.has(comment.parent_id)) {
			map.get(comment.parent_id)?.replies.push(current);
		} else {
			roots.push(current);
		}
	}

	return roots;
};

const normalizeComments = (payload: unknown): LessonComment[] => {
	const comments = toArray<unknown>(payload).map((comment, index) =>
		parseComment(comment, index + 1),
	);

	const hasNestedReplies = comments.some((comment) => comment.replies.length > 0);
	if (hasNestedReplies) {
		return comments;
	}

	return buildTree(comments);
};

export const commentApi = {
	getByLesson: async (lessonId: number): Promise<LessonComment[]> => {
		const res = await api.get(`/comments/lesson/${lessonId}`);
		return normalizeComments(res.data);
	},

	create: async (payload: CommentCreateRequest) => {
		const res = await api.post('/comments', payload);
		return res.data;
	},
};
