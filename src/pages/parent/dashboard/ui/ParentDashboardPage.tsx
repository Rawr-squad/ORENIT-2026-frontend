import { Alert, Card, Col, Row, Spin, Statistic, Typography } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useProgress } from '@/features/progress/api/useProgress';
import { PageHeader } from '@/shared/ui/layout/PageHeader';
import { palette } from '@/shared/config/theme';

const { Text } = Typography;

export const ParentDashboardPage = () => {
	const navigate = useNavigate();
	const progress = useProgress();

	if (progress.isLoading) {
		return <Spin style={{ marginTop: 48, marginLeft: 24 }} />;
	}

	if (progress.isError || !progress.data) {
		return <Alert style={{ margin: 24 }} type='error' message='Не удалось загрузить дашборд родителя' />;
	}

	return (
		<div>
			<PageHeader title='Дашборд родителя' subtitle='Краткий обзор прогресса ребенка' />
			<div style={{ padding: 24 }}>
				<Row gutter={[16, 16]}>
					<Col xs={24} md={8}>
						<Card style={{ borderColor: palette.pink }}>
							<Statistic title='XP ребенка' value={progress.data.xp} />
						</Card>
					</Col>
					<Col xs={24} md={8}>
						<Card style={{ borderColor: palette.pink }}>
							<Statistic
								title='Завершенные уроки'
								value={progress.data.completed_lessons}
							/>
						</Card>
					</Col>
					<Col xs={24} md={8}>
						<Card
							hoverable
							style={{ borderColor: palette.pink }}
							onClick={() => navigate('/parent/progress')}
						>
							<Text strong style={{ color: palette.navy }}>
								Открыть детальный прогресс
							</Text>
						</Card>
					</Col>
				</Row>
			</div>
		</div>
	);
};
