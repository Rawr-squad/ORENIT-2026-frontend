import { Progress, Space, Tag, Typography } from 'antd';
import { useUserStore } from '@/entities/user/model/user.store';
import { palette } from '@/shared/config/theme';
import { BaseCard } from '@/shared/ui/card/BaseCard';

const { Text, Title } = Typography;

export const XPDisplay = () => {
	const { xp, level, completedLessons } = useUserStore();

	const xpForNextLevel = 100;
	const progressPercent = xp % xpForNextLevel;

	return (
		<BaseCard>
			<Space orientation='vertical' size={8} style={{ width: '100%' }}>
				<Space align='center'>
					<Title level={5} style={{ margin: 0, color: palette.navy }}>
						Уровень {level}
					</Title>
					<Tag>{xp} XP</Tag>
				</Space>
				<Progress percent={progressPercent} showInfo={false} status='active' />
				<Text style={{ color: palette.textSecondary }}>
					{xpForNextLevel - progressPercent} XP до следующего уровня
				</Text>
				<Text style={{ color: palette.navy }}>
					Завершенные уроки: {completedLessons}
				</Text>
			</Space>
		</BaseCard>
	);
};

