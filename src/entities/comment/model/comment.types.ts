export type LessonComment = {
	id: number;
	lesson_id: number;
	content: string;
	parent_id: number | null;
	user_id?: number;
	user_nickname?: string;
	user_avatar_url?: string;
	user_nickname_color?: string;
	user_custom_status?: string;
	created_at?: string;
	replies: LessonComment[];
};

export type CommentCreateRequest = {
	lesson_id: number;
	content: string;
	parent_id?: number | null;
};
