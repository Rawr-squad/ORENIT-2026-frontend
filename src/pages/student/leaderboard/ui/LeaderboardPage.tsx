import { LeaderboardTable } from '@/widgets/leaderboard/ui/LeaderBoardTable';
import { PageHeader } from '@/shared/ui/layout/PageHeader';
import { BaseCard } from '@/shared/ui/card/BaseCard';

export const LeaderboardPage = () => {
	return (
		<div>
			<PageHeader
				title='Рейтинг'
				subtitle='Топ учеников по XP, монетам и кастомизации профиля'
			/>
			<div style={{ padding: 24 }}>
				<BaseCard>
					<LeaderboardTable />
				</BaseCard>
			</div>
		</div>
	);
};

