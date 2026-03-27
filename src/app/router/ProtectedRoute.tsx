import { Navigate } from 'react-router-dom';
import { useAuthStore } from '@/entities/user/model/auth.store';

type Props = {
	children: React.ReactNode;
	roles?: ('student' | 'admin' | 'parent')[];
};

export const ProtectedRoute = ({ children, roles }: Props) => {
	const { token, role } = useAuthStore();

	//  не авторизован
	if (!token) {
		return <Navigate to='/login' replace />;
	}

	//  не та роль
	if (roles && role && !roles.includes(role)) {
		return <Navigate to='/' replace />;
	}

	return children;
};
