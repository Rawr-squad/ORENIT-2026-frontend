import { Alert, Col, Empty, Row, Spin, Statistic, Tag, Typography } from 'antd';
import { useProgress } from '@/features/progress/api/useProgress';
import { useMyAchievements } from '@/features/achievement/api/useMyAchievements';
import { useAuthStore } from '@/entities/user/model/auth.store';
import { ShopPanel } from '@/features/shop/ui/ShopPanel';
import { PageHeader } from '@/shared/ui/layout/PageHeader';
import { UserIdentity } from '@/shared/ui/user/UserIdentity';
import { XPDisplay } from '@/widgets/progress/ui/XPDisplay';
import { palette } from '@/shared/config/theme';
import { BaseCard } from '@/shared/ui/card/BaseCard';
import { ParentLinkForm } from '@/features/parent-link/ui/ParentLinkForm';

const { Text, Title } = Typography;

export const ProfilePage = () => {
	const user = useAuthStore((s) => s.user);
	const progress = useProgress();
	const achievements = useMyAchievements();

	if (progress.isLoading) {
		return <Spin style={{ marginTop: 48, marginLeft: 24 }} />;
	}

	if (progress.isError || !progress.data) {
		return (
			<Alert
				style={{ margin: 24 }}
				type='error'
				message='Не удалось загрузить профиль'
			/>
		);
	}

	const coins = progress.data.coins ?? 0;
	const roleLabelByRole = {
		student: 'Ученик',
		parent: 'Родитель',
		admin: 'Администратор',
	} as const;
	const roleLabel = user?.role ? roleLabelByRole[user.role] : 'Ученик';

	return (
		<div>
			<PageHeader
				title='Профиль'
				subtitle='Ваш XP, достижения и персонализация'
				rightSlot={<Tag color='gold'>{coins} монет</Tag>}
			/>

			<div style={{ padding: 24 }}>
				<Row gutter={[16, 16]}>
					<Col xs={24} lg={10}>
						<XPDisplay />
						<BaseCard style={{ marginTop: 16 }}>
							<Title level={5} style={{ color: palette.navy }}>
								Пользователь
							</Title>
							<UserIdentity
								nickname={user?.nickname}
								nicknameColor={user?.nickname_color}
								customStatus={user?.custom_status}
								avatarUrl={user?.avatar_url}
								coins={coins}
								showCoins
								subtitle={roleLabel}
							/>
							<Text
								style={{ display: 'block', color: palette.navy, marginTop: 12 }}
							>
								Почта: {user?.email}
							</Text>
							<Row gutter={12} style={{ marginTop: 12 }}>
								<Col span={12}>
									<Statistic title='XP' value={progress.data.xp} />
								</Col>
								<Col span={12}>
									<Statistic
										title='Уроков завершено'
										value={progress.data.completed_lessons}
									/>
								</Col>
							</Row>
						</BaseCard>
						<div style={{ marginTop: 16 }}>
							<ParentLinkForm />
						</div>
					</Col>

					<Col xs={24} lg={14}>
						<BaseCard
							title='Достижения'
							styles={{ header: { borderBottom: 'none' } }}
						>
							{achievements.isLoading && <Spin />}
							{!achievements.isLoading &&
								(achievements.data ?? []).length === 0 && (
									<Empty description='Пока нет достижений' />
								)}
							<Row gutter={[12, 12]}>
								{(achievements.data ?? []).map((achievement) => (
									<Col key={achievement.id} xs={24} md={12}>
										<BaseCard size='small'>
											<Text strong style={{ color: palette.navy }}>
												{achievement.title}
											</Text>
											<div
												style={{ color: palette.textSecondary, marginTop: 6 }}
											>
												{achievement.description ||
													'Достижение открывается по мере прогресса'}
											</div>
											{typeof achievement.reward_coins === 'number' &&
												achievement.reward_coins > 0 && (
													<Tag color='gold' style={{ marginTop: 8 }}>
														+{achievement.reward_coins} монет
													</Tag>
												)}
										</BaseCard>
									</Col>
								))}
							</Row>
						</BaseCard>

						<div style={{ marginTop: 16 }}>
							<ShopPanel coins={coins} />
						</div>
					</Col>
				</Row>
			</div>
		</div>
	);
};

