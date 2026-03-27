export type TaskStatus = 'checked' | 'pending';

export type TaskAttempt = {
	id: number;
	is_correct?: boolean;
	status: TaskStatus;
};

export type SubmitTaskRequest = {
	taskId: number;
	answer: string;
};
