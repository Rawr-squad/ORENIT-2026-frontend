import { Card, Typography, Progress } from 'antd';
import { useUserStore } from '@/entities/user/model/user.store';

const { Text } = Typography;

export const XPDisplay = () => {
	const { xp, level, completedLessons } = useUserStore();

	const xpForNextLevel = 100;
	const progressPercent = (xp % xpForNextLevel) * 1;

	return (
		<Card style={{ marginBottom: 16 }}>
			<Text strong>Уровень: {level}</Text>
			<br />

			<Text>XP: {xp}</Text>

			<Progress percent={progressPercent} showInfo={false} status='active' />

			<Text>
				До следующего уровня: {xpForNextLevel - (xp % xpForNextLevel)}
			</Text>

			<br />
			<br />

			<Text>Пройдено уроков: {completedLessons}</Text>
		</Card>
	);
};
