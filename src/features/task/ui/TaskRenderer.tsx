import type { Task } from '@/entities/task/model/task.types';
import { QuizTaskComponent } from './QuizTask';
import { InputTaskComponent } from './InputTask';
import { CodeTaskComponent } from './CodeTask';

type Props = {
	task: Task;
};

export const TaskRenderer = ({ task }: Props) => {
	switch (task.type) {
		case 'quiz':
			return <QuizTaskComponent task={task} />;

		case 'input':
			return <InputTaskComponent task={task} />;

		case 'code':
			return <CodeTaskComponent task={task} />;

		default:
			return null;
	}
};
