import { Input, Button, Typography, message } from 'antd';
import { useState } from 'react';
import type { InputTask as InputTaskType } from '@/entities/task/model/task.types';
import type { TaskAttempt } from '@/entities/task/model/taskAttempt.types';
import { useTaskSubmit } from '../api/useTaskSubmit';

const { Text } = Typography;

type Props = {
	task: InputTaskType;
	lessonId: number;
};

export const InputTaskComponent = ({ task, lessonId }: Props) => {
	const [value, setValue] = useState<string>('');
	const [result, setResult] = useState<TaskAttempt | null>(null);

	const submit = useTaskSubmit();

	const handleSubmit = () => {
		submit.mutate(
			{
				taskId: task.id,
				lessonId,
				answer: value,
			},
			{
				onSuccess: (data: TaskAttempt) => {
					setResult(data);
				},
				onError: () => {
					message.error('Ошибка при отправке ответа');
				},
			},
		);
	};

	return (
		<div>
			<p>{task.question}</p>

			<Input
				value={value}
				onChange={(e) => setValue(e.target.value)}
				placeholder='Введите ответ'
			/>

			<div style={{ marginTop: 12 }}>
				<Button
					type='primary'
					onClick={handleSubmit}
					disabled={!value || submit.isPending}
					loading={submit.isPending}
				>
					Ответить
				</Button>
			</div>

			{result?.status === 'checked' && (
				<div style={{ marginTop: 8 }}>
					{result.is_correct ? (
						<Text type='success'>Правильно</Text>
					) : (
						<Text type='danger'>Неправильно</Text>
					)}
				</div>
			)}
		</div>
	);
};
