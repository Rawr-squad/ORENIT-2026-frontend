import { Input, Button, Typography } from 'antd';
import { useState } from 'react';
import type { InputTask } from '@/entities/task/model/task.types';
import { checkAnswer } from '@/features/task/model/checkAnswer';

const { Text } = Typography;

type Props = {
	task: InputTask;
};

export const InputTaskComponent = ({ task }: Props) => {
	const [value, setValue] = useState<string>('');
	const [result, setResult] = useState<null | {
		correct: boolean;
		correctAnswer: string;
	}>(null);

	const handleSubmit = () => {
		const res = checkAnswer(task, value);
		setResult(res);
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
				<Button type='primary' onClick={handleSubmit} disabled={!value}>
					Проверить
				</Button>
			</div>

			{result && (
				<div style={{ marginTop: 8 }}>
					{result.correct ? (
						<Text type='success'>Правильно </Text>
					) : (
						<Text type='danger'>
							Неправильно ❌ (ответ: {result.correctAnswer})
						</Text>
					)}
				</div>
			)}
		</div>
	);
};
