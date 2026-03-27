import type { Task } from '@/entities/task/model/task.types';
import type { TaskResult } from './taskResult.types';

export const checkAnswer = (task: Task, answer: string): TaskResult => {
	if (task.type === 'quiz') {
		const correct = answer === task.options[1];

		return {
			correct,
			correctAnswer: task.options[1],
		};
	}

	if (task.type === 'input') {
		const correct = answer.toLowerCase() === 'facebook';

		return {
			correct,
			correctAnswer: 'facebook',
		};
	}

	return {
		correct: false,
		correctAnswer: '',
	};
};

/*
 REAL (позже)
export const checkAnswer = async (taskId: number, answer: string) => {
  return api.post('/tasks/submit', { taskId, answer });
};
*/
