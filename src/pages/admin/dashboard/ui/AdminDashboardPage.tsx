import { Card, Col, Row, Spin, Tag, Typography } from 'antd';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '@/shared/ui/layout/PageHeader';
import { palette } from '@/shared/config/theme';
import { usePendingCodeAttempts } from '@/features/admin/review/api/usePendingCodeAttempts';

const { Text } = Typography;

export const AdminDashboardPage = () => {
	const navigate = useNavigate();
	const pending = usePendingCodeAttempts();

	return (
		<div>
			<PageHeader
				title='Дашборд администратора'
				subtitle='Управление курсами и проверка решений по коду'
				rightSlot={
					pending.isLoading ? <Spin size='small' /> : <Tag color='processing'>{pending.data?.length ?? 0} на проверке</Tag>
				}
			/>

			<div style={{ padding: 24 }}>
				<Row gutter={[16, 16]}>
					<Col xs={24} md={12}>
						<Card
							hoverable
							style={{ borderColor: palette.pink }}
							onClick={() => navigate('/admin/courses')}
						>
							<Text strong style={{ fontSize: 18, color: palette.navy }}>
								Управление курсами
							</Text>
							<div style={{ color: palette.textSecondary, marginTop: 8 }}>
								Создание и редактирование курсов, модулей, уроков и заданий
							</div>
						</Card>
					</Col>
					<Col xs={24} md={12}>
						<Card
							hoverable
							style={{ borderColor: palette.pink }}
							onClick={() => navigate('/admin/profile')}
						>
							<Text strong style={{ fontSize: 18, color: palette.navy }}>
								Проверка кода
							</Text>
							<div style={{ color: palette.textSecondary, marginTop: 8 }}>
								Проверяйте кодовые решения и отмечайте верно/неверно
							</div>
						</Card>
					</Col>
				</Row>
			</div>
		</div>
	);
};
