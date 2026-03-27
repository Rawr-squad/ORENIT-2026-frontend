import type { Task } from '@/entities/task/model/task.types';

export type Lesson = {
	id: number;
	title: string;
	theory_content: string; // markdown
	tasks: Task[];
};
