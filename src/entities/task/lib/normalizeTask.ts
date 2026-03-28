export type TaskType = 'quiz' | 'input' | 'code';

export interface Task {
	id: number;
	type: TaskType;
	question: string;
	options?: string[] | null;
	coins: number;
}

export const normalizeTask = (raw: any): Task => {
	return {
		// фикс: поддержка id / task_id
		id: Number(raw.id ?? raw.task_id),

		// фикс: нормализация типа
		type: String(raw.type).toLowerCase() as TaskType,

		question: String(raw.question ?? ''),

		options: Array.isArray(raw.options) ? raw.options : null,

		coins: Number(raw.coins ?? 0),
	};
};

