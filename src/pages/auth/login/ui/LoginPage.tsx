import { Button, Form, Input, Card, Typography } from 'antd';
import { useLogin } from '@/features/auth/api/useLogin';
import { Link, useNavigate } from 'react-router-dom';
import type { LoginRequest } from '@/shared/types/auth';
import { useAuthStore } from '@/entities/user/model/auth.store';
import { useEffect } from 'react';

const { Title } = Typography;

export const LoginPage = () => {
	const login = useLogin();
	const navigate = useNavigate();

	const { user } = useAuthStore();

	useEffect(() => {
		if (!user) return;

		if (user.role === 'admin') navigate('/admin');
		else if (user.role === 'parent') navigate('/parent');
		else navigate('/');
	}, [user, navigate]);

	const onFinish = (values: LoginRequest) => {
		login.mutate(values);
	};

	return (
		<div style={{ display: 'flex', justifyContent: 'center', marginTop: 100 }}>
			<Card style={{ width: 350 }}>
				<Title level={3}>Вход</Title>

				<Form layout='vertical' onFinish={onFinish}>
					<Form.Item
						name='email'
						label='Электронная почта'
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

					<Button
						type='primary'
						htmlType='submit'
						loading={login.isPending}
						block
					>
						Войти
					</Button>
				</Form>

				<div style={{ marginTop: 12 }}>
					Нет аккаунта? <Link to='/register'>Зарегистрироваться</Link>
				</div>
			</Card>
		</div>
	);
};
