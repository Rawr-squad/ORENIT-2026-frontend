import { Card, Typography, Spin, Alert, Row, Col, Empty } from 'antd';
import { useNavigate } from 'react-router-dom';

import type { CoursePreview } from '@/entities/course/model/course.types';
import { useCourses } from '@/features/course/api/useCourses';
import { XPDisplay } from '@/widgets/progress/ui/XPDisplay';

const { Title, Paragraph } = Typography;

export const DashboardPage = () => {
	const navigate = useNavigate();

	const { data: courses, isLoading, isError } = useCourses();

	if (isLoading) return <Spin style={{ marginTop: 40 }} />;

	if (isError || !courses) {
		return <Alert type='error' title='Ошибка загрузки курсов' />;
	}

	return (
		<div style={{ padding: 24 }}>
			<XPDisplay />

			<Title level={2}>Курсы</Title>

			{courses.length === 0 && <Empty description='Нет курсов' />}
			{courses.length !== 0 && (
				<Row gutter={[16, 16]}>
					{courses.map((course: CoursePreview) => (
						<Col xs={24} md={12} lg={8} key={course.id}>
							<Card hoverable onClick={() => navigate(`/courses/${course.id}`)}>
								<Title level={4}>{course.title}</Title>
								<Paragraph ellipsis={{ rows: 2 }}>
									{course.description}
								</Paragraph>
							</Card>
						</Col>
					))}
				</Row>
			)}
		</div>
	);
};
