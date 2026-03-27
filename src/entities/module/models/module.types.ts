export type LessonPreview = {
	id: number;
	title: string;
};

export type ModuleFull = {
	id: number;
	title: string;
	lessons: LessonPreview[];
};
