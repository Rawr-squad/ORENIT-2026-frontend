import axios from 'axios';
import type { TaskAttempt } from '@/entities/task/model/taskAttempt.types';
import { api } from '@/shared/api/client';

const normalizeLanguage = (value: string | undefined): string => {
	if (!value) {
		return 'text';
	}

	const clean = value.trim().toLowerCase();
	return /^[a-z0-9#+-]+$/i.test(clean) ? clean : 'text';
};

const formatCodeAnswer = (code: string, language?: string): string => {
	const normalizedLanguage = normalizeLanguage(language);
	return `\`\`\`${normalizedLanguage}\n${code}\n\`\`\``;
};

const extractCodeAnswer = (answer: string): string | null => {
	try {
		const parsed = JSON.parse(answer) as { code?: string; language?: string };
		if (typeof parsed.code === 'string' && parsed.code.trim().length > 0) {
			return formatCodeAnswer(parsed.code, parsed.language);
		}
	} catch {
		// noop
	}

	return null;
};

export const taskApi = {
	submit: async (taskId: number, answer: string) => {
		const request = (payloadAnswer: string) =>
			api.post<TaskAttempt>(`/tasks/${taskId}/submit`, {
				answer: payloadAnswer,
			});

		try {
			const res = await request(answer);
			return res.data;
		} catch (error) {
			if (!axios.isAxiosError(error) || error.response?.status !== 400) {
				throw error;
			}

			const fallbackAnswer = extractCodeAnswer(answer);
			if (!fallbackAnswer || fallbackAnswer === answer) {
				throw error;
			}

			const fallbackRes = await request(fallbackAnswer);

			return fallbackRes.data;
		}
	},
};
