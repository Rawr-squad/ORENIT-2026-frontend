import { Spin, Alert } from 'antd';
import { useProgress } from '@/features/progress/api/useProgress';
import { useAuthStore } from '@/entities/user/model/auth.store';
import { ShopPanel } from '@/features/shop/ui/ShopPanel';
import { PageHeader } from '@/shared/ui/layout/PageHeader';
import { Tag } from 'antd';

export const StudentShopPage = () => {
	const user = useAuthStore((s) => s.user);
	const progress = useProgress();

	if (progress.isLoading) {
		return <Spin style={{ marginTop: 48, marginLeft: 24 }} />;
	}

	if (progress.isError) {
		return (
			<Alert
				style={{ margin: 24 }}
				type='error'
				message='Не удалось загрузить данные магазина'
			/>
		);
	}

	const coins = user?.coins ?? progress.data?.coins ?? 0;

	return (
		<div>
			<PageHeader
				title='Магазин'
				subtitle='Трать монеты на цвет ника и кастомные подписи'
				rightSlot={
					<Tag color='gold' style={{ fontSize: 14, padding: '4px 12px' }}>
						{coins} монет
					</Tag>
				}
			/>
			<div style={{ padding: 24 }}>
				<ShopPanel coins={coins} />
			</div>
		</div>
	);
};
