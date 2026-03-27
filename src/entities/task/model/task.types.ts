export type TaskType = 'quiz' | 'input' | 'code';

export type BaseTask = {
	id: number;
	type: TaskType;
	question: string;
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
