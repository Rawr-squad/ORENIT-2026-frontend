export type Role = 'student' | 'admin' | 'parent';

export type User = {
	id: number;
	email: string;
	nickname: string;
	role: Role;
	xp?: number;
	coins?: number;
	avatar_url?: string;
	nickname_color?: string;
	custom_status?: string;
	owned_color_ids?: number[];
	owned_status_ids?: number[];
};

export type LoginRequest = {
	email: string;
	password: string;
};

export type LoginResponse = {
	access_token: string;
	token?: string;
};

export type RegisterRequest = {
	email: string;
	password: string;
	nickname: string;
	role: Exclude<Role, 'admin'>;
};

