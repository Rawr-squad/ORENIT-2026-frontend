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

export type ProgressTaskRaw = {
	completed?: number;
	started?: number;
	not_started?: number;
	total?: number;
};

export type ProgressResponse = {
	xp: number;
	coins?: number;
	completed_lessons: number;
	level?: number;
	completed_tasks?: number;
	started_tasks?: number;
	not_started_tasks?: number;
	total_tasks?: number;
	task_progress?: ProgressTaskRaw;
	tasks?: ProgressTaskRaw;
};

export type TaskDistribution = {
	completed: number;
	startedNotCompleted: number;
	notStarted: number;
	total: number;
};

export const getTaskDistribution = (progress?: ProgressResponse): TaskDistribution => {
	if (!progress) {
		return { completed: 0, startedNotCompleted: 0, notStarted: 0, total: 0 };
	}

	const bucket = progress.task_progress ?? progress.tasks ?? {};
	const completed = Number(bucket.completed ?? progress.completed_tasks ?? 0);

	const startedRaw = Number(bucket.started ?? progress.started_tasks ?? completed);
	const startedNotCompleted = Math.max(0, startedRaw - completed);

	const inferredTotalFromNotStarted =
		completed +
		startedNotCompleted +
		Number(bucket.not_started ?? progress.not_started_tasks ?? 0);
	const total = Number(bucket.total ?? progress.total_tasks ?? inferredTotalFromNotStarted);
	const notStarted = Math.max(
		0,
		Number(
			bucket.not_started ??
				progress.not_started_tasks ??
				total - completed - startedNotCompleted,
		),
	);

	const normalizedTotal = Math.max(total, completed + startedNotCompleted + notStarted);

	return {
		completed,
		startedNotCompleted,
		notStarted,
		total: normalizedTotal,
	};
};
