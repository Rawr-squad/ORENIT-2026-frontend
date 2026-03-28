import { useAuthStore } from '@/entities/user/model/auth.store';

let socket: WebSocket | null = null;
const listeners = new Set<(data: any) => void>();

export const connectChat = (): WebSocket => {
	if (socket && socket.readyState !== WebSocket.CLOSED) {
		return socket;
	}

	const token = useAuthStore.getState().token;

	socket = new WebSocket(
		`${import.meta.env.VITE_WS_URL}/ws/chat?token=${token}`,
	);

	socket.onopen = () => {
		console.log('WS connected');
	};

	socket.onclose = () => {
		console.log('WS closed');
		socket = null;
	};

	socket.onmessage = (event) => {
		console.log('RAW WS EVENT:', event.data);

		try {
			const data = JSON.parse(event.data);

			// 💥 ВАЖНО: всегда рассылаем
			listeners.forEach((l) => l(data));
		} catch (e) {
			console.error('WS parse error', e);
		}
	};

	return socket;
};

export const sendMessage = (message: string) => {
	if (!socket || socket.readyState !== WebSocket.OPEN) return;

	socket.send(JSON.stringify({ message }));
};

export const subscribeChat = (handler: (data: any) => void) => {
	listeners.add(handler);

	return () => {
		listeners.delete(handler);
	};
};

