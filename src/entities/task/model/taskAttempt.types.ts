export type TaskStatus = 'checked' | 'pending';

export type TaskAttempt = {
	id: number;
	is_correct?: boolean;
	status: TaskStatus;
	feedback?: string;
	answer?: string;
	created_at?: string;
};

export type SubmitTaskRequest = {
	taskId: number;
	answer: string;
};
