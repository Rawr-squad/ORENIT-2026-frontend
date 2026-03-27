export type Role = 'student' | 'admin' | 'parent';

export type User = {
	id: number;
	email: string;
	nickname: string;
	role: Role;
};

export type LoginRequest = {
	email: string;
	password: string;
};

export type LoginResponse = {
	access_token: string;
	token: string;
	user: User;
};

export type RegisterRequest = User & {
	role: Exclude<Role, 'admin'>;
};

export type RegisterResponse = {
	success: boolean;
};
