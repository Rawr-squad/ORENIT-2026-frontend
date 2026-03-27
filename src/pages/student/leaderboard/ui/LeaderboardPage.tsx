import { Card } from 'antd';
import { LeaderboardTable } from '@/widgets/leaderboard/ui/LeaderBoardTable';
import { PageHeader } from '@/shared/ui/layout/PageHeader';
import { palette } from '@/shared/config/theme';

export const LeaderboardPage = () => {
	return (
		<div>
			<PageHeader
				title='Рейтинг'
				subtitle='Топ учеников по XP, монетам и кастомизации профиля'
			/>
			<div style={{ padding: 24 }}>
				<Card style={{ borderColor: palette.pink }}>
					<LeaderboardTable />
				</Card>
			</div>
		</div>
	);
};

