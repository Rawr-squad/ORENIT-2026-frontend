import { Table, Typography } from 'antd';
import { useLeaderboard } from '@/features/leaderboard/api/useLeaderboard';
import type { LeaderboardUser } from '@/entities/user/model/leaderboard.types';

const { Title } = Typography;

export const LeaderboardTable = () => {
	const { data, isLoading } = useLeaderboard();

	const columns = [
		{
			title: 'Место',
			render: (_: unknown, __: LeaderboardUser, index: number) => index + 1,
		},
		{
			title: 'User ID',
			dataIndex: 'user_id',
		},
		{
			title: 'XP',
			dataIndex: 'xp',
		},
	];

	return (
		<div style={{ marginTop: 24 }}>
			<Title level={3}>Лидерборд</Title>

			<Table
				rowKey='user_id'
				loading={isLoading}
				dataSource={data}
				columns={columns}
				pagination={false}
			/>
		</div>
	);
};
