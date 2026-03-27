import { Modal, Form, Input } from 'antd';
import { useCreateCourse } from '../api/useCreateCourse';
import type { CourseCreate } from '@/entities/course/model/course.types';

type Props = {
	open: boolean;
	onClose: () => void;
};

export const CreateCourseModal = ({ open, onClose }: Props) => {
	const [form] = Form.useForm<CourseCreate>();
	const createCourse = useCreateCourse();

	const handleSubmit = (values: CourseCreate) => {
		createCourse.mutate(values, {
			onSuccess: () => {
				form.resetFields();
				onClose();
			},
		});
	};

	return (
		<Modal
			title='Создать курс'
			open={open}
			onCancel={onClose}
			onOk={() => form.submit()}
			confirmLoading={createCourse.isPending}
		>
			<Form form={form} layout='vertical' onFinish={handleSubmit}>
				<Form.Item name='title' label='Название' rules={[{ required: true }]}>
					<Input />
				</Form.Item>

				<Form.Item
					name='description'
					label='Описание'
					rules={[{ required: true }]}
				>
					<Input.TextArea rows={4} />
				</Form.Item>
			</Form>
		</Modal>
	);
};
