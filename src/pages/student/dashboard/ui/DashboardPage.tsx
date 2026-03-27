import { Card, List, Typography } from 'antd';
import { useNavigate } from 'react-router-dom';
import type { Course } from '@/entities/course/model/course.types';
import { XPDisplay } from '@/widgets/progress/ui/XPDisplay';
import { useProgress } from '@/features/progress/api/useProgress';
import { LeaderboardTable } from '@/widgets/leaderboard/ui/LeaderBoardTable';

const { Title } = Typography;

export const DashboardPage = () => {
	const navigate = useNavigate();

	useProgress();

	//  MOCK
	const courses: Course[] = [
		{
			id: 1,
			title: 'React Basics',
			description: 'Основы React',
			modules: [],
		},
		{
			id: 2,
			title: 'JavaScript',
			description: 'Продвинутый JS',
			modules: [],
		},
	];

	/*
  //  REAL
  const { data: courses } = useCourses();
  */

	return (
		<div style={{ padding: 24 }}>
			<XPDisplay />

			<LeaderboardTable />

			<Title level={2}>Мои курсы</Title>

			<List<Course>
				grid={{ gutter: 16, column: 3 }}
				dataSource={courses}
				renderItem={(course) => (
					<List.Item>
						<Card
							title={course.title}
							hoverable
							onClick={() => navigate(`/courses/${course.id}`)}
						>
							{course.description}
						</Card>
					</List.Item>
				)}
			/>
		</div>
	);
};
