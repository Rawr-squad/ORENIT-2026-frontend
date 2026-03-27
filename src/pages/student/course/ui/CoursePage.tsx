import { useParams } from 'react-router-dom';
import { Card, List, Typography } from 'antd';
import type { Module } from '@/entities/course/model/course.types';

import { useNavigate } from 'react-router-dom';
import { useCourse } from '@/features/course/api/useCourse';

const { Title } = Typography;

export const CoursePage = () => {
	const navigate = useNavigate();

	const { id } = useParams<{ id: string }>();

	const courseId = Number(id);

	const { data: course, isLoading } = useCourse(courseId);

	if (isLoading || !course) return <div>Загрузка...</div>;

	return (
		<div style={{ padding: 24 }}>
			<Title level={2}>{course.title}</Title>
			<p>{course.description}</p>

			{course.modules.map((module: Module) => (
				<Card key={module.id} title={module.title} style={{ marginBottom: 16 }}>
					<List
						dataSource={module.lessons}
						renderItem={(lesson) => (
							<List.Item
								style={{ cursor: 'pointer' }}
								onClick={() => navigate(`/lessons/${lesson.id}`)}
							>
								{lesson.title}
							</List.Item>
						)}
					/>
				</Card>
			))}
		</div>
	);
};
