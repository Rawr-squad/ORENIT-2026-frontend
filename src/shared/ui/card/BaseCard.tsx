import { palette } from '@/shared/config/theme';
import { Card } from 'antd';
import type { CardProps } from 'antd';

export const BaseCard = (props: CardProps) => {
	return (
		<Card
			{...props}
			style={{
				borderRadius: 16,
				border: `1px solid ${palette.borderSoft}`,
				...props.style,
			}}
		/>
	);
};
