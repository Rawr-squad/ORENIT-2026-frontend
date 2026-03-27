import { Card, Col, Row, Spin, Tag, Typography } from 'antd';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '@/shared/ui/layout/PageHeader';
import { palette } from '@/shared/config/theme';
import { usePendingCodeAttempts } from '@/features/admin/review/api/usePendingCodeAttempts';

const { Text } = Typography;

type DashboardCard = {
	title: string;
	description: string;
	path: string;
	badge?: React.ReactNode;
};

export const AdminDashboardPage = () => {
	const navigate = useNavigate();
	const pending = usePendingCodeAttempts();

	const cards: DashboardCard[] = [
		{
			title: 'Управление курсами',
			description:
				'Создание и редактирование курсов, модулей, уроков и заданий',
			path: '/admin/courses',
		},
		{
			title: 'Проверка кода',
			description: 'Проверяйте кодовые решения и отмечайте верно/неверно',
			path: '/admin/profile',
			badge: pending.isLoading ? (
				<Spin size='small' />
			) : (pending.data?.length ?? 0) > 0 ? (
				<Tag color='processing'>{pending.data?.length} на проверке</Tag>
			) : undefined,
		},
		{
			title: 'Магазин',
			description: 'Создание цветов ника и кастомных подписей для учеников',
			path: '/admin/shop',
		},
		{
			title: 'Достижения',
			description: 'Создание достижений и загрузка стандартного набора',
			path: '/admin/achievements',
		},
	];

	return (
		<div>
			<PageHeader
				title='Дашборд администратора'
				subtitle='Управление курсами, магазином и достижениями'
			/>

			<div style={{ padding: 24 }}>
				<Row gutter={[16, 16]}>
					{cards.map((card) => (
						<Col xs={24} md={12} key={card.path}>
							<Card
								hoverable
								style={{ borderColor: palette.pink, minHeight: 100 }}
								onClick={() => navigate(card.path)}
							>
								<div
									style={{
										display: 'flex',
										justifyContent: 'space-between',
										alignItems: 'flex-start',
									}}
								>
									<Text strong style={{ fontSize: 18, color: palette.navy }}>
										{card.title}
									</Text>
									{card.badge}
								</div>
								<div style={{ color: palette.textSecondary, marginTop: 8 }}>
									{card.description}
								</div>
							</Card>
						</Col>
					))}
				</Row>
			</div>
		</div>
	);
};

