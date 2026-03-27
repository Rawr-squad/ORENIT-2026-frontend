export type LessonPreview = {
	id: number;
	title: string;
	order?: number;
};

export type ModuleFull = {
	id: number;
	title: string;
	order?: number;
	lessons: LessonPreview[];
};

