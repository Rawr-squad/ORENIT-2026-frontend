import { Modal, Form, Input } from 'antd';
import { useCreateLesson } from '../api/useCreateLesson';

const { TextArea } = Input;

type Props = {
	open: boolean;
	onClose: () => void;
	moduleId: number;
};

export const CreateLessonModal = ({ open, onClose, moduleId }: Props) => {
	const [form] = Form.useForm();
	const createLesson = useCreateLesson();

	const handleSubmit = (values: { title: string; theory_content: string }) => {
		createLesson.mutate(
			{
				module_id: moduleId,
				title: values.title,
				theory_content: values.theory_content,
				order: 1, // временно
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
			title='Создать урок'
			open={open}
			onCancel={onClose}
			onOk={() => form.submit()}
			confirmLoading={createLesson.isPending}
		>
			<Form form={form} layout='vertical' onFinish={handleSubmit}>
				<Form.Item name='title' label='Название' rules={[{ required: true }]}>
					<Input />
				</Form.Item>

				<Form.Item
					name='theory_content'
					label='Теория (Markdown)'
					rules={[{ required: true }]}
				>
					<TextArea rows={6} />
				</Form.Item>
			</Form>
		</Modal>
	);
};
