import type { ReactNode } from 'react';
import { palette } from '@/shared/config/theme';

type PageHeaderProps = {
	title: string;
	subtitle?: string;
	rightSlot?: ReactNode;
};

export const PageHeader = ({ title, subtitle, rightSlot }: PageHeaderProps) => {
	return (
		<div
			style={{
				width: '100%',
				flexShrink: 0,
				padding: '16px 24px',
				background: palette.bgContainer,
				display: 'flex',
				justifyContent: 'space-between',
				alignItems: 'center',
				borderBottom: `1px solid ${palette.borderSoft}`,
				position: 'sticky',
				top: 0,
				zIndex: 10,
			}}
		>
			<div>
				<div
					style={{
						fontSize: 22,
						fontWeight: 700,
						color: palette.navy,
					}}
				>
					{title}
				</div>

				{subtitle && (
					<div style={{ fontSize: 14, color: palette.textSecondary }}>
						{subtitle}
					</div>
				)}
			</div>

			{rightSlot}
		</div>
	);
};

