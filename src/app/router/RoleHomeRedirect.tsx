import { Spin } from 'antd';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '@/entities/user/model/auth.store';
import { getRoleHomePath } from '@/shared/lib/get-role-home-path';
import { useMe } from '@/features/auth/api/useMe';

export const RoleHomeRedirect = () => {
	const { token, user, hydrated } = useAuthStore();
	const me = useMe();

	if (!hydrated) {
		return <Spin style={{ marginTop: 48 }} />;
	}

	if (!token) {
		return <Navigate to='/login' replace />;
	}

	if (!user && me.isLoading) {
		return <Spin style={{ marginTop: 48 }} />;
	}

	if (!user) {
		return <Navigate to='/login' replace />;
	}

	return <Navigate to={getRoleHomePath(user.role)} replace />;
};
