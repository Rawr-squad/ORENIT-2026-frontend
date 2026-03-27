import type { Task } from '@/entities/task/model/task.types';

export type Lesson = {
	id: number;
	title: string;
	theory_content: string;
	module_id?: number;
	order?: number;
	tasks: Task[];
};

