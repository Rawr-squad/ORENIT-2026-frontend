import { useEffect, useState } from 'react';
import {
	Alert,
	App,
	Button,
	Col,
	Empty,
	Form,
	Input,
	InputNumber,
	List,
	Modal,
	Popconfirm,
	Row,
	Select,
	Space,
	Spin,
	Tag,
	Tooltip,
	Typography,
} from 'antd';
import {
	DeleteOutlined,
	EditOutlined,
	MinusCircleOutlined,
	PlusOutlined,
} from '@ant-design/icons';
import { useParams } from 'react-router-dom';
import type {
	LessonCreate,
	ModuleCreate,
} from '@/entities/course/model/course.types';
import type { TaskCreate, TaskType } from '@/entities/task/model/task.types';
import { useCourse } from '@/features/course/api/useCourse';
import { useModule } from '@/entities/module/api/useModule';
import { useLesson } from '@/entities/lesson/api/useLesson';
import { useCreateModule } from '@/features/admin/module/api/useCreateModule';
import { useUpdateModule } from '@/features/admin/module/api/useUpdateModule';
import { useDeleteModule } from '@/features/admin/module/api/useDeleteModule';
import { useCreateLesson } from '@/features/admin/lesson/api/useCreateLesson';
import { useUpdateLesson } from '@/features/admin/lesson/api/useUpdateLesson';
import { useDeleteLesson } from '@/features/admin/lesson/api/useDeleteLesson';
import { useCreateTask } from '@/features/admin/task/api/useCreateTask';
import { useUpdateTask } from '@/features/admin/task/api/useUpdateTask';
import { useDeleteTask } from '@/features/admin/task/api/useDeleteTask';
import { PageHeader } from '@/shared/ui/layout/PageHeader';
import { MarkdownEditor } from '@/shared/ui/MarkdownEditor';
import { palette } from '@/shared/config/theme';
import { BaseCard } from '@/shared/ui/card/BaseCard';

const { Text } = Typography;

type ModuleFormValues = {
	title: string;
	order: number;
};

type LessonFormValues = {
	title: string;
	theory_content: string;
	order: number;
};

type TaskFormValues = {
	type: TaskType;
	question: string;
	coins: number;
	correct_answer?: string;
	options?: string[];
	quiz_correct_option?: string;
};

const parseQuizTaskValue = (
	correctAnswer?: string | null,
	optionsFromTask?: string[],
) => {
	let options = optionsFromTask ?? [];
	let correct = '';

	if (correctAnswer) {
		try {
			const parsed = JSON.parse(correctAnswer) as {
				options?: string[];
				correct?: string;
			};
			if (Array.isArray(parsed.options)) {
				options = parsed.options;
			}
			if (parsed.correct) {
				correct = parsed.correct;
			}
		} catch {
			correct = correctAnswer;
		}
	}

	return { options, correct };
};

export const AdminCourseDetailPage = () => {
	const { message } = App.useApp();
	const { id } = useParams();
	const courseId = Number(id);

	const { data: course, isLoading, isError } = useCourse(courseId);

	const [selectedModuleId, setSelectedModuleId] = useState<number | null>(null);
	const [selectedLessonId, setSelectedLessonId] = useState<number | null>(null);

	const [moduleForm] = Form.useForm<ModuleFormValues>();
	const [lessonForm] = Form.useForm<LessonFormValues>();
	const [taskForm] = Form.useForm<TaskFormValues>();
	const taskType = Form.useWatch('type', taskForm);

	const [moduleModal, setModuleModal] = useState<{
		open: boolean;
		editingId: number | null;
	}>({
		open: false,
		editingId: null,
	});
	const [lessonModal, setLessonModal] = useState<{
		open: boolean;
		editingId: number | null;
	}>({
		open: false,
		editingId: null,
	});
	const [taskModal, setTaskModal] = useState<{
		open: boolean;
		editingId: number | null;
	}>({
		open: false,
		editingId: null,
	});

	const { data: selectedModule, isLoading: isModuleLoading } = useModule(
		selectedModuleId ?? 0,
	);
	const { data: selectedLesson, isLoading: isLessonLoading } = useLesson(
		selectedLessonId ?? 0,
	);

	const createModule = useCreateModule();
	const updateModule = useUpdateModule();
	const deleteModule = useDeleteModule();

	const createLesson = useCreateLesson();
	const updateLesson = useUpdateLesson();
	const deleteLesson = useDeleteLesson();

	const createTask = useCreateTask();
	const updateTask = useUpdateTask();
	const deleteTask = useDeleteTask();

	const lessonTasks = selectedLesson?.tasks ?? [];
	const primaryTask = lessonTasks[0] ?? null;
	const extraTasks = lessonTasks.slice(1);
	const taskTypeLabel: Record<TaskType, string> = {
		quiz: 'Тест',
		input: 'Ввод',
		code: 'Код',
	};

	useEffect(() => {
		if (!lessonModal.open || !lessonModal.editingId) {
			return;
		}

		if (!selectedLesson || selectedLesson.id !== lessonModal.editingId) {
			return;
		}

		lessonForm.setFieldsValue({
			title: selectedLesson.title,
			theory_content: selectedLesson.theory_content ?? '',
			order: selectedLesson.order ?? 1,
		});
	}, [lessonModal.editingId, lessonModal.open, selectedLesson, lessonForm]);

	if (isLoading) {
		return <Spin style={{ marginTop: 48, marginLeft: 24 }} />;
	}

	if (isError || !course) {
		return (
			<Alert
				style={{ margin: 24 }}
				type='error'
				message='Не удалось загрузить детали курса'
			/>
		);
	}

	const openCreateModule = () => {
		moduleForm.setFieldsValue({
			title: '',
			order: (course.modules?.length ?? 0) + 1,
		});
		setModuleModal({ open: true, editingId: null });
	};

	const openEditModule = (moduleId: number, title: string, order?: number) => {
		moduleForm.setFieldsValue({ title, order: order ?? 1 });
		setModuleModal({ open: true, editingId: moduleId });
	};

	const openCreateLesson = () => {
		if (!selectedModuleId) {
			message.info('Сначала выберите модуль');
			return;
		}

		lessonForm.setFieldsValue({
			title: '',
			theory_content: '',
			order: (selectedModule?.lessons.length ?? 0) + 1,
		});
		setLessonModal({ open: true, editingId: null });
	};

	const openEditLesson = (lessonId: number, title: string, order?: number) => {
		if (selectedLessonId !== lessonId) {
			setSelectedLessonId(lessonId);
		}

		lessonForm.setFieldsValue({
			title,
			theory_content:
				selectedLesson?.id === lessonId ? selectedLesson.theory_content : '',
			order: order ?? 1,
		});
		setLessonModal({ open: true, editingId: lessonId });
	};

	const openCreateTask = () => {
		if (!selectedLessonId) {
			message.info('Сначала выберите урок');
			return;
		}

		if (primaryTask) {
			message.info(
				'В уроке допускается только одно задание. Отредактируйте уже существующее.',
			);
			return;
		}

		taskForm.setFieldsValue({
			type: 'input',
			question: '',
			coins: 5,
			correct_answer: '',
			options: ['', ''],
			quiz_correct_option: '',
		});
		setTaskModal({ open: true, editingId: null });
	};

	const openEditTask = () => {
		if (!primaryTask) {
			return;
		}

		if (primaryTask.type === 'quiz') {
			const quizData = parseQuizTaskValue(
				primaryTask.correct_answer,
				primaryTask.options,
			);
			taskForm.setFieldsValue({
				type: 'quiz',
				question: primaryTask.question,
				coins: primaryTask.coins ?? 5,
				options: quizData.options.length ? quizData.options : ['', ''],
				quiz_correct_option: quizData.correct,
			});
		} else {
			taskForm.setFieldsValue({
				type: primaryTask.type,
				question: primaryTask.question,
				coins: primaryTask.coins ?? 5,
				correct_answer: primaryTask.correct_answer ?? '',
			});
		}

		setTaskModal({ open: true, editingId: primaryTask.id });
	};

	const submitModule = (values: ModuleFormValues) => {
		const payload: ModuleCreate = {
			course_id: courseId,
			title: values.title,
			order: values.order,
		};

		if (moduleModal.editingId) {
			updateModule.mutate(
				{ id: moduleModal.editingId, data: payload },
				{ onSuccess: () => setModuleModal({ open: false, editingId: null }) },
			);
			return;
		}

		createModule.mutate(payload, {
			onSuccess: (data: unknown) => {
				const moduleId = Number((data as { id?: number })?.id);
				if (moduleId) {
					setSelectedModuleId(moduleId);
				}
				setModuleModal({ open: false, editingId: null });
			},
		});
	};

	const submitLesson = (values: LessonFormValues) => {
		if (!selectedModuleId) {
			return;
		}

		const payload: LessonCreate = {
			module_id: selectedModuleId,
			title: values.title,
			theory_content: values.theory_content,
			order: values.order,
		};

		if (lessonModal.editingId) {
			updateLesson.mutate(
				{ id: lessonModal.editingId, data: payload },
				{ onSuccess: () => setLessonModal({ open: false, editingId: null }) },
			);
			return;
		}

		createLesson.mutate(payload, {
			onSuccess: (data: unknown) => {
				const lessonId = Number((data as { id?: number })?.id);
				if (lessonId) {
					setSelectedLessonId(lessonId);
				}
				setLessonModal({ open: false, editingId: null });
			},
		});
	};

	const submitTask = (values: TaskFormValues) => {
		if (!selectedLessonId) {
			return;
		}

		let correctAnswer: string | null = null;

		if (values.type === 'code') {
			correctAnswer = null;
		} else if (values.type === 'quiz') {
			const options = (values.options ?? [])
				.map((option) => option.trim())
				.filter((option) => option.length > 0);

			if (options.length < 2) {
				message.error('В тесте должно быть минимум два варианта ответа');
				return;
			}

			const correct = values.quiz_correct_option?.trim();
			if (!correct) {
				message.error('Укажите правильный вариант ответа');
				return;
			}

			correctAnswer = JSON.stringify({ options, correct });
		} else {
			correctAnswer = values.correct_answer?.trim() ?? '';
			if (!correctAnswer) {
				message.error('Укажите правильный ответ для задания с вводом');
				return;
			}
		}

		const payload: TaskCreate = {
			lesson_id: selectedLessonId,
			type: values.type,
			question: values.question,
			correct_answer: correctAnswer,
			coins: values.coins,
		};

		if (taskModal.editingId) {
			updateTask.mutate(
				{ id: taskModal.editingId, data: payload },
				{ onSuccess: () => setTaskModal({ open: false, editingId: null }) },
			);
			return;
		}

		createTask.mutate(payload, {
			onSuccess: () => setTaskModal({ open: false, editingId: null }),
		});
	};

	return (
		<div>
			<PageHeader
				title={course.title}
				subtitle='Управление модулями, уроками и одним заданием на урок'
			/>
			<div style={{ padding: 24 }}>
				<Row gutter={[16, 16]}>
					<Col xs={24} xl={7}>
						<BaseCard
							title='Модули'
							style={{ borderColor: palette.pink }}
							extra={
								<Tooltip title='Добавить модуль'>
									<Button icon={<PlusOutlined />} onClick={openCreateModule} />
								</Tooltip>
							}
						>
							{course.modules.length === 0 && (
								<Empty description='Пока нет модулей' />
							)}
							<Space orientation='vertical' style={{ width: '100%' }}>
								{course.modules.map((module) => (
									<BaseCard
										key={module.id}
										size='small'
										style={{
											cursor: 'pointer',
											borderColor:
												selectedModuleId === module.id
													? palette.purple
													: palette.borderSoft,
										}}
										onClick={() => {
											setSelectedModuleId(module.id);
											setSelectedLessonId(null);
										}}
									>
										<div
											style={{
												display: 'flex',
												justifyContent: 'space-between',
											}}
										>
											<Text strong style={{ color: palette.navy }}>
												{module.title}
											</Text>
											<Space size={4}>
												<Tooltip title='Редактировать модуль'>
													<Button
														type='text'
														icon={<EditOutlined />}
														onClick={(event) => {
															event.stopPropagation();
															openEditModule(
																module.id,
																module.title,
																module.order,
															);
														}}
													/>
												</Tooltip>
												<Popconfirm
													title='Удалить модуль?'
													onConfirm={() => deleteModule.mutate(module.id)}
												>
													<Tooltip title='Удалить модуль'>
														<Button
															type='text'
															danger
															icon={<DeleteOutlined />}
															onClick={(event) => event.stopPropagation()}
														/>
													</Tooltip>
												</Popconfirm>
											</Space>
										</div>
									</BaseCard>
								))}
							</Space>
						</BaseCard>
					</Col>

					<Col xs={24} xl={8}>
						<BaseCard
							title='Уроки'
							style={{ borderColor: palette.pink }}
							extra={
								<Tooltip title='Добавить урок'>
									<Button
										icon={<PlusOutlined />}
										disabled={!selectedModuleId}
										onClick={openCreateLesson}
									/>
								</Tooltip>
							}
						>
							{!selectedModuleId && (
								<Empty description='Сначала выберите модуль' />
							)}
							{selectedModuleId && isModuleLoading && <Spin />}
							{selectedModuleId &&
								!isModuleLoading &&
								selectedModule?.lessons.length === 0 && (
									<Empty description='Пока нет уроков' />
								)}
							{selectedModule?.lessons.length && (
								<List
									dataSource={selectedModule?.lessons ?? []}
									renderItem={(lesson) => (
										<List.Item
											style={{
												cursor: 'pointer',
												background:
													selectedLessonId === lesson.id
														? '#f9f3ff'
														: 'transparent',
												borderRadius: 10,
												paddingInline: 10,
											}}
											onClick={() => setSelectedLessonId(lesson.id)}
											actions={[
												<Tooltip key='edit' title='Редактировать урок'>
													<Button
														type='text'
														icon={<EditOutlined />}
														onClick={(event) => {
															event.stopPropagation();
															openEditLesson(
																lesson.id,
																lesson.title,
																lesson.order,
															);
														}}
													/>
												</Tooltip>,
												<Popconfirm
													key='delete'
													title='Удалить урок?'
													onConfirm={() => deleteLesson.mutate(lesson.id)}
												>
													<Tooltip title='Удалить урок'>
														<Button
															type='text'
															danger
															icon={<DeleteOutlined />}
															onClick={(event) => event.stopPropagation()}
														/>
													</Tooltip>
												</Popconfirm>,
											]}
										>
											<Text style={{ color: palette.navy }}>
												{lesson.title}
											</Text>
										</List.Item>
									)}
								/>
							)}
						</BaseCard>
					</Col>

					<Col xs={24} xl={9}>
						<BaseCard
							title='Задание урока (одно на урок)'
							style={{ borderColor: palette.pink }}
							extra={
								<Tooltip title='Создать задание'>
									<Button
										icon={<PlusOutlined />}
										disabled={!selectedLessonId}
										onClick={openCreateTask}
									/>
								</Tooltip>
							}
						>
							{!selectedLessonId && (
								<Empty description='Сначала выберите урок' />
							)}
							{selectedLessonId && isLessonLoading && <Spin />}
							{selectedLessonId && !isLessonLoading && !primaryTask && (
								<Empty description='Задание еще не создано' />
							)}
							{primaryTask && (
								<BaseCard
									size='small'
									style={{ cursor: 'pointer' }}
									onClick={openEditTask}
								>
									<Space
										orientation='vertical'
										size={6}
										style={{ width: '100%' }}
									>
										<Space>
											<Tag>{taskTypeLabel[primaryTask.type]}</Tag>
											<Tag color='processing'>
												{primaryTask.coins ?? 0} монет
											</Tag>
										</Space>
										<Text strong style={{ color: palette.navy }}>
											{primaryTask.question}
										</Text>
										<Popconfirm
											title='Удалить задание?'
											onConfirm={() => deleteTask.mutate(primaryTask.id)}
										>
											<Tooltip title='Удалить задание'>
												<Button
													type='text'
													danger
													icon={<DeleteOutlined />}
													onClick={(event) => event.stopPropagation()}
												/>
											</Tooltip>
										</Popconfirm>
									</Space>
								</BaseCard>
							)}
							{extraTasks.length > 0 && (
								<Alert
									style={{ marginTop: 12 }}
									type='warning'
									message='В уроке должно остаться только одно задание. Удалите лишние.'
								/>
							)}
							{extraTasks.length > 0 && (
								<List
									size='small'
									dataSource={extraTasks}
									renderItem={(task) => (
										<List.Item
											actions={[
												<Popconfirm
													key='delete-extra'
													title='Удалить лишнее задание?'
													onConfirm={() => deleteTask.mutate(task.id)}
												>
													<Tooltip title='Удалить задание'>
														<Button
															type='text'
															danger
															icon={<DeleteOutlined />}
														/>
													</Tooltip>
												</Popconfirm>,
											]}
										>
											<Text>{task.question}</Text>
										</List.Item>
									)}
								/>
							)}
						</BaseCard>
					</Col>
				</Row>
			</div>

			<Modal
				open={moduleModal.open}
				title={
					moduleModal.editingId ? 'Редактирование модуля' : 'Создание модуля'
				}
				onCancel={() => setModuleModal({ open: false, editingId: null })}
				onOk={() => moduleForm.submit()}
				confirmLoading={createModule.isPending || updateModule.isPending}
			>
				<Form form={moduleForm} layout='vertical' onFinish={submitModule}>
					<Form.Item name='title' label='Название' rules={[{ required: true }]}>
						<Input />
					</Form.Item>
					<Form.Item name='order' label='Порядок' rules={[{ required: true }]}>
						<InputNumber min={1} style={{ width: '100%' }} />
					</Form.Item>
				</Form>
			</Modal>

			<Modal
				open={lessonModal.open}
				width={920}
				title={
					lessonModal.editingId ? 'Редактирование урока' : 'Создание урока'
				}
				onCancel={() => setLessonModal({ open: false, editingId: null })}
				onOk={() => lessonForm.submit()}
				confirmLoading={createLesson.isPending || updateLesson.isPending}
			>
				<Form form={lessonForm} layout='vertical' onFinish={submitLesson}>
					<Form.Item name='title' label='Название' rules={[{ required: true }]}>
						<Input />
					</Form.Item>
					<Form.Item
						name='theory_content'
						label='Теория (Markdown)'
						rules={[{ required: true }]}
					>
						<MarkdownEditor
							height={320}
							placeholder='Введите теорию урока...'
						/>
					</Form.Item>
					<Form.Item name='order' label='Порядок' rules={[{ required: true }]}>
						<InputNumber min={1} style={{ width: '100%' }} />
					</Form.Item>
				</Form>
			</Modal>

			<Modal
				open={taskModal.open}
				title={
					taskModal.editingId ? 'Редактирование задания' : 'Создание задания'
				}
				onCancel={() => setTaskModal({ open: false, editingId: null })}
				onOk={() => taskForm.submit()}
				confirmLoading={createTask.isPending || updateTask.isPending}
			>
				<Form form={taskForm} layout='vertical' onFinish={submitTask}>
					<Form.Item name='type' label='Тип' rules={[{ required: true }]}>
						<Select
							options={[
								{ value: 'quiz', label: 'Тест' },
								{ value: 'input', label: 'Ввод' },
								{ value: 'code', label: 'Код' },
							]}
						/>
					</Form.Item>
					<Form.Item
						name='question'
						label='Вопрос'
						rules={[{ required: true }]}
					>
						<Input.TextArea rows={3} />
					</Form.Item>
					<Form.Item name='coins' label='Монеты' rules={[{ required: true }]}>
						<InputNumber min={1} style={{ width: '100%' }} />
					</Form.Item>

					{taskType === 'input' && (
						<Form.Item
							name='correct_answer'
							label='Правильный ответ'
							rules={[{ required: true }]}
						>
							<Input.TextArea rows={3} />
						</Form.Item>
					)}

					{taskType === 'quiz' && (
						<>
							<Form.List name='options'>
								{(fields, { add, remove }) => (
									<div>
										<Text style={{ color: palette.textSecondary }}>
											Варианты ответа
										</Text>
										{fields.map((field) => (
											<Space
												key={field.key}
												style={{ display: 'flex', marginTop: 8 }}
												align='start'
											>
												<Form.Item
													name={field.name}
													rules={[
														{
															required: true,
															message: 'Вариант ответа обязателен',
														},
													]}
													style={{ marginBottom: 0, width: 280 }}
												>
													<Input placeholder='Текст варианта' />
												</Form.Item>
												<Button
													icon={<MinusCircleOutlined />}
													onClick={() => remove(field.name)}
													disabled={fields.length <= 2}
												/>
											</Space>
										))}
										<Tooltip title='Добавить вариант'>
											<Button icon={<PlusOutlined />} onClick={() => add('')} />
										</Tooltip>
									</div>
								)}
							</Form.List>

							<Form.Item
								name='quiz_correct_option'
								label='Правильный вариант'
								rules={[{ required: true }]}
							>
								<Input placeholder='Должен точно совпадать с одним из вариантов' />
							</Form.Item>
						</>
					)}
				</Form>
			</Modal>
		</div>
	);
};

