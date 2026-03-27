import { Layout } from 'antd';
import type { ReactNode } from 'react';
import { palette } from '@/shared/config/theme';

const { Header } = Layout;

type PageHeaderProps = {
	title: string;
	subtitle?: string;
	rightSlot?: ReactNode;
};

export const PageHeader = ({ title, subtitle, rightSlot }: PageHeaderProps) => {
	return (
		<Header
			style={{
				paddingInline: 24,
				background: palette.bgContainer,
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'space-between',
				borderBottom: `1px solid ${palette.borderSoft}`,
				boxSizing: 'border-box',
				height: 72,
				position: 'sticky',
				top: 0,
				zIndex: 10,
			}}
		>
			<div
				style={{
					display: 'flex',
					flexDirection: 'column',
					justifyContent: 'center',
					lineHeight: 1.2,
				}}
			>
				<div
					style={{
						fontSize: 24,
						fontWeight: 700,
						color: palette.navy,
						marginBottom: subtitle ? 4 : 0,
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
			{rightSlot && <div>{rightSlot}</div>}
		</Header>
	);
};

