export type Lesson = {
	id: number;
	title: string;
};

export type Module = {
	id: number;
	title: string;
	lessons: Lesson[];
};

// для списка (GET /courses)
export type CoursePreview = {
	id: number;
	title: string;
	description: string;
};

// для страницы курса (детально)
export type CourseFull = {
	id: number;
	title: string;
	description: string;
	modules: Module[];
};

export type CourseCreate = {
	title: string;
	description: string;
};

export type ModuleCreate = {
	course_id: number;
	title: string;
	order: number;
};

export type LessonCreate = {
	module_id: number;
	title: string;
	theory_content: string;
	order: number;
};
