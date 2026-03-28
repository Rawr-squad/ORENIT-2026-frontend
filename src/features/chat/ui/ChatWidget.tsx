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

	const [isConnected, setIsConnected] = useState(false);
	const [messages, setMessages] = useState<Message[]>([]);
	const [input, setInput] = useState('');

	const bottomRef = useRef<HTMLDivElement | null>(null);
	const connectedRef = useRef(false);

	useEffect(() => {
		if (connectedRef.current) return;
		connectedRef.current = true;

		const socket = connectChat();

		socket.onopen = () => {
			console.log('WS connected');
			setIsConnected(true);
		};

		socket.onerror = (e: any) => {
			console.error('WS error', e);
		};

		const unsubscribe = subscribeChat((raw: any) => {
			if (!raw) return;

			console.log('WS:', raw);

			if (raw.type === 'system') {
				setMessages((prev) => [
					...prev,
					{
						id: Date.now().toString(),
						text: raw.message ?? 'system message',
						user_id: 0,
						nickname: 'system',
					},
				]);
				return;
			}

			if (raw.type === 'message') {
				let text = raw.text ?? '';

				// фикс JSON-строк
				if (typeof text === 'string') {
					try {
						const parsed = JSON.parse(text);
						if (parsed?.message) text = parsed.message;
					} catch {}
				}

				setMessages((prev) => [
					...prev,
					{
						id: String(raw.timestamp ?? Date.now()),
						text: String(text),
						user_id: Number(raw.user_id ?? 0),
						nickname: raw.nickname ?? 'user',
						nickname_color: raw.nickname_color ?? null,
					},
				]);
			}
		});

		return unsubscribe;
	}, []);

	useEffect(() => {
		bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
	}, [messages]);

	const handleSend = () => {
		const text = input.trim();
		if (!text) return;

		if (!isConnected) {
			console.warn('WS not connected');
			return;
		}

		// optimistic UI (чтобы сразу видно было сообщение)
		const tempMessage: Message = {
			id: 'temp-' + Date.now(),
			text,
			user_id: user?.id ?? -1,
			nickname: user?.nickname ?? 'me',
		};

		setMessages((prev) => [...prev, tempMessage]);

		sendMessage(text);
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
			<div
				style={{
					flex: 1,
					minHeight: 0,
					padding: 12,
					overflowY: 'auto',
					overflowX: 'hidden',
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
									wordBreak: 'break-word',
									overflowWrap: 'anywhere',
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

