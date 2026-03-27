import { Button, Card, Typography, Spin, Alert } from 'antd';
import { useParams } from 'react-router-dom';
import { useState } from 'react';

import { CreateModuleModal } from '@/features/admin/module/ui/CreateModuleModal';
import { CreateLessonModal } from '@/features/admin/lesson/ui/CreateLessonModal';

import { useModule } from '@/entities/module/api/useModule';
import { useCourse } from '@/features/course/api/useCourse';

const { Title } = Typography;

export const AdminCourseDetailPage = () => {
	const { id } = useParams();
	const courseId = Number(id);

	const [open, setOpen] = useState(false);

	const [selectedModuleId, setSelectedModuleId] = useState<number | null>(null);

	const [lessonModal, setLessonModal] = useState<{
		open: boolean;
		moduleId: number | null;
	}>({
		open: false,
		moduleId: null,
	});

	const {
		data: course,
		isLoading: isCourseLoading,
		isError: isCourseError,
	} = useCourse(courseId);

	const { data: selectedModule, isLoading: isModuleLoading } = useModule(
		selectedModuleId ?? 0,
	);

	if (isCourseLoading) return <Spin />;
	if (isCourseError || !course)
		return <Alert type='error' message='Ошибка загрузки курса' />;

	return (
		<div style={{ padding: 24 }}>
			<Title level={2}>{course.title}</Title>

			<Button
				type='primary'
				onClick={() => setOpen(true)}
				style={{ marginBottom: 16 }}
			>
				Добавить модуль
			</Button>

			{/* 🔴 СПИСОК МОДУЛЕЙ */}
			{course.modules?.map((m) => (
				<Card
					key={m.id}
					style={{ marginBottom: 12, cursor: 'pointer' }}
					onClick={() => setSelectedModuleId(m.id)}
				>
					{m.title}
				</Card>
			))}

			{/* 🔴 ВЫБРАННЫЙ МОДУЛЬ */}
			{selectedModuleId && (
				<Card style={{ marginTop: 24 }}>
					<Title level={4}>Уроки модуля</Title>

					{isModuleLoading ? (
						<Spin />
					) : (
						<>
							{(selectedModule?.lessons ?? []).map((l) => (
								<div key={l.id}>{l.title}</div>
							))}

							<Button
								style={{ marginTop: 12 }}
								onClick={() =>
									setLessonModal({
										open: true,
										moduleId: selectedModuleId,
									})
								}
							>
								Добавить урок
							</Button>
						</>
					)}
				</Card>
			)}

			<CreateModuleModal
				open={open}
				onClose={() => setOpen(false)}
				courseId={courseId}
			/>

			{lessonModal.moduleId && (
				<CreateLessonModal
					open={lessonModal.open}
					moduleId={lessonModal.moduleId}
					onClose={() => setLessonModal({ open: false, moduleId: null })}
				/>
			)}
		</div>
	);
};
