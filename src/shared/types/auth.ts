export type Role = 'student' | 'admin' | 'parent';

export type LoginRequest = {
	email: string;
	password: string;
};

export type LoginResponse = {
	token: string;
	role: Role;
};

export type RegisterRequest = {
	email: string;
	password: string;
};

export type RegisterResponse = {
	success: boolean;
};
