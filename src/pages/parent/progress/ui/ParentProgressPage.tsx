import {
	Alert,
	App,
	Button,
	Card,
	Col,
	Form,
	Input,
	Progress,
	Row,
	Spin,
	Statistic,
	Typography,
} from 'antd';
import { useLinkChild } from '@/features/parent/api/useLinkChild';
import { useProgress } from '@/features/progress/api/useProgress';
import { palette } from '@/shared/config/theme';
import { PageHeader } from '@/shared/ui/layout/PageHeader';

const { Text } = Typography;

export const ParentProgressPage = () => {
	const { message } = App.useApp();
	const progress = useProgress();
	const linkChild = useLinkChild();
	const [form] = Form.useForm<{ parent_email: string }>();

	if (progress.isLoading) {
		return <Spin style={{ marginTop: 48, marginLeft: 24 }} />;
	}

	if (progress.isError || !progress.data) {
		return (
			<Alert
				style={{ margin: 24 }}
				type='error'
				message='Не удалось загрузить прогресс ребенка'
			/>
		);
	}

	const percent = progress.data.xp % 100;

	return (
		<div>
			<PageHeader
				title='Прогресс ребенка'
				subtitle='Отслеживайте рост XP и динамику обучения'
			/>

			<div style={{ padding: 24 }}>
				<Row gutter={[16, 16]}>
					<Col xs={24} lg={12}>
						<Card style={{ borderColor: palette.pink }} title='Прогресс'>
							<Progress type='circle' percent={percent} strokeColor={palette.purple} />
							<div style={{ marginTop: 16 }}>
								<Statistic title='Общий XP' value={progress.data.xp} />
								<Statistic
									title='Завершенные уроки'
									value={progress.data.completed_lessons}
								/>
							</div>
						</Card>
					</Col>

					<Col xs={24} lg={12}>
						<Card style={{ borderColor: palette.pink }} title='Привязка профиля ребенка'>
							<Text style={{ display: 'block', marginBottom: 10, color: palette.textSecondary }}>
								Используйте почту родителя, чтобы привязать и отслеживать аккаунт ученика.
							</Text>
							<Form
								form={form}
								layout='vertical'
								onFinish={(values) => {
									linkChild.mutate(values.parent_email, {
										onSuccess: () => {
											message.success('Профиль ребенка успешно привязан');
											form.resetFields();
										},
										onError: () => {
											message.error('Не удалось привязать профиль ребенка');
										},
									});
								}}
							>
								<Form.Item
									name='parent_email'
									label='Почта родителя'
									rules={[{ required: true, type: 'email' }]}
								>
									<Input placeholder='parent@example.com' />
								</Form.Item>

								<Button
									type='primary'
									htmlType='submit'
									loading={linkChild.isPending}
									style={{ color: palette.navy, fontWeight: 700 }}
								>
									Привязать профиль
								</Button>
							</Form>
						</Card>
					</Col>
				</Row>
			</div>
		</div>
	);
};
