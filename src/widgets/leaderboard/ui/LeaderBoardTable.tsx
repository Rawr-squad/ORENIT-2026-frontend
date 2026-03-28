import { Table, Tag, Typography, Avatar, Space } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { TrophyOutlined } from '@ant-design/icons';
import { useLeaderboard } from '@/features/leaderboard/api/useLeaderboard';
import { useMyAchievements } from '@/features/achievement/api/useMyAchievements';
import { useAuthStore } from '@/entities/user/model/auth.store';
import type { LeaderboardUser } from '@/features/progress/api/progress.types';
import { palette } from '@/shared/config/theme';

const { Text } = Typography;

const RANK_STYLES: Record<number, { color: string; icon: string }> = {
	1: { color: '#FFD700', icon: '🥇' },
	2: { color: '#C0C0C0', icon: '🥈' },
	3: { color: '#CD7F32', icon: '🥉' },
};

const toSafeColor = (value?: string): string | undefined => {
	if (!value) return undefined;
	const c = value.trim();
	if (/^#([0-9A-F]{3}|[0-9A-F]{6})$/i.test(c)) return c;
	if (/^(rgb|rgba|hsl|hsla)\(/i.test(c)) return c;
	return undefined;
};

const getInitial = (nickname?: string) =>
	nickname?.trim().slice(0, 1).toUpperCase() ?? 'U';

export const LeaderboardTable = () => {
	const { data, isLoading } = useLeaderboard();
	const currentUser = useAuthStore((s) => s.user);
	const myAchievements = useMyAchievements();

	const columns: ColumnsType<LeaderboardUser> = [
		{
			title: '#',
			width: 56,
			render: (_: unknown, __: LeaderboardUser, index: number) => {
				const rank = index + 1;
				const style = RANK_STYLES[rank];
				return style ? (
					<span style={{ fontSize: 20 }}>{style.icon}</span>
				) : (
					<Text style={{ color: palette.textSecondary, fontWeight: 600 }}>
						{rank}
					</Text>
				);
			},
		},
		{
			title: 'Ученик',
			render: (row: LeaderboardUser) => {
				const safeColor = toSafeColor(row.nickname_color);
				const isMe = currentUser?.id === (row.id ?? row.user_id);
				return (
					<Space size={10} align='center'>
						<Avatar
							size={36}
							src={row.avatar_url}
							style={{
								background: palette.pink,
								color: palette.navy,
								flexShrink: 0,
							}}
						>
							{getInitial(row.nickname)}
						</Avatar>
						<div>
							<div
								style={{
									display: 'flex',
									alignItems: 'center',
									gap: 6,
									flexWrap: 'wrap',
								}}
							>
								<Text
									strong
									style={{
										color: safeColor ?? palette.navy,
										fontSize: 15,
									}}
								>
									{row.nickname ?? `User #${row.user_id}`}
								</Text>
								{isMe && (
									<Tag color='processing' style={{ fontSize: 11 }}>
										Вы
									</Tag>
								)}
								{row.custom_status && (
									<Tag color='magenta' style={{ fontSize: 11 }}>
										{row.custom_status}
									</Tag>
								)}
							</div>
						</div>
					</Space>
				);
			},
		},
		{
			title: 'XP',
			dataIndex: 'xp',
			width: 90,
			sorter: (a: LeaderboardUser, b: LeaderboardUser) =>
				(b.xp ?? 0) - (a.xp ?? 0),
			render: (value: number) => (
				<Tag color='purple' style={{ fontWeight: 700 }}>
					{value ?? 0}
				</Tag>
			),
		},
		{
			title: 'Монеты',
			dataIndex: 'coins',
			width: 100,
			render: (value: number | undefined) => (
				<Tag color='gold' style={{ fontWeight: 700 }}>
					{value ?? 0}
				</Tag>
			),
		},
		{
			title: (
				<span>
					<TrophyOutlined style={{ marginRight: 4 }} />
					Достиж.
				</span>
			),
			width: 90,
			render: (row: LeaderboardUser) => {
				const isMe = currentUser?.id === (row.id ?? row.user_id);
				const count = isMe ? (myAchievements.data?.length ?? 0) : '—';
				return (
					<Text style={{ color: palette.textSecondary, fontWeight: 600 }}>
						{count}
					</Text>
				);
			},
		},
	];

	return (
		<Table
			rowKey={(row) => String(row.id ?? row.user_id)}
			loading={isLoading}
			dataSource={data}
			columns={columns}
			pagination={false}
			rowClassName={(_, index) => (index < 3 ? 'leaderboard-top' : '')}
			onRow={(row, index) => ({
				style: {
					background:
						currentUser?.id === (row.id ?? row.user_id)
							? '#F8FFA1'
							: index !== undefined && index < 3
								? '#FFFDF5'
								: undefined,
					fontWeight:
						currentUser?.id === (row.id ?? row.user_id) ? 700 : undefined,
				},
			})}
		/>
	);
};

