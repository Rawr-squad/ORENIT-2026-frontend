import { Table, Tag, Typography } from 'antd';
import { useLeaderboard } from '@/features/leaderboard/api/useLeaderboard';
import type { LeaderboardUser } from '@/features/progress/api/progress.types';
import { palette } from '@/shared/config/theme';
import { UserIdentity } from '@/shared/ui/user/UserIdentity';

const { Title } = Typography;

export const LeaderboardTable = () => {
	const { data, isLoading } = useLeaderboard();

	const columns = [
		{
			title: 'Место',
			render: (_: unknown, __: LeaderboardUser, index: number) => index + 1,
		},
		{
			title: 'Ученик',
			render: (row: LeaderboardUser) => (
				<UserIdentity
					nickname={row.nickname}
					nicknameColor={row.nickname_color}
					customStatus={row.custom_status}
					avatarUrl={row.avatar_url}
					size={30}
				/>
			),
		},
		{
			title: 'Монеты',
			dataIndex: 'coins',
			render: (value: number | undefined) => <Tag color='gold'>{value ?? 0}</Tag>,
		},
		{
			title: 'XP',
			dataIndex: 'xp',
			render: (value: number) => <Tag color='processing'>{value}</Tag>,
		},
	];

	return (
		<div style={{ marginTop: 8 }}>
			<Title level={4} style={{ color: palette.navy }}>
				Рейтинг
			</Title>
			<Table
				rowKey={(row) => row.id ?? row.user_id}
				loading={isLoading}
				dataSource={data}
				columns={columns}
				pagination={false}
			/>
		</div>
	);
};
