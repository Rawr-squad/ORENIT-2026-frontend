export type LeaderboardUser = {
	id?: number;
	user_id: number;
	nickname?: string;
	xp: number;
	coins?: number;
	avatar_url?: string;
	nickname_color?: string;
	custom_status?: string;
};
export type ProgressResponse = {
	xp: number;
	coins: number;

	completed_lessons: number;
	started_lessons: number;
	not_started_lessons: number;

	nickname: string;
	nickname_color: string | null;
	status: string;
	user_id: number;
};

export type LessonDistribution = {
	completed: number;
	startedNotCompleted: number;
	notStarted: number;
	total: number;
};
