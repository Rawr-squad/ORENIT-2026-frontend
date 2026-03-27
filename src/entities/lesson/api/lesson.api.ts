import { api } from '@/shared/api/client';
import type { Lesson } from '../model/lesson.types';
import type { Task, TaskType } from '@/entities/task/model/task.types';
import type { TaskAttempt } from '@/entities/task/model/taskAttempt.types';

const toBoolean = (value: unknown): boolean | undefined => {
	if (typeof value === 'boolean') {
		return value;
	}

	if (typeof value === 'string') {
		const normalized = value.trim().toLowerCase();
		if (normalized === 'true') {
			return true;
		}
		if (normalized === 'false') {
			return false;
		}
	}

	if (typeof value === 'number') {
		if (value === 1) {
			return true;
		}
		if (value === 0) {
			return false;
		}
	}

	return undefined;
};

const toTaskStatus = (value: unknown): TaskAttempt['status'] | undefined => {
	if (value === 'pending' || value === 'checked') {
		return value;
	}

	if (value === 'completed') {
		return 'checked';
	}

	return undefined;
};

const parseTaskAttempt = (raw: Record<string, unknown>): TaskAttempt | null => {
	const candidate = (raw.last_attempt ?? raw.attempt ?? raw.my_attempt) as
		| Record<string, unknown>
		| undefined;

	if (candidate && typeof candidate === 'object') {
		const status = toTaskStatus(candidate.status);
		if (status) {
			return {
				id: Number(candidate.id ?? 0),
				status,
				is_correct: toBoolean(candidate.is_correct),
				feedback: candidate.feedback as string | undefined,
				answer: candidate.answer as string | undefined,
				created_at: candidate.created_at as string | undefined,
			};
		}
	}

	const rawStatus = toTaskStatus(raw.status);
	if (rawStatus) {
		return {
			id: Number(raw.attempt_id ?? raw.id ?? 0),
			status: rawStatus,
			is_correct: toBoolean(raw.is_correct),
		};
	}

	return null;
};

const parseQuizMeta = (
	rawOptions: unknown,
	rawCorrectAnswer: unknown,
): { options: string[]; serializedCorrectAnswer: string | null } => {
	let options: string[] = Array.isArray(rawOptions)
		? rawOptions.map((option) => String(option))
		: [];
	let serialized = rawCorrectAnswer == null ? null : String(rawCorrectAnswer);

	if (serialized) {
		try {
			const parsed = JSON.parse(serialized) as {
				options?: string[];
				correct?: string;
			};

			if (Array.isArray(parsed.options)) {
				options = parsed.options.map((option) => String(option));
			}

			if (parsed.correct != null) {
				serialized = String(parsed.correct);
			}
		} catch {
			// keep original payload as plain string
		}
	}

	return { options, serializedCorrectAnswer: serialized };
};

const normalizeTask = (task: unknown, index: number): Task => {
	const raw = (task ?? {}) as Record<string, unknown>;
	const type = (raw.type as TaskType | undefined) ?? 'input';
	const attempt = parseTaskAttempt(raw);
	const common = {
		id: Number(raw.id ?? index + 1),
		lesson_id: raw.lesson_id != null ? Number(raw.lesson_id) : undefined,
		type,
		question: String(raw.question ?? `Task ${index + 1}`),
		correct_answer:
			raw.correct_answer == null ? null : String(raw.correct_answer),
		coins: raw.coins != null ? Number(raw.coins) : undefined,
		attempt,
		attempt_status: attempt?.status,
		is_correct: attempt?.is_correct,
	};

	if (type === 'quiz') {
		const quizMeta = parseQuizMeta(raw.options, raw.correct_answer);
		return {
			...common,
			type: 'quiz',
			options: quizMeta.options,
			correct_answer: quizMeta.serializedCorrectAnswer,
		};
	}

	if (type === 'code') {
		return {
			...common,
			type: 'code',
		};
	}

	return {
		...common,
		type: 'input',
	};
};

export const lessonApi = {
	getById: async (id: number): Promise<Lesson> => {
		const res = await api.get(`/lessons/${id}`);
		const data = res.data as Partial<Lesson> & {
			tasks?: unknown[];
		};

		return {
			id: Number(data.id ?? id),
			title: String(data.title ?? `Lesson ${id}`),
			theory_content: String(data.theory_content ?? ''),
			module_id: data.module_id,
			order: data.order,
			tasks: Array.isArray(data.tasks)
				? data.tasks.map((task, index) => normalizeTask(task, index))
				: [],
		};
	},
};
