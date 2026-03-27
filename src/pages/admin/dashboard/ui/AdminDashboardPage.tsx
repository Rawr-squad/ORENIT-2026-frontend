import { Card, Typography } from 'antd';
import { useNavigate } from 'react-router-dom';

const { Title } = Typography;

export const AdminDashboardPage = () => {
	const navigate = useNavigate();

	return (
		<div style={{ padding: 24 }}>
			<Title level={2}>Admin Panel</Title>

			<div style={{ display: 'flex', gap: 16 }}>
				<Card hoverable onClick={() => navigate('/admin/courses')}>
					Курсы
				</Card>

				<Card hoverable>Уроки</Card>

				<Card hoverable>Задания</Card>
			</div>
		</div>
	);
};
