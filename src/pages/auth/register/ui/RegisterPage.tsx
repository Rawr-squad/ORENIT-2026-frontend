import { Button, Card, Form, Input, Select, Typography } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { useRegister } from '@/features/auth/api/useRegister';
import type { RegisterRequest } from '@/shared/types/auth';
import { palette } from '@/shared/config/theme';

const { Title, Text } = Typography;

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
		<div
			style={{
				minHeight: '100vh',
				display: 'grid',
				placeItems: 'center',
				padding: 24,
				background:
					'radial-gradient(circle at 15% 0%, #F6D8EE 0%, #FFFDF5 42%, #F8FFA1 100%)',
			}}
		>
			<Card
				style={{
					width: '100%',
					maxWidth: 460,
					borderColor: palette.pink,
					boxShadow: '0 18px 45px rgba(36,49,104,0.08)',
				}}
			>
				<div style={{ textAlign: 'center', marginBottom: 18 }}>
					<Title level={2} style={{ marginBottom: 6, color: palette.navy }}>
						Регистрация
					</Title>
					<Text style={{ color: palette.textSecondary }}>
						Доступны роли ученика и родителя
					</Text>
				</div>

				<Form
					form={form}
					layout='vertical'
					onFinish={handleSubmit}
					requiredMark={false}
				>
					<Form.Item
						name='nickname'
						label='Никнейм'
						rules={[{ required: true }]}
					>
						<Input placeholder='Alex' />
					</Form.Item>

					<Form.Item
						name='email'
						label='Почта'
						rules={[{ required: true, type: 'email' }]}
					>
						<Input placeholder='alex@example.com' />
					</Form.Item>

					<Form.Item
						name='password'
						label='Пароль'
						rules={[{ required: true, min: 6 }]}
					>
						<Input.Password placeholder='********' />
					</Form.Item>

					<Form.Item
						name='role'
						label='Роль'
						initialValue='student'
						rules={[{ required: true }]}
					>
						<Select
							options={[
								{ value: 'student', label: 'Ученик' },
								{ value: 'parent', label: 'Родитель' },
							]}
						/>
					</Form.Item>

					<Button
						type='primary'
						htmlType='submit'
						loading={register.isPending}
						block
						style={{ fontWeight: 700, color: palette.navy }}
					>
						Создать аккаунт
					</Button>
				</Form>

				<div
					style={{
						marginTop: 14,
						textAlign: 'center',
						color: palette.textSecondary,
					}}
				>
					Уже есть аккаунт? <Link to='/login'>Войти</Link>
				</div>
			</Card>
		</div>
	);
};

