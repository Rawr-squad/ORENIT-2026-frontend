import { Alert, Progress, Skeleton, Tag, Typography } from 'antd';
import { useProgress } from '@/features/progress/api/useProgress';
import { BaseCard } from '@/shared/ui/card/BaseCard';
import { palette } from '@/shared/config/theme';
import { getLessonDistribution } from '@/features/progress/api/progress.api';

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
			<div style={{ marginBottom: 20 }}>
				<Title level={2} style={{ color: palette.navy }}>
					Прогресс ребенка
				</Title>

				<Text
					style={{
						color: data.nickname_color ?? palette.navy,
						fontWeight: 600,
						fontSize: 16,
					}}
				>
					{data.nickname}
				</Text>

				<div style={{ marginTop: 6 }}>
					<Tag>{data.status}</Tag>
				</div>
			</div>

			{/* ПРОГРЕСС */}
			<BaseCard style={{ marginBottom: 20 }}>
				<Text style={{ color: palette.textSecondary }}>
					Общий прогресс обучения
				</Text>

				<Progress percent={percent} />

				<div style={{ marginTop: 12 }}>
					<Tag color='green'>Пройдено: {distribution.completed}</Tag>
					<Tag color='orange'>
						В процессе: {distribution.startedNotCompleted}
					</Tag>
					<Tag>Не начато: {distribution.notStarted}</Tag>
				</div>
			</BaseCard>

			{/* СТАТИСТИКА */}
			<BaseCard>
				<Title level={4} style={{ color: palette.navy }}>
					Статистика
				</Title>

				<div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
					<Tag color='processing'>{data.xp} XP</Tag>
					<Tag color='gold'>{data.coins} coins</Tag>
				</div>
			</BaseCard>
		</div>
	);
};

