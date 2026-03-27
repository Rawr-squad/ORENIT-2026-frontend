import {
	BookOutlined,
	DashboardOutlined,
	TrophyOutlined,
	UserOutlined,
	TeamOutlined,
	ReadOutlined,
	CheckSquareOutlined,
	ShopOutlined,
	StarOutlined,
} from '@ant-design/icons';
import type { MenuProps } from 'antd';
import type { Role } from '@/shared/types/auth';

export const navByRole: Record<Role, NonNullable<MenuProps['items']>> = {
	student: [
		{
			key: '/student/dashboard',
			icon: <DashboardOutlined />,
			label: 'Главная',
		},
		{ key: '/student/courses', icon: <BookOutlined />, label: 'Курсы' },
		{ key: '/student/leaderboard', icon: <TrophyOutlined />, label: 'Рейтинг' },
		{ key: '/student/shop', icon: <ShopOutlined />, label: 'Магазин' },
		{ key: '/student/profile', icon: <UserOutlined />, label: 'Профиль' },
	],
	parent: [
		{ key: '/parent/dashboard', icon: <DashboardOutlined />, label: 'Главная' },
		{
			key: '/parent/progress',
			icon: <TeamOutlined />,
			label: 'Прогресс ребенка',
		},
		{ key: '/parent/profile', icon: <UserOutlined />, label: 'Профиль' },
	],
	admin: [
		{ key: '/admin/dashboard', icon: <DashboardOutlined />, label: 'Главная' },
		{ key: '/admin/courses', icon: <ReadOutlined />, label: 'Курсы' },
		{
			key: '/admin/profile',
			icon: <CheckSquareOutlined />,
			label: 'Проверка кода',
		},
		{ key: '/admin/shop', icon: <ShopOutlined />, label: 'Магазин' },
		{ key: '/admin/achievements', icon: <StarOutlined />, label: 'Достижения' },
	],
};

