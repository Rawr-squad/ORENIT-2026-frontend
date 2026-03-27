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
import {
	RightOutlined,
	GiftOutlined,
	BulbOutlined,
	WarningOutlined,
} from '@ant-design/icons';
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

	if (isLoading) return <Spin style={{ marginTop: 48, marginLeft: 24 }} />;
	if (isError)
		return (
			<Alert
				style={{ margin: 24 }}
				type='error'
				message='Не удалось загрузить курсы'
			/>
		);

	const xp = progress?.xp ?? 0;
	const coins = user?.coins ?? progress?.coins ?? 0;
	const level = Math.floor(xp / 100) + 1;
	const xpInLevel = xp % 100;
	const taskDist = getTaskDistribution(progress);
	const taskPercent = taskDist.total
		? Math.round((taskDist.completed / taskDist.total) * 100)
		: 0;

	const nextLessonId = nextRecommendation.data?.lesson_id;
	const nextLessonTitle = nextRecommendation.data?.title;

	return (
		<div>
			<PageHeader
				title={`Привет, ${user?.nickname ?? 'ученик'}!`}
				subtitle={`Уровень ${level}`}
				rightSlot={
					<Tag color='processing' style={{ fontSize: 14, padding: '4px 12px' }}>
						{xp} XP
					</Tag>
				}
			/>

			<div style={{ padding: 24 }}>
				<Row gutter={[16, 16]}>
					{/* Прогресс-карточка */}
					<Col xs={24} lg={16}>
						<Card
							style={{
								borderColor: palette.pink,
								background:
									'linear-gradient(135deg, #FFFDF5 0%, #F8FFA1 52%, #F6D8EE 100%)',
							}}
						>
							<Row gutter={[16, 16]} align='middle'>
								<Col flex='1 1 auto'>
									<div style={{ marginBottom: 4 }}>
										<Text strong style={{ color: palette.navy, fontSize: 16 }}>
											Уровень {level}
										</Text>
										<Text
											style={{ color: palette.textSecondary, marginLeft: 8 }}
										>
											{xpInLevel}/100 XP до следующего
										</Text>
									</div>
									<Progress
										percent={xpInLevel}
										showInfo={false}
										strokeColor={palette.purple}
										style={{ marginBottom: 16 }}
									/>

									<div style={{ marginBottom: 6 }}>
										<Text
											style={{ color: palette.textSecondary, fontSize: 13 }}
										>
											Задания: {taskDist.completed} из {taskDist.total}{' '}
											выполнено
										</Text>
									</div>
									<div
										style={{
											height: 10,
											borderRadius: 999,
											overflow: 'hidden',
											display: 'flex',
											background: '#e8ecf5',
										}}
									>
										<div
											style={{
												width: `${taskDist.total ? (taskDist.completed / taskDist.total) * 100 : 0}%`,
												background: '#7AC77A',
												transition: 'width 0.4s ease',
											}}
										/>
										<div
											style={{
												width: `${taskDist.total ? (taskDist.startedNotCompleted / taskDist.total) * 100 : 0}%`,
												background: '#F6D8AA',
												transition: 'width 0.4s ease',
											}}
										/>
									</div>
									<Row gutter={16} style={{ marginTop: 8 }}>
										<Col>
											<Text style={{ color: '#4D8D4D', fontSize: 12 }}>
												✓ Выполнено: {taskDist.completed}
											</Text>
										</Col>
										<Col>
											<Text style={{ color: '#A36C2B', fontSize: 12 }}>
												○ В процессе: {taskDist.startedNotCompleted}
											</Text>
										</Col>
										<Col>
											<Text style={{ color: '#6E7A9F', fontSize: 12 }}>
												– Не начато: {taskDist.notStarted}
											</Text>
										</Col>
									</Row>
								</Col>

								<Col>
									<Button
										type='primary'
										size='large'
										icon={<RightOutlined />}
										style={{ color: palette.navy, fontWeight: 700 }}
										onClick={() => {
											if (nextLessonId) {
												navigate(`/student/lessons/${nextLessonId}`);
											} else if ((courses ?? []).length > 0) {
												navigate(`/student/courses/${courses![0].id}`);
											}
										}}
									>
										Продолжить
									</Button>
								</Col>
							</Row>
						</Card>
					</Col>

					{/* Ежедневная награда */}
					<Col xs={24} lg={8}>
						<Card
							style={{ borderColor: palette.pink, height: '100%' }}
							styles={{
								body: {
									height: '100%',
									display: 'flex',
									flexDirection: 'column',
									justifyContent: 'space-between',
								},
							}}
						>
							<div>
								<div
									style={{
										display: 'flex',
										alignItems: 'center',
										gap: 8,
										marginBottom: 8,
									}}
								>
									<GiftOutlined
										style={{ fontSize: 20, color: palette.purple }}
									/>
									<Text strong style={{ color: palette.navy, fontSize: 15 }}>
										Ежедневная награда
									</Text>
								</div>
								<Text style={{ color: palette.textSecondary, fontSize: 13 }}>
									Заходи каждый день и получай монеты и XP
								</Text>
							</div>
							<div
								style={{
									marginTop: 16,
									display: 'flex',
									alignItems: 'center',
									gap: 12,
								}}
							>
								<Button
									type='primary'
									loading={claimDailyReward.isPending}
									style={{ color: palette.navy, fontWeight: 700 }}
									onClick={() => {
										claimDailyReward.mutate(undefined, {
											onSuccess: (res) => message.success(res.message),
											onError: () =>
												message.error('Не удалось получить награду'),
										});
									}}
								>
									Получить
								</Button>
								<Tag color='gold'>{coins} монет</Tag>
							</div>
						</Card>
					</Col>
				</Row>

				{/* Рекомендация и слабые уроки */}
				<Row gutter={[16, 16]} style={{ marginTop: 16 }}>
					<Col xs={24} md={12}>
						<Card
							style={{ borderColor: palette.borderAlt }}
							styles={{ body: { padding: 16 } }}
						>
							<div
								style={{
									display: 'flex',
									alignItems: 'center',
									gap: 8,
									marginBottom: 10,
								}}
							>
								<BulbOutlined style={{ fontSize: 18, color: palette.purple }} />
								<Text strong style={{ color: palette.navy }}>
									Рекомендованный урок
								</Text>
							</div>
							{nextRecommendation.isLoading && <Spin size='small' />}
							{!nextRecommendation.isLoading && !nextLessonId && (
								<Text style={{ color: palette.textSecondary }}>
									Нет персональной рекомендации
								</Text>
							)}
							{nextLessonId && (
								<div
									style={{
										display: 'flex',
										justifyContent: 'space-between',
										alignItems: 'center',
										gap: 8,
									}}
								>
									<Text style={{ color: palette.navy }}>
										{nextLessonTitle ?? `Урок #${nextLessonId}`}
									</Text>
									<Button
										type='link'
										style={{ padding: 0, flexShrink: 0 }}
										onClick={() => navigate(`/student/lessons/${nextLessonId}`)}
									>
										Перейти →
									</Button>
								</div>
							)}
						</Card>
					</Col>

					<Col xs={24} md={12}>
						<Card
							style={{ borderColor: palette.borderAlt }}
							styles={{ body: { padding: 16 } }}
						>
							<div
								style={{
									display: 'flex',
									alignItems: 'center',
									gap: 8,
									marginBottom: 10,
								}}
							>
								<WarningOutlined style={{ fontSize: 18, color: '#F97373' }} />
								<Text strong style={{ color: palette.navy }}>
									Нужно подтянуть
								</Text>
							</div>
							{weakLessons.isLoading && <Spin size='small' />}
							{!weakLessons.isLoading &&
								(weakLessons.data ?? []).length === 0 && (
									<Text style={{ color: palette.textSecondary }}>
										Слабых тем не найдено 🎉
									</Text>
								)}
							<Row gutter={[8, 8]}>
								{(weakLessons.data ?? []).slice(0, 4).map((item) => (
									<Col xs={24} key={item.lesson_id}>
										<div
											style={{
												display: 'flex',
												justifyContent: 'space-between',
												alignItems: 'center',
											}}
										>
											<Text
												style={{
													color: palette.navy,
													fontSize: 13,
													flex: 1,
													marginRight: 8,
												}}
												ellipsis
											>
												{item.lesson_title ?? `Урок #${item.lesson_id}`}
											</Text>
											<div
												style={{
													display: 'flex',
													gap: 4,
													alignItems: 'center',
													flexShrink: 0,
												}}
											>
												{typeof item.wrong_attempts === 'number' && (
													<Tag
														color='error'
														style={{ fontSize: 11, margin: 0 }}
													>
														{item.wrong_attempts} ошибок
													</Tag>
												)}
												<Button
													type='link'
													size='small'
													style={{ padding: 0 }}
													onClick={() =>
														navigate(`/student/lessons/${item.lesson_id}`)
													}
												>
													→
												</Button>
											</div>
										</div>
									</Col>
								))}
							</Row>
						</Card>
					</Col>
				</Row>

				{/* Курсы */}
				<div style={{ marginTop: 24 }}>
					<Title level={4} style={{ color: palette.navy, marginBottom: 16 }}>
						Курсы
					</Title>
					{(courses ?? []).length === 0 && (
						<Empty description='Курсы пока отсутствуют' />
					)}
					<Row gutter={[16, 16]}>
						{(courses ?? []).map((course: CoursePreview) => (
							<Col key={course.id} xs={24} md={12} lg={8}>
								<Card
									hoverable
									style={{ borderColor: palette.pink, minHeight: 160 }}
									onClick={() => navigate(`/student/courses/${course.id}`)}
								>
									<Title
										level={4}
										style={{ color: palette.navy, marginBottom: 8 }}
									>
										{course.title}
									</Title>
									<div style={{ color: palette.textSecondary }}>
										<Markdown
											content={course.description || 'Описание отсутствует.'}
										/>
									</div>
								</Card>
							</Col>
						))}
					</Row>
				</div>
			</div>
		</div>
	);
};
