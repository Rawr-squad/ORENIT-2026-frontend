import { Navigate } from 'react-router-dom';
import { Spin } from 'antd';
import { useAuthStore } from '@/entities/user/model/auth.store';
import { useMe } from '@/features/auth/api/useMe';
import { getRoleHomePath } from '@/shared/lib/get-role-home-path';

type Props = {
	children: React.ReactNode;
	roles?: Array<'student' | 'admin' | 'parent'>;
};

export const ProtectedRoute = ({ children, roles }: Props) => {
	const { token, user, hydrated } = useAuthStore();
	const me = useMe();

	if (!hydrated) {
		return <Spin style={{ marginTop: 64 }} />;
	}

	if (!token) {
		return <Navigate to='/login' replace />;
	}

	if (!user && me.isLoading) {
		return <Spin style={{ marginTop: 64 }} />;
	}

	if (!user) {
		return <Navigate to='/login' replace />;
	}

	if (roles && !roles.includes(user.role)) {
		return <Navigate to={getRoleHomePath(user.role)} replace />;
	}

	return children;
};
