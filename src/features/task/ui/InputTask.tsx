import { Alert, App, Button, Card, Input, Tag } from 'antd';
import { useState } from 'react';
import type { InputTask as InputTaskType } from '@/entities/task/model/task.types';
import type { TaskAttempt } from '@/entities/task/model/taskAttempt.types';
import { useTaskSubmit } from '../api/useTaskSubmit';
import { Markdown } from '@/shared/ui/Markdown';
import { palette } from '@/shared/config/theme';

type Props = {
	task: InputTaskType;
	lessonId: number;
};

const toInitialAttempt = (task: InputTaskType): TaskAttempt | null => {
	if (task.attempt) {
		return task.attempt;
	}

	if (task.attempt_status) {
		return {
			id: task.id,
			status: task.attempt_status,
			is_correct: task.is_correct,
		};
	}

	return null;
};

export const InputTaskComponent = ({ task, lessonId }: Props) => {
	const { message } = App.useApp();
	const [value, setValue] = useState('');
	const [result, setResult] = useState<TaskAttempt | null>(() => toInitialAttempt(task));
	const submit = useTaskSubmit();

	const handleSubmit = () => {
		submit.mutate(
			{ taskId: task.id, lessonId, answer: value },
			{
				onSuccess: (data) => setResult(data),
				onError: () => {
					message.error('Не удалось отправить ответ');
				},
			},
		);
	};

	return (
		<Card style={{ borderColor: palette.pink }}>
			<Markdown content={task.question} />
			{result?.status === 'pending' && (
				<div style={{ marginTop: 8 }}>
					<Tag color='processing'>На проверке</Tag>
				</div>
			)}
			<Input
				value={value}
				onChange={(e) => setValue(e.target.value)}
				placeholder='Введите ваш ответ'
				style={{ marginTop: 12 }}
			/>
			<Button
				type='primary'
				onClick={handleSubmit}
				disabled={!value || submit.isPending}
				loading={submit.isPending}
				style={{ marginTop: 14, color: palette.navy, fontWeight: 700 }}
			>
				Отправить ответ
			</Button>
			{result?.status === 'checked' && (
				<Alert
					style={{ marginTop: 12 }}
					type={result.is_correct ? 'success' : 'error'}
					message={result.is_correct ? 'Верный ответ' : 'Неверный ответ'}
				/>
			)}
		</Card>
	);
};
