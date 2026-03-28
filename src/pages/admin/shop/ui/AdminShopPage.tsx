import {
	Alert,
	App,
	Button,
	Col,
	Form,
	Input,
	InputNumber,
	Popconfirm,
	Row,
	Space,
	Tag,
	Typography,
} from 'antd';
import { PlusOutlined, ThunderboltOutlined } from '@ant-design/icons';
import { useShopColors } from '@/features/shop/api/useShopColors';
import { useShopStatuses } from '@/features/shop/api/useShopStatuses';
import {
	useCreateShopColorAdmin,
	useCreateShopStatusAdmin,
	useSeedShop,
} from '@/features/shop/api/useShopAdmin';
import { PageHeader } from '@/shared/ui/layout/PageHeader';
import { palette } from '@/shared/config/theme';
import { BaseCard } from '@/shared/ui/card/BaseCard';

const { Text, Title } = Typography;

type ColorFormValues = {
	name: string;
	hex_code: string;
	price: number;
};

type StatusFormValues = {
	title: string;
	price: number;
};

export const AdminShopPage = () => {
	const { message } = App.useApp();

	const colors = useShopColors();
	const statuses = useShopStatuses();
	const createColor = useCreateShopColorAdmin();
	const createStatus = useCreateShopStatusAdmin();
	const seedShop = useSeedShop();

	const [colorForm] = Form.useForm<ColorFormValues>();
	const [statusForm] = Form.useForm<StatusFormValues>();

	const handleCreateColor = (values: ColorFormValues) => {
		createColor.mutate(values, {
			onSuccess: () => {
				message.success('Цвет добавлен');
				colorForm.resetFields();
			},
			onError: () => message.error('Не удалось добавить цвет'),
		});
	};

	const handleCreateStatus = (values: StatusFormValues) => {
		createStatus.mutate(values, {
			onSuccess: () => {
				message.success('Подпись добавлена');
				statusForm.resetFields();
			},
			onError: () => message.error('Не удалось добавить подпись'),
		});
	};

	const handleSeed = () => {
		seedShop.mutate(undefined, {
			onSuccess: () => message.success('Стартовые товары загружены'),
			onError: () => message.error('Не удалось загрузить стартовые товары'),
		});
	};

	return (
		<div>
			<PageHeader
				title='Управление магазином'
				subtitle='Создание цветов ника и кастомных подписей'
				rightSlot={
					<Popconfirm
						title='Загрузить стартовые товары?'
						description='Это добавит набор товаров по умолчанию.'
						onConfirm={handleSeed}
						okButtonProps={{ loading: seedShop.isPending }}
					>
						<Button icon={<ThunderboltOutlined />} loading={seedShop.isPending}>
							Seed товаров
						</Button>
					</Popconfirm>
				}
			/>

			<div style={{ padding: 24 }}>
				<Row gutter={[24, 24]}>
					{/* Цвета ника */}
					<Col xs={24} lg={12}>
						<BaseCard
							title='Цвета ника'
							styles={{ header: { color: palette.navy } }}
						>
							<Form
								form={colorForm}
								layout='vertical'
								onFinish={handleCreateColor}
							>
								<Form.Item
									name='name'
									label='Название'
									rules={[{ required: true, message: 'Введите название' }]}
								>
									<Input placeholder='Например: Золотой' />
								</Form.Item>

								<Form.Item
									name='hex_code'
									label='HEX-код цвета'
									rules={[
										{ required: true, message: 'Введите HEX-код' },
										{
											pattern: /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/,
											message: 'Формат: #RGB или #RRGGBB',
										},
									]}
								>
									<Input placeholder='#F59E0B' />
								</Form.Item>

								<Form.Item
									name='price'
									label='Цена (монеты)'
									rules={[{ required: true, message: 'Введите цену' }]}
								>
									<InputNumber min={0} style={{ width: '100%' }} />
								</Form.Item>

								<Button
									type='primary'
									htmlType='submit'
									icon={<PlusOutlined />}
									loading={createColor.isPending}
									style={{ color: palette.navy, fontWeight: 700 }}
								>
									Добавить цвет
								</Button>
							</Form>

							<div style={{ marginTop: 24 }}>
								<Title level={5} style={{ color: palette.navy }}>
									Существующие цвета
								</Title>
								{colors.isError && (
									<Alert type='error' message='Не удалось загрузить цвета' />
								)}
								<Space wrap style={{ marginTop: 8 }}>
									{(colors.data ?? []).map((color) => (
										<Tag
											key={color.id}
											style={{
												color: color.hex_code,
												borderColor: color.hex_code,
												fontWeight: 700,
											}}
										>
											{color.name} — {color.price} монет
										</Tag>
									))}
									{(colors.data ?? []).length === 0 && !colors.isLoading && (
										<Text style={{ color: palette.textSecondary }}>
											Цветов пока нет
										</Text>
									)}
								</Space>
							</div>
						</BaseCard>
					</Col>

					{/* Кастомные подписи */}
					<Col xs={24} lg={12}>
						<BaseCard
							title='Кастомные подписи'
							styles={{ header: { color: palette.navy } }}
						>
							<Form
								form={statusForm}
								layout='vertical'
								onFinish={handleCreateStatus}
							>
								<Form.Item
									name='title'
									label='Текст подписи'
									rules={[{ required: true, message: 'Введите текст' }]}
								>
									<Input placeholder='Например: Легенда' />
								</Form.Item>

								<Form.Item
									name='price'
									label='Цена (монеты)'
									rules={[{ required: true, message: 'Введите цену' }]}
								>
									<InputNumber min={0} style={{ width: '100%' }} />
								</Form.Item>

								<Button
									type='primary'
									htmlType='submit'
									icon={<PlusOutlined />}
									loading={createStatus.isPending}
									style={{ color: palette.navy, fontWeight: 700 }}
								>
									Добавить подпись
								</Button>
							</Form>

							<div style={{ marginTop: 24 }}>
								<Title level={5} style={{ color: palette.navy }}>
									Существующие подписи
								</Title>
								{statuses.isError && (
									<Alert type='error' message='Не удалось загрузить подписи' />
								)}
								<Space wrap style={{ marginTop: 8 }}>
									{(statuses.data ?? []).map((status) => (
										<Tag key={status.id} color='magenta'>
											{status.title} — {status.price} монет
										</Tag>
									))}
									{(statuses.data ?? []).length === 0 &&
										!statuses.isLoading && (
											<Text style={{ color: palette.textSecondary }}>
												Подписей пока нет
											</Text>
										)}
								</Space>
							</div>
						</BaseCard>
					</Col>
				</Row>
			</div>
		</div>
	);
};
