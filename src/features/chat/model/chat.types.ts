export type ChatMessageRaw = {
	type: 'message';
	user_id: number;
	nickname: string;
	nickname_color?: string | null;
	status?: string;
	text: string;
	timestamp: string;
};

export type ChatMessage = {
	id: string;
	text: string;
	user_id: number;
	nickname?: string;
};
