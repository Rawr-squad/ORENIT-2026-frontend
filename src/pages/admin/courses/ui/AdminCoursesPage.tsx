import { Table, Button, Typography } from 'antd';
import { useCoursesAdmin } from '@/features/admin/course/api/useCoursesAdmin';
import { CreateCourseModal } from '@/features/admin/course/ui/CreateCourseModal';
import { useState } from 'react';

const { Title } = Typography;

export const AdminCoursesPage = () => {
	const [open, setOpen] = useState(false);

	const { data, isLoading } = useCoursesAdmin();

	const columns = [
		{
			title: 'ID',
			dataIndex: 'id',
		},
		{
			title: 'Название',
			dataIndex: 'title',
		},
		{
			title: 'Описание',
			dataIndex: 'description',
		},
	];

	return (
		<div style={{ padding: 24 }}>
			<Title level={2}>Курсы</Title>

			<Button
				type='primary'
				onClick={() => setOpen(true)}
				style={{ marginBottom: 16 }}
			>
				Создать курс
			</Button>
			<CreateCourseModal open={open} onClose={() => setOpen(false)} />

			<Table
				rowKey='id'
				loading={isLoading}
				dataSource={data}
				columns={columns}
			/>
		</div>
	);
};
