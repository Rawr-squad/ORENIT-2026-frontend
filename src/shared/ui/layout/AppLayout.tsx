import { LogoutOutlined, MenuUnfoldOutlined } from '@ant-design/icons';
import { Button, Drawer, Grid, Layout, Menu } from 'antd';
import { useQueryClient } from '@tanstack/react-query';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useMemo, useState } from 'react';

import { useAuthStore } from '@/entities/user/model/auth.store';
import { navByRole } from '@/shared/config/navigation';
import { palette } from '@/shared/config/theme';
import { getRoleProfilePath } from '@/shared/lib/get-role-profile-path';
import { UserIdentity } from '@/shared/ui/user/UserIdentity';

const { useBreakpoint } = Grid;
const { Sider, Content } = Layout;

const resolveSelectedKey = (pathname: string) => {
	if (
		pathname.startsWith('/student/courses') ||
		pathname.startsWith('/student/lessons')
	) {
		return '/student/courses';
	}

	if (pathname.startsWith('/admin/courses')) {
		return '/admin/courses';
	}

	return pathname;
};

export const AppLayout = () => {
	const { user, logout } = useAuthStore();
	const queryClient = useQueryClient();
	const navigate = useNavigate();
	const location = useLocation();
	const screens = useBreakpoint();

	const [open, setOpen] = useState(false);

	const role = user?.role;

	const menuItems = useMemo(() => {
		if (!role) return [];
		return navByRole[role];
	}, [role]);

	const selectedKey = resolveSelectedKey(location.pathname);

	const handleNavigate = ({ key }: { key: string }) => {
		navigate(key);
		setOpen(false);
	};

	const handleLogout = () => {
		logout();
		queryClient.clear();
		navigate('/login', { replace: true });
	};

	if (!role) return null;

	const roleLabelByRole = {
		student: 'Студент',
		parent: 'Родитель',
		admin: 'Администратор',
	} as const;

	const roleLabel = roleLabelByRole[role];
	const profilePath = getRoleProfilePath(role);

	const sidebar = (
		<div
			style={{
				display: 'flex',
				flexDirection: 'column',
				height: '100%',
			}}
		>
			{/* Logo */}
			<div
				style={{
					padding: 20,
					fontWeight: 800,
					fontSize: 20,
					color: palette.navy,
					display: 'flex',
					alignItems: 'center',
					gap: 10,
				}}
			>
				<div
					style={{
						width: 32,
						height: 32,
						borderRadius: 10,
						background:
							'linear-gradient(135deg, #F8FFA1 0%, #F6D8EE 50%, #A8A3F6 100%)',
					}}
				/>
				CodeStart
			</div>

			{/* User */}
			<div style={{ padding: '0 16px 12px' }}>
				<div
					onClick={() => {
						navigate(profilePath);
						setOpen(false);
					}}
					style={{
						cursor: 'pointer',
						padding: 10,
						borderRadius: 12,
						transition: '0.2s',
					}}
					onMouseEnter={(e) => (e.currentTarget.style.background = '#FFF7C7')}
					onMouseLeave={(e) =>
						(e.currentTarget.style.background = 'transparent')
					}
				>
					<UserIdentity
						nickname={user.nickname}
						nicknameColor={user.nickname_color}
						customStatus={user.custom_status}
						avatarUrl={user.avatar_url}
						coins={user.coins}
						showCoins
						subtitle={roleLabel}
					/>
				</div>
			</div>

			{/* Menu */}
			<Menu
				mode='inline'
				selectedKeys={[selectedKey]}
				items={menuItems}
				onClick={handleNavigate}
				style={{
					borderRight: 'none',
					paddingInline: 8,
					flex: 1,
				}}
			/>

			{/* Logout */}
			<div style={{ padding: 16 }}>
				<Button icon={<LogoutOutlined />} block onClick={handleLogout}>
					Выйти
				</Button>
			</div>
		</div>
	);

	return (
		<Layout style={{ minHeight: '100vh', background: palette.bgBase }}>
			{/* Desktop sidebar */}
			{screens.lg && (
				<Sider
					width={260}
					style={{
						background: palette.bgContainer,
						borderRight: `1px solid ${palette.borderSoft}`,
						position: 'sticky',
						top: 0,
						height: '100vh',
					}}
				>
					{sidebar}
				</Sider>
			)}

			{/* Mobile */}
			<Drawer
				open={open}
				onClose={() => setOpen(false)}
				placement='left'
				styles={{ body: { padding: 0 } }}
			>
				{sidebar}
			</Drawer>

			<Layout>
				<Content
					style={{
						minHeight: '100vh',
						// padding: 24,
						// maxWidth: 1200,
						// margin: '0 auto',
						width: '100%',
					}}
				>
					{/* Mobile button */}
					{!screens.lg && (
						<Button
							icon={<MenuUnfoldOutlined />}
							onClick={() => setOpen(true)}
							style={{
								position: 'fixed',
								left: 12,
								top: 12,
								zIndex: 1000,
								background: '#FFF7C7',
							}}
						/>
					)}

					<Outlet />
				</Content>
			</Layout>
		</Layout>
	);
};
