import { Input, Button, Typography } from 'antd';
import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import type { CodeTask } from '@/entities/task/model/task.types';
import { useSubmitTask } from '@/features/task/api/useSubmitTask';
import type { TaskAttempt } from '@/entities/task/model/taskAttempt.types';

const { Text } = Typography;
const { TextArea } = Input;

type Props = {
	task: CodeTask;
};

export const CodeTaskComponent = ({ task }: Props) => {
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

					queryClient.invalidateQueries({ queryKey: ['progress'] });
				},
			},
		);
	};

	return (
		<div>
			<p>{task.question}</p>

			<TextArea
				rows={6}
				value={value}
				onChange={(e) => setValue(e.target.value)}
				placeholder='Напишите ваш код...'
			/>

			<div style={{ marginTop: 12 }}>
				<Button type='primary' onClick={handleSubmit} disabled={!value}>
					Отправить на проверку
				</Button>
			</div>

			{result?.status === 'pending' && (
				<div style={{ marginTop: 8 }}>
					<Text>Код отправлен на проверку 👨‍💻</Text>
				</div>
			)}
		</div>
	);
};
