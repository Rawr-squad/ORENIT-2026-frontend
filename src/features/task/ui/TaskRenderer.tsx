import type { Task } from '@/entities/task/model/task.types';
import { QuizTaskComponent } from './QuizTask';
import { InputTaskComponent } from './InputTask';
import { CodeTaskComponent } from './CodeTask';

type Props = {
	task: Task;
	lessonId: number;
};

export const TaskRenderer = ({ task, lessonId }: Props) => {
	switch (task.type) {
		case 'quiz':
			return <QuizTaskComponent task={task} lessonId={lessonId} />;

		case 'input':
			return <InputTaskComponent task={task} lessonId={lessonId} />;

		case 'code':
			return <CodeTaskComponent task={task} lessonId={lessonId} />;

		default:
			return null;
	}
};
