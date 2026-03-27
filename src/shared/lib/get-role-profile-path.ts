import type { Role } from '@/shared/types/auth';

export const getRoleProfilePath = (role: Role) => {
	switch (role) {
		case 'admin':
			return '/admin/profile';
		case 'parent':
			return '/parent/profile';
		case 'student':
		default:
			return '/student/profile';
	}
};
