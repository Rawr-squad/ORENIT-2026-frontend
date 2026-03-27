import { Modal, Form, Input } from 'antd';
import { useCreateModule } from '../api/useCreateModule';

type Props = {
	open: boolean;
	onClose: () => void;
	courseId: number;
};

export const CreateModuleModal = ({ open, onClose, courseId }: Props) => {
	const [form] = Form.useForm();
	const createModule = useCreateModule();

	const handleSubmit = (values: { title: string }) => {
		createModule.mutate(
			{
				course_id: courseId,
				title: values.title,
				order: 1, // пока статично
			},
			{
				onSuccess: () => {
					form.resetFields();
					onClose();
				},
			},
		);
	};

	return (
		<Modal
			title='Создать модуль'
			open={open}
			onCancel={onClose}
			onOk={() => form.submit()}
			confirmLoading={createModule.isPending}
		>
			<Form form={form} onFinish={handleSubmit}>
				<Form.Item name='title' label='Название' rules={[{ required: true }]}>
					<Input />
				</Form.Item>
			</Form>
		</Modal>
	);
};
