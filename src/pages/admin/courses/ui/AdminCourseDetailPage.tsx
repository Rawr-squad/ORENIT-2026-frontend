import { Button, Card, Typography } from 'antd';
import { useParams } from 'react-router-dom';
import { useState } from 'react';
import { CreateModuleModal } from '@/features/admin/module/ui/CreateModuleModal';

const { Title } = Typography;

export const AdminCourseDetailPage = () => {
	const { id } = useParams();
	const courseId = Number(id);

	const [open, setOpen] = useState(false);

	// ❗ пока MOCK
	const modules = [
		{ id: 1, title: 'Введение' },
		{ id: 2, title: 'Основы' },
	];

	return (
		<div style={{ padding: 24 }}>
			<Title level={2}>Курс #{courseId}</Title>

			<Button
				type='primary'
				onClick={() => setOpen(true)}
				style={{ marginBottom: 16 }}
			>
				Добавить модуль
			</Button>

			{modules.map((m) => (
				<Card key={m.id} style={{ marginBottom: 12 }}>
					{m.title}
				</Card>
			))}

			<CreateModuleModal
				open={open}
				onClose={() => setOpen(false)}
				courseId={courseId}
			/>
		</div>
	);
};
