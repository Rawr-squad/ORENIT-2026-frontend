import {
	Alert,
	App,
	Button,
	Card,
	Col,
	Empty,
	Progress,
	Row,
	Spin,
	Tag,
	Typography,
} from 'antd';
import { useNavigate } from 'react-router-dom';
import { useCourses } from '@/features/course/api/useCourses';
import { useProgress } from '@/features/progress/api/useProgress';
import { getTaskDistribution } from '@/features/progress/api/progress.types';
import { useNextRecommendation } from '@/features/recommendation/api/useNextRecommendation';
import { useWeakLessons } from '@/features/analytics/api/useWeakLessons';
import { useClaimDailyReward } from '@/features/reward/api/useClaimDailyReward';
import { useAuthStore } from '@/entities/user/model/auth.store';
import { PageHeader } from '@/shared/ui/layout/PageHeader';
import { Markdown } from '@/shared/ui/Markdown';
import { palette } from '@/shared/config/theme';
import type { CoursePreview } from '@/entities/course/model/course.types';

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
		return <Alert style={{ margin: 24 }} type='error' message='Не удалось загрузить курсы' />;
	}

	const xp = progress?.xp ?? 0;
	const level = Math.floor(xp / 100) + 1;
	const percent = xp % 100;
	const taskDistribution = getTaskDistribution(progress);
	const completedPercent = taskDistribution.total
		? (taskDistribution.completed / taskDistribution.total) * 100
		: 0;
	const startedPercent = taskDistribution.total
		? (taskDistribution.startedNotCompleted / taskDistribution.total) * 100
		: 0;
	const notStartedPercent = Math.max(0, 100 - completedPercent - startedPercent);

	return (
		<div>
			<PageHeader
				title={`Привет, ${user?.nickname ?? 'ученик'}!`}
				subtitle={`Уровень ${level} • до следующего уровня ${100 - percent} XP`}
				rightSlot={<Tag color='processing'>{xp} XP</Tag>}
			/>

			<div style={{ padding: 24 }}>
				<Card
					style={{
						marginBottom: 20,
						borderColor: palette.pink,
						background:
							'linear-gradient(135deg, #FFFDF5 0%, #F8FFA1 52%, #F6D8EE 100%)',
					}}
				>
					<Row align='middle' justify='space-between' gutter={[16, 16]}>
						<Col flex='1 1 auto'>
							<Text style={{ color: palette.textSecondary }}>Твой учебный путь</Text>
							<Title level={3} style={{ margin: '6px 0', color: palette.navy }}>
								Обучение в процессе
							</Title>
							<Progress percent={percent} showInfo={false} strokeColor={palette.purple} />
							<div style={{ marginTop: 12 }}>
								<Text style={{ color: palette.textSecondary }}>Прогресс по заданиям</Text>
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
									<div style={{ width: `${completedPercent}%`, background: '#7AC77A' }} />
									<div style={{ width: `${startedPercent}%`, background: '#F6D8AA' }} />
									<div style={{ width: `${notStartedPercent}%`, background: '#D8DEF5' }} />
								</div>
								<Row gutter={12} style={{ marginTop: 8 }}>
									<Col>
										<Text style={{ color: '#4D8D4D', fontSize: 13 }}>
											Выполнено: {taskDistribution.completed}
										</Text>
									</Col>
									<Col>
										<Text style={{ color: '#A36C2B', fontSize: 13 }}>
											Начато: {taskDistribution.startedNotCompleted}
										</Text>
									</Col>
									<Col>
										<Text style={{ color: '#6E7A9F', fontSize: 13 }}>
											Не начато: {taskDistribution.notStarted}
										</Text>
									</Col>
								</Row>
							</div>
						</Col>
						<Col>
							<Button
								type='primary'
								style={{ color: palette.navy, fontWeight: 700 }}
								onClick={() => {
									const lessonId = nextRecommendation.data?.lesson_id;
									if (lessonId) {
										navigate(`/student/lessons/${lessonId}`);
										return;
									}

									const firstCourseId = courses?.[0]?.id;
									if (firstCourseId) {
										navigate(`/student/courses/${firstCourseId}`);
									}
								}}
							>
								Продолжить обучение
							</Button>
						</Col>
					</Row>

					<Row gutter={[12, 12]} style={{ marginTop: 14 }}>
						<Col xs={24} md={12}>
							<Card size='small' style={{ borderColor: palette.borderSoft }}>
								<Text strong style={{ color: palette.navy }}>
									Рекомендованный следующий урок
								</Text>
								<div style={{ marginTop: 6, color: palette.textSecondary }}>
									{nextRecommendation.data?.title
										? nextRecommendation.data.title
										: 'Пока нет персональной рекомендации'}
								</div>
							</Card>
						</Col>
						<Col xs={24} md={12}>
							<Card size='small' style={{ borderColor: palette.borderSoft }}>
								<Text strong style={{ color: palette.navy }}>
									Ежедневная награда
								</Text>
								<div style={{ marginTop: 8 }}>
									<Button
										type='primary'
										loading={claimDailyReward.isPending}
										onClick={() => {
											claimDailyReward.mutate(undefined, {
												onSuccess: (res) => {
													message.success(res.message);
												},
												onError: () => {
													message.error('Не удалось получить ежедневную награду');
												},
											});
										}}
										style={{ color: palette.navy, fontWeight: 700 }}
									>
										Получить награду
									</Button>
								</div>
							</Card>
						</Col>
					</Row>
				</Card>

				<Card style={{ marginBottom: 20, borderColor: palette.pink }}>
					<Title level={4} style={{ color: palette.navy, marginTop: 0 }}>
						Уроки, где нужно подтянуться
					</Title>
					{weakLessons.isLoading && <Spin size='small' />}
					{!weakLessons.isLoading && (weakLessons.data ?? []).length === 0 && (
						<Empty description='Слабых тем не найдено' />
					)}
					<Row gutter={[12, 12]}>
						{(weakLessons.data ?? []).slice(0, 6).map((item) => (
							<Col xs={24} md={12} lg={8} key={item.lesson_id}>
								<Card size='small' style={{ borderColor: palette.borderSoft }}>
									<Text strong style={{ color: palette.navy }}>
										{item.lesson_title || `Урок #${item.lesson_id}`}
									</Text>
									<div style={{ marginTop: 6 }}>
										{typeof item.wrong_attempts === 'number' && (
											<Tag color='error'>Ошибок: {item.wrong_attempts}</Tag>
										)}
										{typeof item.attempts === 'number' && (
											<Tag>Попыток: {item.attempts}</Tag>
										)}
									</div>
									<Button
										type='link'
										style={{ padding: 0, marginTop: 8 }}
										onClick={() => navigate(`/student/lessons/${item.lesson_id}`)}
									>
										Перейти к уроку
									</Button>
								</Card>
							</Col>
						))}
					</Row>
				</Card>

				<Title level={4} style={{ color: palette.navy }}>
					Курсы
				</Title>

				{(courses ?? []).length === 0 && <Empty description='Курсы пока отсутствуют' />}
				<Row gutter={[16, 16]}>
					{(courses ?? []).map((course: CoursePreview) => (
						<Col key={course.id} xs={24} md={12} lg={8}>
							<Card
								hoverable
								style={{ borderColor: palette.pink, minHeight: 260 }}
								onClick={() => navigate(`/student/courses/${course.id}`)}
							>
								<Title level={4} style={{ color: palette.navy, marginBottom: 10 }}>
									{course.title}
								</Title>
								<div style={{ color: palette.textSecondary }}>
									<Markdown content={course.description || 'Описание курса отсутствует.'} />
								</div>
							</Card>
						</Col>
					))}
				</Row>
			</div>
		</div>
	);
};
