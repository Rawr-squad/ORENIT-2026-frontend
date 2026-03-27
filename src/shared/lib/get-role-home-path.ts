import type { Role } from '@/shared/types/auth';

export const getRoleHomePath = (role: Role) => {
	switch (role) {
		case 'admin':
			return '/admin/dashboard';
		case 'parent':
			return '/parent/dashboard';
		case 'student':
		default:
			return '/student/dashboard';
	}
};

