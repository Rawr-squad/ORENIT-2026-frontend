import { useParams } from 'react-router-dom';
import { Typography, Card } from 'antd';

import type { Lesson } from '@/entities/lesson/model/lesson.types';
import { TaskRenderer } from '@/features/task/ui/TaskRenderer';
import { Markdown } from '@/shared/ui/Markdown';

const { Title } = Typography;

export const LessonPage = () => {
	const { id } = useParams<{ id: string }>();

	//  MOCK
	const lesson: Lesson = {
		id: Number(id),
		title: 'Что такое React',
		theory: `
# Что такое React

**React** — это библиотека для создания пользовательских интерфейсов.

## Основные идеи:

- Компоненты
- Декларативность
- Virtual DOM

## Пример:

\`\`\`jsx
function App() {
  return <h1>Hello World</h1>;
}
\`\`\`

> React разработан компанией Facebook

---

### Попробуй ответить на вопросы ниже 👇
`,
		tasks: [
			{
				id: 1,
				type: 'quiz',
				question: 'React — это?',
				options: ['Фреймворк', 'Библиотека', 'Язык'],
			},
			{
				id: 2,
				type: 'input',
				question: 'Кто разработал React?',
			},
		],
	};

	/*
  //  REAL
  const { data: lesson } = useLesson(id);
  */

	return (
		<div style={{ padding: 24 }}>
			<Title level={2}>{lesson.title}</Title>

			<Card style={{ marginBottom: 24 }}>
				<Markdown content={lesson.theory} />
			</Card>

			<Title level={3}>Задания</Title>

			{lesson.tasks.map((task) => (
				<Card key={task.id} style={{ marginBottom: 16 }}>
					<TaskRenderer task={task} />
				</Card>
			))}
		</div>
	);
};
