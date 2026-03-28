import { Button, Form, Input, App, Typography } from 'antd';
import { useParentLink } from '../api/useParentLink';
import { BaseCard } from '@/shared/ui/card/BaseCard';
import { palette } from '@/shared/config/theme';

const { Text } = Typography;

type FormValues = {
	parent_email: string;
};

export const ParentLinkForm = () => {
	const { message } = App.useApp();
	const [form] = Form.useForm<FormValues>();

	const linkParent = useParentLink();

	const onFinish = (values: FormValues) => {
		linkParent.mutate(values, {
			onSuccess: () => {
				message.success('Приглашение отправлено родителю');
				form.resetFields();
			},
			onError: () => {
				message.error('Не удалось отправить приглашение');
			},
		});
	};

	return (
		<BaseCard>
			<Text strong style={{ color: palette.navy }}>
				Привязка родителя
			</Text>

			<div style={{ marginTop: 8, marginBottom: 16 }}>
				<Text style={{ color: palette.textSecondary }}>
					Введите email родителя, чтобы он мог отслеживать ваш прогресс
				</Text>
			</div>

			<Form form={form} onFinish={onFinish} layout='vertical'>
				<Form.Item
					name='parent_email'
					rules={[
						{ required: true, message: 'Введите email' },
						{ type: 'email', message: 'Некорректный email' },
					]}
				>
					<Input placeholder='parent@email.com' />
				</Form.Item>

				<Button
					type='primary'
					htmlType='submit'
					style={{ color: palette.text }}
					loading={linkParent.isPending}
					block
				>
					Пригласить родителя
				</Button>
			</Form>
		</BaseCard>
	);
};
