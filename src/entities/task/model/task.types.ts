import type { TaskAttempt, TaskStatus } from './taskAttempt.types';

export type TaskType = 'quiz' | 'input' | 'code';

export type BaseTask = {
	id: number;
	lesson_id?: number;
	type: TaskType;
	question: string;
	correct_answer?: string | null;
	coins?: number;
	attempt?: TaskAttempt | null;
	attempt_status?: TaskStatus;
	is_correct?: boolean;
};

export type QuizTask = BaseTask & {
	type: 'quiz';
	options: string[];
};

export type InputTask = BaseTask & {
	type: 'input';
};

export type CodeTask = BaseTask & {
	type: 'code';
};

export type Task = QuizTask | InputTask | CodeTask;

export type TaskCreate = {
	lesson_id: number;
	type: TaskType;
	question: string;
	options: null | string[];
	correct_answer: string | null;
	coins: number;
};

