import { useParams } from 'react-router-dom';
import { Card, List, Typography } from 'antd';
import type { CourseFull } from '@/entities/course/model/course.types';

import { useNavigate } from 'react-router-dom';

const { Title } = Typography;

export const CoursePage = () => {
	const navigate = useNavigate();

	const { id } = useParams<{ id: string }>();

	//  MOCK
	const course: CourseFull = {
		id: Number(id),
		title: 'React Basics',
		description: 'Основы React',
		modules: [
			{
				id: 1,
				title: 'Введение',
				lessons: [
					{ id: 1, title: 'Что такое React' },
					{ id: 2, title: 'JSX' },
				],
			},
			{
				id: 2,
				title: 'Хуки',
				lessons: [
					{ id: 3, title: 'useState' },
					{ id: 4, title: 'useEffect' },
				],
			},
		],
	};

	/*
  //  REAL
  const { data: course } = useCourse(id);
  */

	return (
		<div style={{ padding: 24 }}>
			<Title level={2}>{course.title}</Title>
			<p>{course.description}</p>

			{course.modules.map((module) => (
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
