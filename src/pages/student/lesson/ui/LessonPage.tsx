import { useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { Alert, Card, Col, Empty, Row, Spin, Tag } from 'antd';
import { useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useLesson } from '@/entities/lesson/api/useLesson';
import type { Task } from '@/entities/task/model/task.types';
import { useAuthStore } from '@/entities/user/model/auth.store';
import { LessonComments } from '@/features/comment/ui/LessonComments';
import { useStartLesson } from '@/features/progress/api/useStartLesson';
import { TaskRenderer } from '@/features/task/ui/TaskRenderer';
import { palette } from '@/shared/config/theme';
import { PageHeader } from '@/shared/ui/layout/PageHeader';
import { Markdown } from '@/shared/ui/Markdown';

const resolveTaskState = (task: Task | null) => {
	if (!task) {
		return {
			label: 'Нет задания',
			color: 'default' as const,
			isPendingCode: false,
			isCompleted: false,
		};
	}

	const status = task.attempt?.status ?? task.attempt_status;
	const isCorrect = task.attempt?.is_correct ?? task.is_correct;

	if (status === 'checked' && isCorrect === true) {
		return {
			label: 'Выполнено',
			color: 'success' as const,
			isPendingCode: false,
			isCompleted: true,
		};
	}

	if (status === 'pending' || status === 'checked') {
		return {
			label: 'В процессе',
			color: 'processing' as const,
			isPendingCode: task.type === 'code' && status === 'pending',
			isCompleted: false,
		};
	}

	return {
		label: 'Не начато',
		color: 'default' as const,
		isPendingCode: false,
		isCompleted: false,
	};
};

const getStartStorageKey = (userId: number, lessonId: number) =>
	`lesson-started:${userId}:${lessonId}`;

const wasStartedInClient = (userId: number | undefined, lessonId: number) => {
	if (!userId) {
		return false;
	}

	try {
		const marker = window.localStorage.getItem(getStartStorageKey(userId, lessonId));
		return marker === 'requested' || marker === 'started';
	} catch {
		return false;
	}
};

const markStartRequestedInClient = (userId: number | undefined, lessonId: number) => {
	if (!userId) {
		return;
	}

	try {
		window.localStorage.setItem(getStartStorageKey(userId, lessonId), 'requested');
	} catch {
		// noop
	}
};

const markStartedInClient = (userId: number | undefined, lessonId: number) => {
	if (!userId) {
		return;
	}

	try {
		window.localStorage.setItem(getStartStorageKey(userId, lessonId), 'started');
	} catch {
		// noop
	}
};

const clearStartRequestedInClient = (userId: number | undefined, lessonId: number) => {
	if (!userId) {
		return;
	}

	try {
		window.localStorage.removeItem(getStartStorageKey(userId, lessonId));
	} catch {
		// noop
	}
};

export const LessonPage = () => {
	const { id } = useParams();
	const lessonId = Number(id);
	const queryClient = useQueryClient();
	const user = useAuthStore((s) => s.user);

	const lessonQuery = useLesson(lessonId);
	const { data: lesson, isLoading, isError, refetch } = lessonQuery;
	const startLesson = useStartLesson();
	const startRequestGuard = useRef<Set<string>>(new Set());
	const hasAttemptOnServer =
		lesson?.tasks?.some((task) => {
			const status = task.attempt?.status ?? task.attempt_status;
			return status === 'pending' || status === 'checked';
		}) ?? false;

	useEffect(() => {
		if (!lessonId || Number.isNaN(lessonId) || !user?.id || isLoading || !lesson) {
			return;
		}

		if (wasStartedInClient(user.id, lessonId)) {
			return;
		}

		const requestKey = `${user.id}:${lessonId}`;
		if (startRequestGuard.current.has(requestKey)) {
			return;
		}

		if (hasAttemptOnServer) {
			markStartedInClient(user.id, lessonId);
			return;
		}

		markStartRequestedInClient(user.id, lessonId);
		startRequestGuard.current.add(requestKey);
		startLesson.mutate(lessonId, {
			onSuccess: () => {
				markStartedInClient(user.id, lessonId);
			},
			onError: (error) => {
				// Некоторые реализации бекенда возвращают 400, если урок уже был начат.
				// Фиксируем локально, чтобы не дублировать запрос.
				if (axios.isAxiosError(error) && error.response?.status === 400) {
					markStartedInClient(user.id, lessonId);
					return;
				}

				startRequestGuard.current.delete(requestKey);
				clearStartRequestedInClient(user.id, lessonId);
			},
		});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [hasAttemptOnServer, isLoading, lesson, lessonId, user?.id]);

	const lessonTask = lesson?.tasks?.[0] ?? null;
	const taskState = resolveTaskState(lessonTask);

	useEffect(() => {
		if (!taskState.isPendingCode) {
			return;
		}

		const intervalId = window.setInterval(() => {
			refetch();
		}, 10_000);

		return () => window.clearInterval(intervalId);
	}, [refetch, taskState.isPendingCode]);

	useEffect(() => {
		if (!taskState.isCompleted) {
			return;
		}

		queryClient.invalidateQueries({ queryKey: ['progress'] });
	}, [queryClient, taskState.isCompleted]);

	if (isLoading) {
		return <Spin style={{ marginTop: 48, marginLeft: 24 }} />;
	}

	if (isError || !lesson) {
		return <Alert style={{ margin: 24 }} type='error' message='Не удалось загрузить урок' />;
	}

	return (
		<div>
			<PageHeader
				title={lesson.title}
				subtitle={`Урок #${lesson.id} — теория и задание`}
				rightSlot={<Tag color={taskState.color}>{taskState.label}</Tag>}
			/>

			<div style={{ padding: 24 }}>
				<Row gutter={16}>
					<Col xs={24} xl={14}>
						<Card
							title='Теория'
							style={{ borderColor: palette.pink, marginBottom: 16 }}
							styles={{ header: { borderBottom: 'none', color: palette.navy } }}
						>
							<Markdown content={lesson.theory_content || 'Теория пока отсутствует.'} />
						</Card>
					</Col>

					<Col xs={24} xl={10}>
						{lessonTask ? (
							<TaskRenderer task={lessonTask} lessonId={lessonId} />
						) : (
							<Card title='Задание' style={{ borderColor: palette.pink }}>
								<Empty description='В этом уроке пока нет задания' />
							</Card>
						)}
						<LessonComments lessonId={lessonId} />
					</Col>
				</Row>
			</div>
		</div>
	);
};
