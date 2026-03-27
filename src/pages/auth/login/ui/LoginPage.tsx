import { Button, Card, Form, Input, Typography } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useLogin } from '@/features/auth/api/useLogin';
import { useAuthStore } from '@/entities/user/model/auth.store';
import type { LoginRequest } from '@/shared/types/auth';
import { palette } from '@/shared/config/theme';
import { getRoleHomePath } from '@/shared/lib/get-role-home-path';

const { Title, Text } = Typography;

export const LoginPage = () => {
	const login = useLogin();
	const navigate = useNavigate();
	const { user, token, hydrated } = useAuthStore();

	useEffect(() => {
		if (hydrated && token && user) {
			navigate(getRoleHomePath(user.role), { replace: true });
		}
	}, [navigate, hydrated, token, user]);

	const onFinish = (values: LoginRequest) => {
		login.mutate(values, {
			onSuccess: ({ user: nextUser }) => {
				navigate(getRoleHomePath(nextUser.role), { replace: true });
			},
		});
	};

	return (
		<div
			style={{
				minHeight: '100vh',
				display: 'grid',
				placeItems: 'center',
				padding: 24,
				background:
					'radial-gradient(circle at top right, #F8FFA1 0%, #FFFDF5 40%, #F6D8EE 100%)',
			}}
		>
			<Card
				style={{
					width: '100%',
					maxWidth: 440,
					borderColor: palette.pink,
					boxShadow: '0 18px 45px rgba(36,49,104,0.08)',
				}}
			>
				<div style={{ textAlign: 'center', marginBottom: 18 }}>
					<Title level={2} style={{ marginBottom: 6, color: palette.navy }}>
						Вход
					</Title>
					<Text style={{ color: palette.textSecondary }}>
						Продолжить обучение в вашем аккаунте
					</Text>
				</div>

				<Form layout='vertical' onFinish={onFinish} requiredMark={false}>
					<Form.Item
						name='email'
						label='Почта'
						rules={[{ required: true, type: 'email' }]}
					>
						<Input placeholder='student@example.com' />
					</Form.Item>

					<Form.Item
						name='password'
						label='Пароль'
						rules={[{ required: true, min: 6 }]}
					>
						<Input.Password placeholder='********' />
					</Form.Item>

					<Button
						type='primary'
						htmlType='submit'
						loading={login.isPending}
						block
						style={{ fontWeight: 700, color: palette.navy }}
					>
						Войти
					</Button>
				</Form>

				<div style={{ marginTop: 14, textAlign: 'center', color: palette.textSecondary }}>
					Новый пользователь? <Link to='/register'>Создать аккаунт</Link>
				</div>
			</Card>
		</div>
	);
};
