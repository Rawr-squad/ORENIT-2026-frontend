import { Typography, Spin, Alert, Divider } from 'antd';
import { useParams } from 'react-router-dom';

import { useLesson } from '@/entities/lesson/api/useLesson';
import { TaskRenderer } from '@/features/task/ui/TaskRenderer';

const { Title } = Typography;

export const LessonPage = () => {
	const { id } = useParams();
	const lessonId = Number(id);

	const { data: lesson, isLoading, isError } = useLesson(lessonId);

	if (isLoading) return <Spin style={{ marginTop: 40 }} />;

	if (isError || !lesson) {
		return <Alert type='error' message='Ошибка загрузки урока' />;
	}

	return (
		<div style={{ padding: 24 }}>
			<Title level={2}>{lesson.title}</Title>

			{/* THEORY */}
			<div
				style={{ marginBottom: 24 }}
				dangerouslySetInnerHTML={{
					__html: lesson.theory_content,
				}}
			/>

			<Divider />

			{/* TASKS */}
			<Title level={4}>Задания</Title>

			{(lesson.tasks ?? []).map((task) => (
				<div key={task.id} style={{ marginBottom: 16 }}>
					<TaskRenderer task={task} />
				</div>
			))}
		</div>
	);
};
