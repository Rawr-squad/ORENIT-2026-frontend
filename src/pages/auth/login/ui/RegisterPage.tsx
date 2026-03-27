import { Button, Card, Form, Input, Select, Typography } from 'antd';
import { useRegister } from '@/features/auth/api/useRegister';
import { Link, useNavigate } from 'react-router-dom';
import type { RegisterRequest } from '@/shared/types/auth';

const { Title } = Typography;

export const RegisterPage = () => {
	const [form] = Form.useForm<RegisterRequest>();
	const register = useRegister();
	const navigate = useNavigate();

	const handleSubmit = (values: RegisterRequest) => {
		register.mutate(values, {
			onSuccess: () => {
				navigate('/login');
			},
		});
	};

	return (
		<div style={{ display: 'flex', justifyContent: 'center', marginTop: 100 }}>
			<Card style={{ width: 350 }}>
				<Title level={3}>Регистрация</Title>

				<Form form={form} layout='vertical' onFinish={handleSubmit}>
					<Form.Item
						name='nickname'
						label='Никнейм'
						rules={[{ required: true }]}
					>
						<Input />
					</Form.Item>

					<Form.Item
						name='email'
						label='Email'
						rules={[{ required: true, type: 'email' }]}
					>
						<Input />
					</Form.Item>

					<Form.Item
						name='password'
						label='Пароль'
						rules={[{ required: true, min: 6 }]}
					>
						<Input.Password />
					</Form.Item>

					<Form.Item name='role' label='Роль' rules={[{ required: true }]}>
						<Select
							options={[
								{ value: 'student', label: 'Студент' },
								{ value: 'parent', label: 'Родитель' },
							]}
						/>
					</Form.Item>

					<Button
						type='primary'
						htmlType='submit'
						loading={register.isPending}
						block
					>
						Зарегистрироваться
					</Button>
				</Form>

				<div style={{ marginTop: 12 }}>
					Уже есть аккаунт? <Link to='/register'>Войти</Link>
				</div>
			</Card>
		</div>
	);
};
