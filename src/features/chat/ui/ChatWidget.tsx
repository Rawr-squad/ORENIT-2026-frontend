import { useAuthStore } from '@/entities/user/model/auth.store';
import { palette } from '@/shared/config/theme';
import { Input, Button, Empty } from 'antd';
import { useEffect, useState, useRef } from 'react';
import { connectChat, subscribeChat, sendMessage } from '../api/chat.socket';

type Message = {
	id: string;
	text: string;
	user_id: number;
	nickname?: string;
	nickname_color?: string | null;
	status?: string;
	timestamp?: string;
};

const formatTime = (ts?: string) => {
	if (!ts) return '';

	const date = new Date(ts);
	return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

export const ChatWidget = () => {
	const user = useAuthStore((s) => s.user);

	const [messages, setMessages] = useState<Message[]>([]);
	const [input, setInput] = useState('');

	const bottomRef = useRef<HTMLDivElement | null>(null);

	useEffect(() => {
		const unsubscribe = subscribeChat((raw: any) => {
			let parsedText = raw.text;

			try {
				const inner = JSON.parse(raw.text);
				parsedText = inner.message;
			} catch {}

			setMessages((prev) => [
				...prev,
				{
					id: `${raw.timestamp}-${raw.user_id}`,
					text: parsedText,
					user_id: raw.user_id,
					nickname: raw.nickname,
					nickname_color: raw.nickname_color,
					status: raw.status,
					timestamp: raw.timestamp,
				},
			]);
		});

		connectChat();

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
				height: 420,
				display: 'flex',
				flexDirection: 'column',
				border: `1px solid ${palette.borderSoft}`,
				borderRadius: 16,
				background: '#fff',
				boxShadow: '0 4px 16px rgba(0,0,0,0.05)',
			}}
		>
			{/* HEADER */}
			<div
				style={{
					padding: '10px 14px',
					borderBottom: `1px solid ${palette.borderSoft}`,
					fontWeight: 600,
					color: palette.navy,
				}}
			>
				Общий чат
			</div>

			{/* MESSAGES */}
			<div
				style={{
					flex: 1,
					padding: 12,
					overflowY: 'auto',
					display: 'flex',
					flexDirection: 'column',
					gap: 8,
				}}
			>
				{messages.length === 0 && <Empty description='Пока нет сообщений' />}

				{messages.map((msg) => {
					const isMine = msg.user_id === user?.id;

					return (
						<div
							key={msg.id}
							style={{
								display: 'flex',
								flexDirection: 'column',
								alignItems: isMine ? 'flex-end' : 'flex-start',
							}}
						>
							<div
								style={{
									fontSize: 12,
									color: msg.nickname_color || '#888',
									marginBottom: 2,
								}}
							>
								{msg.nickname}
								{msg.status && (
									<span style={{ marginLeft: 6, opacity: 0.6 }}>
										• {msg.status}
									</span>
								)}
							</div>

							<div
								style={{
									padding: '10px 14px',
									borderRadius: 14,
									background: isMine
										? 'linear-gradient(135deg, #D2F8D2, #B8F1B8)'
										: '#F5F7FB',
									maxWidth: '70%',
									boxShadow: '0 2px 6px rgba(0,0,0,0.06)',
								}}
							>
								<div style={{ color: palette.navy }}>{msg.text}</div>

								<div
									style={{
										fontSize: 11,
										marginTop: 4,
										opacity: 0.6,
										textAlign: 'right',
									}}
								>
									{formatTime(msg.timestamp)}
								</div>
							</div>
						</div>
					);
				})}

				<div ref={bottomRef} />
			</div>

			{/* INPUT */}
			<div
				style={{
					display: 'flex',
					gap: 8,
					padding: 10,
					borderTop: `1px solid ${palette.borderSoft}`,
				}}
			>
				<Input
					placeholder='Написать сообщение...'
					value={input}
					onChange={(e) => setInput(e.target.value)}
					onPressEnter={handleSend}
					style={{
						borderRadius: 10,
					}}
				/>
				<Button
					type='primary'
					onClick={handleSend}
					style={{
						borderRadius: 10,
						fontWeight: 600,
					}}
				>
					Отправить
				</Button>
			</div>
		</div>
	);
};
