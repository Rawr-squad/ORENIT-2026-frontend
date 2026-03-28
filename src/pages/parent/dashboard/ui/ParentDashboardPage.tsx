import { Alert, Progress, Skeleton, Tag, Typography, Row, Col } from 'antd';
import { useProgress } from '@/features/progress/api/useProgress';
import { BaseCard } from '@/shared/ui/card/BaseCard';
import { palette } from '@/shared/config/theme';
import { getLessonDistribution } from '@/features/progress/api/progress.api';
import { PageHeader } from '@/shared/ui/layout/PageHeader';

const { Title, Text } = Typography;

export const ParentDashboardPage = () => {
	const { data, isLoading, isError } = useProgress();

	if (isLoading) {
		return <Skeleton active style={{ margin: 24 }} />;
	}

	if (isError || !data) {
		return (
			<Alert
				style={{ margin: 24 }}
				type='error'
				message='Не удалось загрузить прогресс'
			/>
		);
	}

	const distribution = getLessonDistribution(data);

	const percent = distribution.total
		? Math.floor((distribution.completed / distribution.total) * 100)
		: 0;

	return (
		<div>
			{/* HEADER */}
			<PageHeader
				title='Прогресс ребенка'
				subtitle={
					<div>
						<Text
							style={{
								color: data.nickname_color ?? palette.navy,
								fontWeight: 600,
								fontSize: 16,
							}}
						>
							{data.nickname}
						</Text>
					</div>
				}
			/>

			<div style={{ padding: 24 }}>
				<Row gutter={[16, 16]}>
					{/* ПРОГРЕСС */}
					<Col xs={24} xl={14}>
						<BaseCard
							title='Общий прогресс'
							style={{ borderColor: palette.pink }}
						>
							<Progress percent={percent} />

							<div style={{ marginTop: 12 }}>
								<Tag color='green'>Пройдено: {distribution.completed}</Tag>
								<Tag color='orange'>
									В процессе: {distribution.startedNotCompleted}
								</Tag>
								<Tag>Не начато: {distribution.notStarted}</Tag>
							</div>
						</BaseCard>
					</Col>

					{/* СТАТИСТИКА */}
					<Col xs={24} xl={10}>
						<BaseCard title='Статистика' style={{ borderColor: palette.pink }}>
							<div style={{ display: 'flex', gap: 12 }}>
								<Tag color='processing'>{data.xp} XP</Tag>
								<Tag color='gold'>{data.coins} coins</Tag>
							</div>
						</BaseCard>
					</Col>
				</Row>
			</div>
		</div>
	);
};

