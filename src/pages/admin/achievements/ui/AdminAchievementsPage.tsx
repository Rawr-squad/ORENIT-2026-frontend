import {
	Alert,
	App,
	Button,
	Card,
	Col,
	Empty,
	Form,
	Input,
	InputNumber,
	Popconfirm,
	Row,
	Select,
	Space,
	Spin,
	Tag,
	Typography,
} from 'antd';
import { PlusOutlined, ThunderboltOutlined } from '@ant-design/icons';
import { useAchievements } from '@/features/achievement/api/useAchievements';
import { useCreateAchievementAdmin } from '@/features/achievement/api/useCreateAchievementAdmin';
import { useSeedAchievements } from '@/features/achievement/api/useSeedAchievements';
import { PageHeader } from '@/shared/ui/layout/PageHeader';
import { palette } from '@/shared/config/theme';
import type { CreateAchievementPayload } from '@/features/achievement/api/achievement.api';
import { useQueryClient } from '@tanstack/react-query';

const { Text } = Typography;

const ACHIEVEMENT_TYPES = [
	{ value: 'lessons_completed', label: 'Уроков завершено' },
	{ value: 'tasks_completed', label: 'Заданий выполнено' },
	{ value: 'xp_earned', label: 'XP заработано' },
	{ value: 'coins_earned', label: 'Монет заработано' },
	{ value: 'streak_days', label: 'Дней подряд' },
];

export const AdminAchievementsPage = () => {
	const { message } = App.useApp();
	const queryClient = useQueryClient();

	const achievements = useAchievements();
	const createAchievement = useCreateAchievementAdmin();
	const seedAchievements = useSeedAchievements();

	const [form] = Form.useForm<CreateAchievementPayload>();

	const handleCreate = (values: CreateAchievementPayload) => {
		createAchievement.mutate(values, {
			onSuccess: () => {
				message.success('Достижение создано');
				form.resetFields();
				queryClient.invalidateQueries({ queryKey: ['achievements'] });
			},
			onError: () => message.error('Не удалось создать достижение'),
		});
	};

	const handleSeed = () => {
		seedAchievements.mutate(undefined, {
			onSuccess: () => {
				message.success('Стандартные достижения загружены');
				queryClient.invalidateQueries({ queryKey: ['achievements'] });
			},
			onError: () => message.error('Не удалось загрузить достижения'),
		});
	};

	return (
		<div>
			<PageHeader
				title='Управление достижениями'
				subtitle='Создание достижений и загрузка стандартного набора'
				rightSlot={
					<Popconfirm
						title='Загрузить стандартные достижения?'
						description='Будет добавлен базовый набор достижений.'
						onConfirm={handleSeed}
						okButtonProps={{ loading: seedAchievements.isPending }}
					>
						<Button
							icon={<ThunderboltOutlined />}
							loading={seedAchievements.isPending}
						>
							Seed достижений
						</Button>
					</Popconfirm>
				}
			/>

			<div style={{ padding: 24 }}>
				<Row gutter={[24, 24]}>
					{/* Форма создания */}
					<Col xs={24} lg={10}>
						<Card
							title='Создать достижение'
							style={{ borderColor: palette.pink }}
							styles={{ header: { color: palette.navy } }}
						>
							<Form form={form} layout='vertical' onFinish={handleCreate}>
								<Form.Item
									name='title'
									label='Название'
									rules={[{ required: true, message: 'Введите название' }]}
								>
									<Input placeholder='Например: Первый урок' />
								</Form.Item>

								<Form.Item
									name='description'
									label='Описание'
									rules={[{ required: true, message: 'Введите описание' }]}
								>
									<Input.TextArea
										rows={2}
										placeholder='Завершите первый урок'
									/>
								</Form.Item>

								<Form.Item
									name='type'
									label='Тип условия'
									rules={[{ required: true, message: 'Выберите тип' }]}
								>
									<Select
										options={ACHIEVEMENT_TYPES}
										placeholder='Выберите тип'
									/>
								</Form.Item>

								<Form.Item
									name='condition_value'
									label='Значение условия'
									rules={[{ required: true, message: 'Введите значение' }]}
									extra='Например: 1 (для "завершить 1 урок")'
								>
									<InputNumber min={1} style={{ width: '100%' }} />
								</Form.Item>

								<Form.Item
									name='reward_coins'
									label='Награда (монеты)'
									rules={[{ required: true, message: 'Введите награду' }]}
								>
									<InputNumber min={0} style={{ width: '100%' }} />
								</Form.Item>

								<Button
									type='primary'
									htmlType='submit'
									icon={<PlusOutlined />}
									loading={createAchievement.isPending}
									style={{ color: palette.navy, fontWeight: 700 }}
								>
									Создать достижение
								</Button>
							</Form>
						</Card>
					</Col>

					{/* Список достижений */}
					<Col xs={24} lg={14}>
						<Card
							title={`Все достижения (${achievements.data?.length ?? 0})`}
							style={{ borderColor: palette.pink }}
							styles={{ header: { color: palette.navy } }}
						>
							{achievements.isLoading && <Spin />}
							{achievements.isError && (
								<Alert type='error' message='Не удалось загрузить достижения' />
							)}
							{!achievements.isLoading &&
								(achievements.data ?? []).length === 0 && (
									<Empty description='Достижений пока нет. Создайте вручную или используйте Seed.' />
								)}
							<Space direction='vertical' style={{ width: '100%' }} size={10}>
								{(achievements.data ?? []).map((achievement) => (
									<Card
										key={achievement.id}
										size='small'
										style={{ borderColor: palette.borderSoft }}
									>
										<div
											style={{
												display: 'flex',
												justifyContent: 'space-between',
												alignItems: 'flex-start',
												flexWrap: 'wrap',
												gap: 8,
											}}
										>
											<div>
												<Text
													strong
													style={{ color: palette.navy, fontSize: 15 }}
												>
													{achievement.title}
												</Text>
												{achievement.description && (
													<div
														style={{
															color: palette.textSecondary,
															fontSize: 13,
															marginTop: 2,
														}}
													>
														{achievement.description}
													</div>
												)}
											</div>
											<Space wrap>
												{typeof achievement.reward_coins === 'number' &&
													achievement.reward_coins > 0 && (
														<Tag color='gold'>
															+{achievement.reward_coins} монет
														</Tag>
													)}
												<Tag color='purple'>#{achievement.id}</Tag>
											</Space>
										</div>
									</Card>
								))}
							</Space>
						</Card>
					</Col>
				</Row>
			</div>
		</div>
	);
};
