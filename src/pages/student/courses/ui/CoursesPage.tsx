import { Alert, Col, Empty, Row, Spin, Typography } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useCourses } from '@/features/course/api/useCourses';
import { PageHeader } from '@/shared/ui/layout/PageHeader';
import { Markdown } from '@/shared/ui/Markdown';
import type { CoursePreview } from '@/entities/course/model/course.types';
import { palette } from '@/shared/config/theme';
import { BaseCard } from '@/shared/ui/card/BaseCard';

const { Title } = Typography;

export const CoursesPage = () => {
	const navigate = useNavigate();
	const { data, isLoading, isError } = useCourses();

	if (isLoading) {
		return <Spin style={{ marginTop: 48, marginLeft: 24 }} />;
	}

	if (isError) {
		return (
			<Alert
				style={{ margin: 24 }}
				type='error'
				message='Не удалось загрузить курсы'
			/>
		);
	}

	return (
		<div>
			<PageHeader
				title='Все курсы'
				subtitle='Выберите курс и начните обучение'
			/>
			<div style={{ padding: 24 }}>
				{(data ?? []).length === 0 && (
					<Empty description='Курсы пока отсутствуют' />
				)}
				<Row gutter={[16, 16]}>
					{(data ?? []).map((course: CoursePreview) => (
						<Col key={course.id} xs={24} md={12} lg={8}>
							<BaseCard
								hoverable
								style={{ minHeight: 260 }}
								onClick={() => navigate(`/student/courses/${course.id}`)}
							>
								<Title
									level={4}
									style={{ color: palette.navy, marginBottom: 8 }}
								>
									{course.title}
								</Title>
								<div style={{ color: palette.textSecondary }}>
									<Markdown
										content={course.description || 'Описание пока отсутствует.'}
									/>
								</div>
							</BaseCard>
						</Col>
					))}
				</Row>
			</div>
		</div>
	);
};

