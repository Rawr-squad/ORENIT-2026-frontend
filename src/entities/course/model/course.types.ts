export type Lesson = {
	id: number;
	title: string;
	order?: number;
};

export type Module = {
	id: number;
	title: string;
	order?: number;
	lessons: Lesson[];
};

export type CoursePreview = {
	id: number;
	title: string;
	description: string;
	modules_count?: number;
};

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

