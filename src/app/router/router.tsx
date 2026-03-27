import { LoginPage } from '@/pages/auth/login/ui/LoginPage';
import { RegisterPage } from '@/pages/auth/login/ui/RegisterPage';
import { NotFoundPage } from '@/pages/not-found/ui/NotFoundPage';
import { CoursePage } from '@/pages/student/course/ui/CoursePage';
import { DashboardPage } from '@/pages/student/dashboard/ui/DashboardPage';
import { LessonPage } from '@/pages/student/lesson/ui/LessonPage';
import { createBrowserRouter } from 'react-router-dom';
import { ProtectedRoute } from './ProtectedRoute';
import { AdminDashboardPage } from '@/pages/admin/dashboard/ui/AdminDashboardPage';
import { AdminCoursesPage } from '@/pages/admin/courses/ui/AdminCoursesPage';

export const router = createBrowserRouter([
	{
		path: '/',
		element: (
			<ProtectedRoute roles={['student']}>
				<DashboardPage />
			</ProtectedRoute>
		),
	},
	{
		path: '/courses/:id',
		element: (
			<ProtectedRoute roles={['student']}>
				<CoursePage />
			</ProtectedRoute>
		),
	},
	{
		path: '/lessons/:id',
		element: (
			<ProtectedRoute roles={['student']}>
				<LessonPage />
			</ProtectedRoute>
		),
	},
	{
		path: '/admin',
		element: (
			<ProtectedRoute roles={['admin']}>
				<AdminDashboardPage />
			</ProtectedRoute>
		),
	},
	{
		path: '/admin/courses',
		element: (
			<ProtectedRoute roles={['admin']}>
				<AdminCoursesPage />
			</ProtectedRoute>
		),
	},

	// auth без защиты
	{
		path: '/login',
		element: <LoginPage />,
	},
	{
		path: '/register',
		element: <RegisterPage />,
	},

	{
		path: '*',
		element: <NotFoundPage />,
	},
]);
