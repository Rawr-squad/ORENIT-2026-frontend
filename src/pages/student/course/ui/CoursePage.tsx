import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Alert, Button, Card, Collapse, Empty, List, Skeleton, Tag, Typography } from 'antd';
import type { Module } from '@/entities/course/model/course.types';
import { useCourse } from '@/features/course/api/useCourse';
import { useModule } from '@/entities/module/api/useModule';
import { PageHeader } from '@/shared/ui/layout/PageHeader';
import { Markdown } from '@/shared/ui/Markdown';
import { palette } from '@/shared/config/theme';

const { Text } = Typography;

const ModuleLessons = ({ moduleId }: { moduleId: number }) => {
	const navigate = useNavigate();
	const moduleQuery = useModule(moduleId);

	if (moduleQuery.isLoading) {
		return <Skeleton active paragraph={{ rows: 3 }} />;
	}

	if (moduleQuery.isError || !moduleQuery.data) {
		return <Alert type='error' message='Не удалось загрузить уроки модуля' />;
	}

	if (moduleQuery.data.lessons.length === 0) {
		return <Empty description='В этом модуле пока нет уроков' />;
	}

	return (
		<Card style={{ borderColor: palette.pink }}>
			<List
				dataSource={moduleQuery.data.lessons}
				renderItem={(lesson, lessonIndex) => (
					<List.Item
						style={{ cursor: 'pointer' }}
						onClick={() => navigate(`/student/lessons/${lesson.id}`)}
					>
						<Text style={{ color: palette.navy }}>
							{lessonIndex + 1}. {lesson.title}
						</Text>
					</List.Item>
				)}
			/>
		</Card>
	);
};

export const CoursePage = () => {
	const navigate = useNavigate();
	const { id } = useParams<{ id: string }>();
	const courseId = Number(id);
	const [activeModuleKey, setActiveModuleKey] = useState<string | null>(null);

	const { data: course, isLoading, isError } = useCourse(courseId);

	if (isLoading) {
		return <Skeleton active style={{ margin: 24 }} />;
	}

	if (isError || !course) {
		return <Alert style={{ margin: 24 }} type='error' message='Не удалось загрузить курс' />;
	}

	return (
		<div>
			<PageHeader
				title={course.title}
				subtitle='Обзор курса и модулей'
				rightSlot={
					<Button onClick={() => navigate('/student/courses')}>К списку курсов</Button>
				}
			/>
			<div style={{ padding: 24 }}>
				<Card style={{ borderColor: palette.pink, marginBottom: 16 }}>
					<Markdown content={course.description || 'Описание пока отсутствует.'} />
				</Card>
				{course.modules.length === 0 && <Empty description='В этом курсе пока нет модулей' />}
				<Collapse
					accordion
					activeKey={activeModuleKey ?? undefined}
					onChange={(key) => {
						if (Array.isArray(key)) {
							setActiveModuleKey(key[0] ?? null);
							return;
						}

						setActiveModuleKey(key || null);
					}}
					items={course.modules.map((module: Module, moduleIndex: number) => ({
						key: String(module.id),
						label: (
							<div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
								<span>
									{moduleIndex + 1}. {module.title}
								</span>
								<Tag>Нажмите, чтобы открыть уроки</Tag>
							</div>
						),
						children:
							activeModuleKey === String(module.id) ? (
								<ModuleLessons moduleId={module.id} />
							) : null,
					}))}
				/>
			</div>
		</div>
	);
};
