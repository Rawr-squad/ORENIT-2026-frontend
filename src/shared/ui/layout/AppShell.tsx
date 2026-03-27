import {
	LogoutOutlined,
	MenuUnfoldOutlined,
} from '@ant-design/icons';
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

export const AppShell = () => {
	const { user, logout } = useAuthStore();
	const queryClient = useQueryClient();
	const navigate = useNavigate();
	const location = useLocation();
	const screens = useBreakpoint();
	const [open, setOpen] = useState(false);

	const role = user?.role;

	const menuItems = useMemo(() => {
		if (!role) {
			return [];
		}

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

	if (!role) {
		return null;
	}

	const roleLabelByRole = {
		student: 'Студент',
		parent: 'Родитель',
		admin: 'Администратор',
	} as const;
	const roleLabel = roleLabelByRole[role];
	const profilePath = getRoleProfilePath(role);

	const sidebar = (
		<div style={{ display: 'flex', flexDirection: 'column', minHeight: '100%' }}>
			<div
				style={{
					padding: 16,
					fontWeight: 800,
					color: palette.navy,
					fontSize: 22,
					display: 'flex',
					alignItems: 'center',
					gap: 10,
				}}
			>
				<div
					style={{
						width: 34,
						height: 34,
						borderRadius: 12,
						background:
							'linear-gradient(135deg, #F8FFA1 0%, #F6D8EE 50%, #A8A3F6 100%)',
					}}
				/>
				CodeStart
			</div>

			<div style={{ paddingInline: 16, marginBottom: 12 }}>
				<div
					role='button'
					onClick={() => {
						navigate(profilePath);
						setOpen(false);
					}}
					style={{
						cursor: 'pointer',
						padding: 8,
						borderRadius: 12,
						transition: 'background-color 0.2s ease',
					}}
					onMouseEnter={(event) => {
						event.currentTarget.style.backgroundColor = '#FFF7C7';
					}}
					onMouseLeave={(event) => {
						event.currentTarget.style.backgroundColor = 'transparent';
					}}
				>
					<UserIdentity
						nickname={user?.nickname}
						nicknameColor={user?.nickname_color}
						customStatus={user?.custom_status}
						avatarUrl={user?.avatar_url}
						coins={user?.coins}
						showCoins
						subtitle={roleLabel}
					/>
				</div>
			</div>

			<Menu
				mode='inline'
				selectedKeys={[selectedKey]}
				items={menuItems}
				onClick={handleNavigate}
				style={{ borderRight: 'none', paddingInline: 8, flex: 1 }}
			/>

			<div style={{ marginTop: 'auto', padding: 16 }}>
				<Button icon={<LogoutOutlined />} block onClick={handleLogout}>
					Выйти
				</Button>
			</div>
		</div>
	);

	return (
		<Layout style={{ minHeight: '100vh', background: palette.bgBase }}>
			{screens.lg && (
				<Sider
					width={260}
					style={{
						background: palette.bgContainer,
						borderRight: `1px solid ${palette.borderSoft}`,
						position: 'sticky',
						top: 0,
						height: '100vh',
						overflow: 'auto',
					}}
				>
					{sidebar}
				</Sider>
			)}

			<Drawer
				title='Навигация'
				open={open}
				onClose={() => setOpen(false)}
				placement='left'
				styles={{ body: { padding: 0 } }}
			>
				{sidebar}
			</Drawer>

			<Layout>
				<Content style={{ minHeight: '100vh' }}>
					{!screens.lg && (
						<Button
							icon={<MenuUnfoldOutlined />}
							onClick={() => setOpen(true)}
							style={{
								position: 'fixed',
								left: 12,
								top: 12,
								zIndex: 1000,
								borderColor: palette.pink,
								background: '#FFF7C7',
								color: palette.navy,
							}}
						/>
					)}
					<Outlet />
				</Content>
			</Layout>
		</Layout>
	);
};
