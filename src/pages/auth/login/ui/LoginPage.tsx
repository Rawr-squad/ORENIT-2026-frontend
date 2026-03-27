import { Button, Form, Input, Card, Typography } from 'antd';
import { useLogin } from '@/features/auth/api/useLogin';
import { useNavigate } from 'react-router-dom';
import type { LoginRequest } from '@/shared/types/auth';
import { useAuthStore } from '@/entities/user/model/auth.store';
import { useEffect } from 'react';

const { Title } = Typography;

export const LoginPage = () => {
	const login = useLogin();
	const navigate = useNavigate();

	const token = useAuthStore((s) => s.token);
	const isAuth = Boolean(token);

	useEffect(() => {
		if (isAuth) {
			navigate('/');
		}
	}, [isAuth, navigate]);

	const onFinish = (values: LoginRequest) => {
		login.mutate(values, {
			onSuccess: (data) => {
				const role = data.role;

				if (role === 'admin') navigate('/admin');
				else if (role === 'parent') navigate('/parent');
				else navigate('/');
			},
		});
	};

	return (
		<div style={{ display: 'flex', justifyContent: 'center', marginTop: 100 }}>
			<Card style={{ width: 350 }}>
				<Title level={3}>Login</Title>

				<Form layout='vertical' onFinish={onFinish}>
					<Form.Item name='email' label='Email' required>
						<Input />
					</Form.Item>

					<Form.Item name='password' label='Password' required>
						<Input.Password />
					</Form.Item>

					<Button
						type='primary'
						htmlType='submit'
						loading={login.isPending}
						block
					>
						Login
					</Button>
				</Form>
			</Card>
		</div>
	);
};
