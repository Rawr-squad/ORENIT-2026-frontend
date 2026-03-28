import type { Task } from '../model/task.types';

type RawTask = Record<string, unknown>;

export const normalizeTask = (raw: RawTask): Task => {
	const base = {
		id: Number(raw.id),
		type: raw.type as Task['type'],
		question: String(raw.question ?? ''),
		coins: Number(raw.coins ?? 0),
	};

	if (raw.type === 'quiz') {
		let options: string[] = [];

		// 1. норм вариант
		if (Array.isArray(raw.options)) {
			options = raw.options.map(String);
		}

		// 2. строка JSON
		else if (typeof raw.options === 'string') {
			try {
				const parsed = JSON.parse(raw.options);
				if (Array.isArray(parsed)) {
					options = parsed.map(String);
				}
			} catch {}
		}

		// 3. из correct_answer (частый бек-костыль)
		else if (typeof raw.correct_answer === 'string') {
			try {
				const parsed = JSON.parse(raw.correct_answer);
				if (Array.isArray(parsed)) {
					options = parsed.map(String);
				}
			} catch {}
		}

		return {
			...base,
			type: 'quiz',
			options,
		};
	}

	if (raw.type === 'code') {
		return { ...base, type: 'code' };
	}

	return { ...base, type: 'input' };
};
