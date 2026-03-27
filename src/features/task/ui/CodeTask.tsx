import { Button, Select, Typography, message } from 'antd';
import { useState } from 'react';
import Editor from '@monaco-editor/react';
import type { CodeTask as CodeTaskType } from '@/entities/task/model/task.types';
import type { TaskAttempt } from '@/entities/task/model/taskAttempt.types';
import { useTaskSubmit } from '../api/useTaskSubmit';

const { Text } = Typography;

type Props = {
	task: CodeTaskType;
	lessonId: number;
};

type Language = 'javascript' | 'python' | 'cpp';

export const CodeTaskComponent = ({ task, lessonId }: Props) => {
	const [code, setCode] = useState<string>('');
	const [language, setLanguage] = useState<Language>('javascript');
	const [result, setResult] = useState<TaskAttempt | null>(null);

	const submit = useTaskSubmit();

	const handleSubmit = () => {
		submit.mutate(
			{
				taskId: task.id,
				lessonId,
				answer: JSON.stringify({
					code,
					language,
				}),
			},
			{
				onSuccess: (data: TaskAttempt) => {
					setResult(data);
				},
				onError: () => {
					message.error('Ошибка при отправке кода');
				},
			},
		);
	};

	return (
		<div>
			<p>{task.question}</p>

			<Select<Language>
				value={language}
				onChange={(value) => setLanguage(value)}
				style={{ marginBottom: 8, width: 200 }}
				options={[
					{ value: 'javascript', label: 'JavaScript' },
					{ value: 'python', label: 'Python' },
					{ value: 'cpp', label: 'C++' },
				]}
			/>

			<Editor
				height='300px'
				language={language}
				value={code}
				onChange={(value: string | undefined) => setCode(value ?? '')}
				options={{
					minimap: { enabled: false },
					fontSize: 14,
				}}
			/>

			<div style={{ marginTop: 12 }}>
				<Button
					type='primary'
					onClick={handleSubmit}
					disabled={!code || submit.isPending}
					loading={submit.isPending}
				>
					Отправить код
				</Button>
			</div>

			{result?.status === 'pending' && (
				<div style={{ marginTop: 8 }}>
					<Text>Отправлено на проверку</Text>
				</div>
			)}

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
