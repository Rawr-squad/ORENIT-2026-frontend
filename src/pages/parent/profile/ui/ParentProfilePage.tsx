import { Alert, Col, Row, Spin, Tag, Typography } from 'antd';
import { useAuthStore } from '@/entities/user/model/auth.store';
import { useProgress } from '@/features/progress/api/useProgress';
import { PageHeader } from '@/shared/ui/layout/PageHeader';
import { UserIdentity } from '@/shared/ui/user/UserIdentity';
import { palette } from '@/shared/config/theme';
import { BaseCard } from '@/shared/ui/card/BaseCard';

const { Text, Title } = Typography;

export const ParentProfilePage = () => {
	const user = useAuthStore((s) => s.user);
	const progress = useProgress();

	if (progress.isLoading) {
		return <Spin style={{ marginTop: 48, marginLeft: 24 }} />;
	}

	if (progress.isError || !progress.data) {
		return (
			<Alert
				style={{ margin: 24 }}
				type='error'
				message='Не удалось загрузить профиль родителя'
			/>
		);
	}

	return (
		<div>
			<PageHeader
				title='Профиль родителя'
				subtitle='Данные аккаунта и краткая сводка по ребенку'
				rightSlot={<Tag color='processing'>Родитель</Tag>}
			/>
			<div style={{ padding: 24 }}>
				<Row gutter={[16, 16]}>
					<Col xs={24} lg={10}>
						<BaseCard>
							<Title level={5} style={{ color: palette.navy, marginTop: 0 }}>
								Аккаунт
							</Title>
							<UserIdentity
								nickname={user?.nickname}
								nicknameColor={user?.nickname_color}
								customStatus={user?.custom_status}
								avatarUrl={user?.avatar_url}
								coins={user?.coins}
								showCoins
							/>
							<Text style={{ display: 'block', color: palette.navy }}>
								Почта: {user?.email}
							</Text>
						</BaseCard>
					</Col>
					<Col xs={24} lg={14}>
						<BaseCard>
							<Title level={5} style={{ color: palette.navy, marginTop: 0 }}>
								Сводка по ребенку
							</Title>
							<Text style={{ display: 'block', color: palette.navy }}>
								XP: {progress.data.xp}
							</Text>
							<Text style={{ display: 'block', color: palette.navy }}>
								Завершенные уроки: {progress.data.completed_lessons}
							</Text>
						</BaseCard>
					</Col>
				</Row>
			</div>
		</div>
	);
};

