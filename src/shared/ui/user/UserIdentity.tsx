import { Avatar, Space, Tag, Typography } from 'antd';
import { palette } from '@/shared/config/theme';

const { Text } = Typography;

const getInitial = (nickname?: string) => {
	if (!nickname || nickname.trim().length === 0) {
		return 'U';
	}

	return nickname.trim().slice(0, 1).toUpperCase();
};

const toSafeColor = (value?: string) => {
	if (!value) {
		return undefined;
	}

	const color = value.trim();
	if (/^#([0-9A-F]{3}|[0-9A-F]{6}|[0-9A-F]{8})$/i.test(color)) {
		return color;
	}
	if (/^(rgb|rgba|hsl|hsla)\(/i.test(color)) {
		return color;
	}

	return undefined;
};

type Props = {
	nickname?: string;
	nicknameColor?: string;
	customStatus?: string;
	avatarUrl?: string;
	coins?: number;
	size?: number;
	showCoins?: boolean;
	subtitle?: string;
};

export const UserIdentity = ({
	nickname,
	nicknameColor,
	customStatus,
	avatarUrl,
	coins,
	size = 36,
	showCoins = false,
	subtitle,
}: Props) => {
	const safeColor = toSafeColor(nicknameColor);

	return (
		<Space size={10} align='center'>
			<Avatar
				size={size}
				src={avatarUrl}
				style={{ background: palette.pink, color: palette.navy, flexShrink: 0 }}
			>
				{getInitial(nickname)}
			</Avatar>
			<div style={{ minWidth: 0 }}>
				<div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
					<Text
						strong
						style={{
							color: safeColor ?? palette.navy,
							lineHeight: 1.2,
						}}
						ellipsis
					>
						{nickname || 'Пользователь'}
					</Text>
					{customStatus && <Tag color='magenta'>{customStatus}</Tag>}
					{showCoins && typeof coins === 'number' && <Tag color='gold'>{coins} монет</Tag>}
				</div>
				{subtitle && (
					<div style={{ color: palette.textSecondary, fontSize: 12, marginTop: 2 }}>
						{subtitle}
					</div>
				)}
			</div>
		</Space>
	);
};
