import { Alert, Button, Radio, Space, Tag } from 'antd';
import { useState } from 'react';
import type { QuizTask } from '@/entities/task/model/task.types';
import type { TaskAttempt } from '@/entities/task/model/taskAttempt.types';
import { useTaskSubmit } from '../api/useTaskSubmit';
import { Markdown } from '@/shared/ui/Markdown';
import { palette } from '@/shared/config/theme';
import { BaseCard } from '@/shared/ui/card/BaseCard';

type Props = {
	task: QuizTask;
	lessonId: number;
};

const toInitialAttempt = (task: QuizTask): TaskAttempt | null => {
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

export const QuizTaskComponent = ({ task, lessonId }: Props) => {
	const [value, setValue] = useState<string>('');
	const [result, setResult] = useState<TaskAttempt | null>(() =>
		toInitialAttempt(task),
	);
	const submit = useTaskSubmit();

	console.log(task);

	const options = Array.isArray(task.options) ? task.options : [];

	const handleSubmit = () => {
		submit.mutate(
			{ taskId: task.id, lessonId, answer: value },
			{
				onSuccess: (res) => setResult(res),
			},
		);
	};

	return (
		<BaseCard>
			<Markdown content={task.question} />

			{result?.status === 'pending' && (
				<div style={{ marginTop: 8 }}>
					<Tag color='processing'>На проверке</Tag>
				</div>
			)}

			<Radio.Group
				onChange={(e) => setValue(e.target.value)}
				value={value}
				style={{ width: '100%', marginTop: 12 }}
			>
				<Space orientation='vertical' style={{ width: '100%' }}>
					{options.map((option) => (
						<BaseCard key={option} bodyStyle={{ padding: 10 }}>
							<Radio value={option}>{option}</Radio>
						</BaseCard>
					))}
				</Space>
			</Radio.Group>

			<Button
				type='primary'
				onClick={handleSubmit}
				disabled={!value || submit.isPending}
				loading={submit.isPending}
				style={{ marginTop: 14, color: palette.navy, fontWeight: 700 }}
			>
				Проверить ответ
			</Button>

			{result?.status === 'checked' && (
				<Alert
					style={{ marginTop: 12 }}
					type={result.is_correct ? 'success' : 'error'}
					message={result.is_correct ? 'Верный ответ' : 'Попробуйте еще раз'}
				/>
			)}
		</BaseCard>
	);
};

