import type { Task } from '@/entities/task/model/task.types';

export type Lesson = {
	id: number;
	title: string;
	theory: string; // markdown
	tasks: Task[];
};
