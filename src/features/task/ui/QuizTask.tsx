import { Radio, Button, Typography } from 'antd';
import { useState } from 'react';
import type { QuizTask } from '@/entities/task/model/task.types';
import { useSubmitTask } from '@/features/task/api/useSubmitTask';
import { useQueryClient } from '@tanstack/react-query';
import type { TaskAttempt } from '@/entities/task/model/taskAttempt.types';

const { Text } = Typography;

type Props = {
	task: QuizTask;
};

export const QuizTaskComponent = ({ task }: Props) => {
	const [value, setValue] = useState<string>('');
	const [result, setResult] = useState<TaskAttempt | null>(null);

	const submit = useSubmitTask();
	const queryClient = useQueryClient();

	const handleSubmit = () => {
		submit.mutate(
			{ taskId: task.id, answer: value },
			{
				onSuccess: (res) => {
					setResult(res);

					//  обновляем прогресс
					queryClient.invalidateQueries({ queryKey: ['progress'] });
				},
			},
		);
	};

	return (
		<div>
			<p>{task.question}</p>

			<Radio.Group onChange={(e) => setValue(e.target.value)} value={value}>
				{task.options.map((option) => (
					<Radio key={option} value={option}>
						{option}
					</Radio>
				))}
			</Radio.Group>

			<div style={{ marginTop: 12 }}>
				<Button type='primary' onClick={handleSubmit} disabled={!value}>
					Проверить
				</Button>
			</div>

			{result?.status === 'checked' && (
				<div style={{ marginTop: 8 }}>
					{result.is_correct ? (
						<Text type='success'>Правильно </Text>
					) : (
						<Text type='danger'>Неправильно ❌</Text>
					)}
				</div>
			)}
		</div>
	);
};
