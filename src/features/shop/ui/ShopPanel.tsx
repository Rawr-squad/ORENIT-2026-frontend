import { Alert, App, Button, Card, Col, Empty, Row, Space, Spin, Tag, Typography } from 'antd';
import { useMemo } from 'react';
import { useBuyShopColor, useBuyShopStatus } from '@/features/shop/api/useBuyShopItem';
import { useShopColors } from '@/features/shop/api/useShopColors';
import { useShopStatuses } from '@/features/shop/api/useShopStatuses';
import { palette } from '@/shared/config/theme';

const { Text, Title } = Typography;

type Props = {
	coins: number;
};

const resolveActionState = (
	item: { owned: boolean; active: boolean; price: number },
	coins: number,
) => {
	if (item.active) {
		return { disabled: true, label: 'Активно' };
	}
	if (item.owned) {
		return { disabled: true, label: 'Куплено' };
	}
	if (coins < item.price) {
		return { disabled: true, label: `Нужно еще ${item.price - coins}` };
	}

	return { disabled: false, label: `Купить за ${item.price}` };
};

export const ShopPanel = ({ coins }: Props) => {
	const { message } = App.useApp();
	const colors = useShopColors();
	const statuses = useShopStatuses();
	const buyColor = useBuyShopColor();
	const buyStatus = useBuyShopStatus();

	const isLoading = colors.isLoading || statuses.isLoading;
	const isError = colors.isError || statuses.isError;

	const colorItems = useMemo(() => colors.data ?? [], [colors.data]);
	const statusItems = useMemo(() => statuses.data ?? [], [statuses.data]);

	if (isLoading) {
		return <Spin />;
	}

	if (isError) {
		return <Alert type='error' message='Не удалось загрузить товары магазина' />;
	}

	return (
		<Card
			title='Магазин и персонализация'
			style={{ borderColor: palette.pink }}
			styles={{ header: { borderBottom: 'none', color: palette.navy } }}
			extra={<Tag color='gold'>{coins} монет</Tag>}
		>
			<Space orientation='vertical' style={{ width: '100%' }} size={18}>
				<div>
					<Title level={5} style={{ marginTop: 0, color: palette.navy }}>
						Цвета ника
					</Title>
					{colorItems.length === 0 && <Empty description='Цвета пока отсутствуют' />}
					<Row gutter={[10, 10]}>
						{colorItems.map((item) => {
							const action = resolveActionState(item, coins);
							return (
								<Col xs={24} md={12} key={item.id}>
									<Card size='small' style={{ borderColor: palette.borderSoft }}>
										<Space
											orientation='vertical'
											style={{ width: '100%' }}
											size={8}
										>
											<Text
												strong
												style={{
													color: item.hex_code,
													fontSize: 17,
												}}
											>
												{item.name}
											</Text>
											<Space wrap>
												<Tag>{item.hex_code}</Tag>
												<Tag color='gold'>{item.price} монет</Tag>
												{item.active && <Tag color='success'>Активно</Tag>}
												{item.owned && !item.active && (
													<Tag color='blue'>Куплено</Tag>
												)}
											</Space>
											<Button
												type='primary'
												disabled={action.disabled || buyColor.isPending}
												loading={buyColor.isPending}
												style={{ color: palette.navy, fontWeight: 700 }}
												onClick={() => {
													buyColor.mutate(item.id, {
														onSuccess: () => message.success('Цвет куплен'),
														onError: () => message.error('Не удалось купить цвет'),
													});
												}}
											>
												{action.label}
											</Button>
										</Space>
									</Card>
								</Col>
							);
						})}
					</Row>
				</div>

				<div>
					<Title level={5} style={{ marginTop: 0, color: palette.navy }}>
						Кастомные подписи
					</Title>
					{statusItems.length === 0 && <Empty description='Подписи пока отсутствуют' />}
					<Row gutter={[10, 10]}>
						{statusItems.map((item) => {
							const action = resolveActionState(item, coins);
							return (
								<Col xs={24} md={12} key={item.id}>
									<Card size='small' style={{ borderColor: palette.borderSoft }}>
										<Space
											orientation='vertical'
											style={{ width: '100%' }}
											size={8}
										>
											<Text strong style={{ color: palette.navy, fontSize: 16 }}>
												{item.title}
											</Text>
											<Space wrap>
												<Tag color='gold'>{item.price} монет</Tag>
												{item.active && <Tag color='success'>Активно</Tag>}
												{item.owned && !item.active && (
													<Tag color='blue'>Куплено</Tag>
												)}
											</Space>
											<Button
												type='primary'
												disabled={action.disabled || buyStatus.isPending}
												loading={buyStatus.isPending}
												style={{ color: palette.navy, fontWeight: 700 }}
												onClick={() => {
													buyStatus.mutate(item.id, {
														onSuccess: () => message.success('Подпись куплена'),
														onError: () => message.error('Не удалось купить подпись'),
													});
												}}
											>
												{action.label}
											</Button>
										</Space>
									</Card>
								</Col>
							);
						})}
					</Row>
				</div>
			</Space>
		</Card>
	);
};
