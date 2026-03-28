import { Layout, Menu } from 'antd';
import {
	HomeOutlined,
	TrophyOutlined,
	SettingOutlined,
} from '@ant-design/icons';
import { Link, useLocation } from 'react-router-dom';

const { Sider } = Layout;

export const Sidebar = () => {
	const location = useLocation();

	const selectedKey = location.pathname.split('/').slice(0, 3).join('/');

	return (
		<Sider
			width={240}
			style={{
				background: '#ffffff',
				borderRight: '1px solid #f0f0f0',
			}}
		>
			<div
				style={{
					padding: 20,
					fontWeight: 800,
					fontSize: 18,
				}}
			>
				CodeStart
			</div>

			<Menu
				mode='inline'
				selectedKeys={[selectedKey]}
				items={[
					{
						key: '/',
						icon: <HomeOutlined />,
						label: <Link to='/'>Дашборд</Link>,
					},
					{
						key: '/leaderboard',
						icon: <TrophyOutlined />,
						label: <Link to='/leaderboard'>Рейтинг</Link>,
					},
					{
						key: '/admin',
						icon: <SettingOutlined />,
						label: <Link to='/admin'>Админ</Link>,
					},
				]}
			/>
		</Sider>
	);
};
