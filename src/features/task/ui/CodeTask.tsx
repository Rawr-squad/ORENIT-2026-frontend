import { lazy, Suspense, useMemo, useState } from 'react';
import { Alert, App, Button, Select, Spin, Tag } from 'antd';
import type { CodeTask as CodeTaskType } from '@/entities/task/model/task.types';
import type { TaskAttempt } from '@/entities/task/model/taskAttempt.types';
import { useTaskSubmit } from '../api/useTaskSubmit';
import { palette } from '@/shared/config/theme';
import { Markdown } from '@/shared/ui/Markdown';
import { BaseCard } from '@/shared/ui/card/BaseCard';

const MonacoEditor = lazy(() => import('@monaco-editor/react'));

type Props = {
	task: CodeTaskType;
	lessonId: number;
};

type Language = 'javascript' | 'python' | 'cpp';

const toInitialAttempt = (task: CodeTaskType): TaskAttempt | null => {
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

const canSubmitCode = (attempt: TaskAttempt | null) => {
	if (!attempt) {
		return true;
	}

	if (attempt.status === 'pending') {
		return false;
	}

	if (attempt.status === 'checked' && attempt.is_correct !== false) {
		return false;
	}

	return true;
};

const formatCodeSubmission = (value: string, language: Language): string =>
	`\`\`\`${language}\n${value}\n\`\`\``;

export const CodeTaskComponent = ({ task, lessonId }: Props) => {
	const { message } = App.useApp();
	const [code, setCode] = useState('');
	const [language, setLanguage] = useState<Language>('javascript');
	const submit = useTaskSubmit();

	const result = useMemo(() => {
		const serverResult = toInitialAttempt(task);
		if (serverResult) {
			return serverResult;
		}
		return submit.data ?? null;
	}, [submit.data, task]);

	const canSubmit = useMemo(() => canSubmitCode(result), [result]);

	const handleSubmit = () => {
		if (!canSubmit) {
			message.info(
				'Сейчас отправка недоступна. Дождитесь результата проверки.',
			);
			return;
		}

		submit.mutate(
			{
				taskId: task.id,
				lessonId,
				answer: formatCodeSubmission(code, language),
			},
			{
				onError: () => message.error('Не удалось отправить код'),
			},
		);
	};

	return (
		<BaseCard>
			<Markdown content={task.question} />

			<div style={{ marginTop: 10 }}>
				{result?.status === 'pending' && (
					<Tag color='processing'>На проверке</Tag>
				)}
				{result?.status === 'checked' && result.is_correct === true && (
					<Tag color='success'>Проверено: верно</Tag>
				)}
				{result?.status === 'checked' && result.is_correct === false && (
					<Tag color='error'>Проверено: неверно, можно повторить</Tag>
				)}
			</div>

			<Select<Language>
				value={language}
				onChange={setLanguage}
				style={{ marginTop: 12, width: 180 }}
				options={[
					{ value: 'javascript', label: 'JavaScript' },
					{ value: 'python', label: 'Python' },
					{ value: 'cpp', label: 'C++' },
				]}
			/>

			<div style={{ marginTop: 12, borderRadius: 12, overflow: 'hidden' }}>
				<Suspense
					fallback={<Spin style={{ display: 'block', margin: '48px auto' }} />}
				>
					<MonacoEditor
						height='300px'
						language={language}
						value={code}
						onChange={(value) => setCode(value ?? '')}
						options={{
							minimap: { enabled: false },
							fontSize: 14,
							readOnly: !canSubmit,
						}}
					/>
				</Suspense>
			</div>

			<Button
				type='primary'
				onClick={handleSubmit}
				disabled={!code || submit.isPending || !canSubmit}
				loading={submit.isPending}
				style={{ marginTop: 14, color: palette.navy, fontWeight: 700 }}
			>
				Отправить код
			</Button>

			{result?.status === 'pending' && (
				<Alert
					style={{ marginTop: 12 }}
					type='info'
					message='Код отправлен на проверку. Повторная отправка заблокирована до результата.'
				/>
			)}

			{result?.status === 'checked' && result.is_correct === true && (
				<Alert
					style={{ marginTop: 12 }}
					type='success'
					message='Решение принято.'
				/>
			)}

			{result?.status === 'checked' && result.is_correct === false && (
				<Alert
					style={{ marginTop: 12 }}
					type='error'
					message='Неверное решение. Можно отправить еще одну попытку.'
				/>
			)}

			{result?.feedback && (
				<Alert
					style={{ marginTop: 12 }}
					type='info'
					message={result.feedback}
				/>
			)}
		</BaseCard>
	);
};

