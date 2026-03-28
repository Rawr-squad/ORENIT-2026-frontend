import {
	Alert,
	App,
	Button,
	Col,
	Progress,
	Row,
	Spin,
	Tag,
	Typography,
} from 'antd';
import { useNavigate } from 'react-router-dom';

import { useCourses } from '@/features/course/api/useCourses';
import { useProgress } from '@/features/progress/api/useProgress';
import { useNextRecommendation } from '@/features/recommendation/api/useNextRecommendation';
import { useWeakLessons } from '@/features/analytics/api/useWeakLessons';
import { useClaimDailyReward } from '@/features/reward/api/useClaimDailyReward';

import { useAuthStore } from '@/entities/user/model/auth.store';

import { PageHeader } from '@/shared/ui/layout/PageHeader';
import { Markdown } from '@/shared/ui/Markdown';
import { BaseCard } from '@/shared/ui/card/BaseCard';
import { palette } from '@/shared/config/theme';

import { ChatWidget } from '@/features/chat/ui/ChatWidget';

import type { CoursePreview } from '@/entities/course/model/course.types';
import { getLessonDistribution } from '@/features/progress/api/progress.api';

const { Text, Title } = Typography;

export const DashboardPage = () => {
	const { message } = App.useApp();
	const navigate = useNavigate();

	const user = useAuthStore((s) => s.user);

	const { data: courses, isLoading, isError } = useCourses();
	const { data: progress } = useProgress();
	const nextRecommendation = useNextRecommendation();
	const weakLessons = useWeakLessons();
	const claimDailyReward = useClaimDailyReward();

	if (isLoading) {
		return <Spin style={{ marginTop: 48, marginLeft: 24 }} />;
	}

	if (isError) {
		return (
			<Alert
				style={{ margin: 24 }}
				type='error'
				message='Не удалось загрузить курсы'
			/>
		);
	}

	const xp = progress?.xp ?? 0;
	const level = Math.floor(xp / 100) + 1;
	const percent = xp % 100;

	const lessonDistribution = getLessonDistribution(progress);

	const completedPercent = lessonDistribution.total
		? (lessonDistribution.completed / lessonDistribution.total) * 100
		: 0;

	const startedPercent = lessonDistribution.total
		? (lessonDistribution.startedNotCompleted / lessonDistribution.total) * 100
		: 0;

	const notStartedPercent = Math.max(
		0,
		100 - completedPercent - startedPercent,
	);

	return (
		<div style={{ width: '100%' }}>
			<PageHeader
				title={`Привет, ${user?.nickname ?? 'ученик'}!`}
				subtitle={`Уровень ${level}`}
				rightSlot={<Tag color='processing'>{xp} XP</Tag>}
			/>

			<Row gutter={[16, 16]} style={{ padding: 24 }}>
				{/* LEFT */}
				<Col xs={24} lg={16}>
					{/* LEVEL BLOCK */}
					<BaseCard
						style={{
							marginBottom: 20,
							background:
								'linear-gradient(135deg, #FFFDF5 0%, #F8FFA1 52%, #F6D8EE 100%)',
						}}
					>
						<Row justify='space-between' align='middle'>
							<div>
								<Text style={{ color: palette.textSecondary }}>
									Твой уровень
								</Text>

								<Title level={2} style={{ margin: 0 }}>
									{level}
								</Title>

								<Text>До следующего уровня: {100 - percent} XP</Text>
							</div>

							<Tag style={{ fontSize: 16 }}>{xp} XP</Tag>
						</Row>

						<Progress
							percent={percent}
							showInfo={false}
							style={{ marginTop: 12 }}
						/>
					</BaseCard>

					{/* PROGRESS */}
					<BaseCard style={{ marginBottom: 20 }}>
						<Text>Прогресс по урокам</Text>

						<div
							style={{
								height: 14,
								borderRadius: 999,
								overflow: 'hidden',
								display: 'flex',
								marginTop: 8,
								background: '#f2f4fb',
							}}
						>
							<div
								style={{
									width: `${completedPercent}%`,
									background: '#7AC77A',
								}}
							/>
							<div
								style={{
									width: `${startedPercent}%`,
									background: '#F6D8AA',
								}}
							/>
							<div
								style={{
									width: `${notStartedPercent}%`,
									background: '#D8DEF5',
								}}
							/>
						</div>
					</BaseCard>

					{/* ACTIONS */}
					<Row gutter={[12, 12]} style={{ marginBottom: 20 }}>
						{/* RECOMMENDATION */}
						<Col xs={24} md={12}>
							<BaseCard>
								<Text strong>Рекомендованный урок:</Text>

								{nextRecommendation.isLoading && <Spin size='small' />}

								{!!nextRecommendation.data?.lesson_id && (
									<Button
										type='link'
										onClick={() =>
											navigate(
												`/student/lessons/${nextRecommendation.data.lesson_id}`,
											)
										}
									>
										{nextRecommendation.data.title ??
											`Урок #${nextRecommendation.data.lesson_id}`}
									</Button>
								)}
							</BaseCard>
						</Col>

						{/* DAILY REWARD */}
						<Col xs={24} md={12}>
							<BaseCard>
								<Text strong>Ежедневная награда</Text>

								<Button
									type='primary'
									loading={claimDailyReward.isPending}
									onClick={() => {
										claimDailyReward.mutate(undefined, {
											onSuccess: () => message.success('Награда получена'),
											onError: () => message.error('Ошибка получения награды'),
										});
									}}
									style={{ marginTop: 8 }}
								>
									Получить
								</Button>
							</BaseCard>
						</Col>
					</Row>

					{/* WEAK LESSONS */}
					<Title level={4}>Слабые места</Title>

					<Row gutter={[12, 12]}>
						{(weakLessons.data ?? []).map((item) => (
							<Col xs={24} md={12} lg={8} key={item.lesson_id}>
								<BaseCard size='small'>
									<Text strong>
										{item.lesson_title || `Урок #${item.lesson_id}`}
									</Text>

									<div style={{ marginTop: 6 }}>
										<Tag color='error'>Ошибок: {item.wrong_attempts}</Tag>
									</div>

									<Button
										type='link'
										onClick={() =>
											navigate(`/student/lessons/${item.lesson_id}`)
										}
									>
										Перейти
									</Button>
								</BaseCard>
							</Col>
						))}
					</Row>

					{/* COURSES */}
					<Title level={4} style={{ marginTop: 20 }}>
						Курсы
					</Title>

					<Row gutter={[16, 16]}>
						{(courses ?? []).map((course: CoursePreview) => (
							<Col key={course.id} xs={24} md={12} lg={8}>
								<BaseCard
									hoverable
									onClick={() => navigate(`/student/courses/${course.id}`)}
								>
									<Title level={4}>{course.title}</Title>

									<Markdown content={course.description} />
								</BaseCard>
							</Col>
						))}
					</Row>
				</Col>

				{/* CHAT */}
				<Col xs={24} lg={8}>
					<div style={{ height: 400 }}>
						<ChatWidget />
					</div>
				</Col>
			</Row>
		</div>
	);
};

