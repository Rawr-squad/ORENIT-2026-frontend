import { useMemo, useState } from 'react';
import {
	Button,
	Form,
	Input,
	Modal,
	Popconfirm,
	Space,
	Table,
	Tooltip,
	Typography,
} from 'antd';
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import type { ColumnsType } from 'antd/es/table';
import type {
	CourseCreate,
	CoursePreview,
} from '@/entities/course/model/course.types';
import { useCoursesAdmin } from '@/features/admin/course/api/useCoursesAdmin';
import { useCreateCourse } from '@/features/admin/course/api/useCreateCourse';
import { useUpdateCourse } from '@/features/admin/course/api/useUpdateCourse';
import { useDeleteCourse } from '@/features/admin/course/api/useDeleteCourse';
import { PageHeader } from '@/shared/ui/layout/PageHeader';
import { MarkdownEditor } from '@/shared/ui/MarkdownEditor';
import { palette } from '@/shared/config/theme';

const { Text } = Typography;

type FormValues = {
	title: string;
	description: string;
};

export const AdminCoursesPage = () => {
	const [form] = Form.useForm<FormValues>();
	const navigate = useNavigate();
	const [open, setOpen] = useState(false);
	const [editingCourse, setEditingCourse] = useState<CoursePreview | null>(
		null,
	);

	const { data, isLoading } = useCoursesAdmin();
	const createCourse = useCreateCourse();
	const updateCourse = useUpdateCourse();
	const deleteCourse = useDeleteCourse();

	const onCloseModal = () => {
		setOpen(false);
		setEditingCourse(null);
		form.resetFields();
	};

	const onSubmit = (values: FormValues) => {
		const payload: CourseCreate = {
			title: values.title,
			description: values.description,
		};

		if (editingCourse) {
			updateCourse.mutate(
				{ id: editingCourse.id, data: payload },
				{
					onSuccess: onCloseModal,
				},
			);
			return;
		}

		createCourse.mutate(payload, {
			onSuccess: onCloseModal,
		});
	};

	const columns: ColumnsType<CoursePreview> = useMemo(
		() => [
			{ title: 'ID', dataIndex: 'id', width: 80 },
			{ title: 'Название', dataIndex: 'title' },
			{
				title: 'Описание',
				dataIndex: 'description',
				render: (description: string) => (
					<Text
						ellipsis={{ tooltip: description }}
						style={{ color: palette.textSecondary }}
					>
						{description}
					</Text>
				),
			},
			{
				title: 'Действия',
				width: 140,
				render: (_, record) => (
					<Space size={4} onClick={(event) => event.stopPropagation()}>
						<Tooltip title='Редактировать'>
							<Button
								type='text'
								icon={<EditOutlined />}
								onClick={() => {
									setEditingCourse(record);
									form.setFieldsValue({
										title: record.title,
										description: record.description,
									});
									setOpen(true);
								}}
							/>
						</Tooltip>
						<Popconfirm
							title='Удалить курс?'
							description='Это действие нельзя отменить.'
							onConfirm={() => deleteCourse.mutate(record.id)}
							okButtonProps={{ loading: deleteCourse.isPending }}
						>
							<Tooltip title='Удалить'>
								<Button type='text' danger icon={<DeleteOutlined />} />
							</Tooltip>
						</Popconfirm>
					</Space>
				),
			},
		],
		[deleteCourse, form],
	);

	return (
		<div>
			<PageHeader
				title='Управление курсами'
				subtitle='Создание, редактирование и удаление курсов'
				rightSlot={
					<Tooltip title='Создать курс'>
						<Button
							type='primary'
							icon={<PlusOutlined />}
							style={{ color: palette.navy }}
							onClick={() => setOpen(true)}
						/>
					</Tooltip>
				}
			/>
			<div style={{ padding: 24 }}>
				<Table
					rowKey='id'
					dataSource={data}
					loading={isLoading}
					columns={columns}
					onRow={(record) => ({
						onClick: () => navigate(`/admin/courses/${record.id}`),
						style: { cursor: 'pointer' },
					})}
					style={{ background: '#fff', borderRadius: 14, overflow: 'hidden' }}
				/>
			</div>

			<Modal
				open={open}
				title={editingCourse ? 'Редактирование курса' : 'Создание курса'}
				onCancel={onCloseModal}
				onOk={() => form.submit()}
				confirmLoading={createCourse.isPending || updateCourse.isPending}
				width={900}
			>
				<Form form={form} layout='vertical' onFinish={onSubmit}>
					<Form.Item name='title' label='Название' rules={[{ required: true }]}>
						<Input />
					</Form.Item>
					<Form.Item
						name='description'
						label='Описание (Markdown)'
						rules={[{ required: true }]}
					>
						<MarkdownEditor
							height={280}
							placeholder='Введите описание курса...'
						/>
					</Form.Item>
				</Form>
			</Modal>
		</div>
	);
};

