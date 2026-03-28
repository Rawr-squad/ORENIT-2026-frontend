import { useAuthStore } from '@/entities/user/model/auth.store';
import { palette } from '@/shared/config/theme';
import { Input, Button } from 'antd';
import { useEffect, useState, useRef } from 'react';
import { connectChat, subscribeChat, sendMessage } from '../api/chat.socket';

type Message = {
	id: string;
	text: string;
	user_id: number;
	nickname?: string;
	nickname_color?: string | null;
};

export const ChatWidget = () => {
	const user = useAuthStore((s) => s.user);

	const [messages, setMessages] = useState<Message[]>([]);
	const [input, setInput] = useState('');

	const bottomRef = useRef<HTMLDivElement | null>(null);
	const connectedRef = useRef(false);

	useEffect(() => {
		if (connectedRef.current) return;
		connectedRef.current = true;

		connectChat();

		const unsubscribe = subscribeChat((raw: any) => {
			if (raw.type !== 'message') return;

			let parsedText = raw.text;

			try {
				const inner = JSON.parse(raw.text);
				parsedText = inner.message;
			} catch {}

			setMessages((prev) => [
				...prev,
				{
					id: raw.timestamp,
					text: parsedText,
					user_id: raw.user_id,
					nickname: raw.nickname,
					nickname_color: raw.nickname_color,
				},
			]);
		});

		return unsubscribe;
	}, []);

	useEffect(() => {
		bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
	}, [messages]);

	const handleSend = () => {
		if (!input.trim()) return;

		sendMessage({ message: input });
		setInput('');
	};

	return (
		<div
			style={{
				display: 'flex',
				flexDirection: 'column',
				height: '100%',
				minHeight: 0,
				border: `1px solid ${palette.borderSoft}`,
				borderRadius: 16,
				background: '#fff',
				overflow: 'hidden',
			}}
		>
			{/* сообщения */}
			<div
				style={{
					flex: 1,
					minHeight: 0,
					padding: 12,
					overflowY: 'auto',
					overflowX: 'hidden', // 💥 убрали горизонтальный скролл
				}}
			>
				{messages.map((msg) => {
					const isMine = msg.user_id === user?.id;

					return (
						<div
							key={msg.id}
							style={{
								display: 'flex',
								justifyContent: isMine ? 'flex-end' : 'flex-start',
								marginBottom: 8,
							}}
						>
							<div
								style={{
									padding: '8px 12px',
									borderRadius: 12,
									background: isMine ? '#D2F8D2' : '#F5F5F5',
									maxWidth: '70%',
									wordBreak: 'break-word', // 💥 фикс длинных строк
								}}
							>
								<div
									style={{
										fontSize: 12,
										color: msg.nickname_color || '#999',
									}}
								>
									{msg.nickname}
								</div>
								<div>{msg.text}</div>
							</div>
						</div>
					);
				})}

				<div ref={bottomRef} />
			</div>

			{/* input */}
			<div
				style={{
					display: 'flex',
					gap: 8,
					padding: 8,
					borderTop: `1px solid ${palette.borderSoft}`,
				}}
			>
				<Input
					value={input}
					onChange={(e) => setInput(e.target.value)}
					onPressEnter={handleSend}
				/>
				<Button type='primary' onClick={handleSend}>
					Отправить
				</Button>
			</div>
		</div>
	);
};
