/* eslint-disable react-refresh/only-export-components */
import { lazy, Suspense, type ComponentType } from 'react';
import { Spin } from 'antd';
import { createBrowserRouter } from 'react-router-dom';
import { ProtectedRoute } from './ProtectedRoute';

const LazyRoleHomeRedirect = lazy(async () => {
	const module = await import('./RoleHomeRedirect');
	return { default: module.RoleHomeRedirect };
});

const LazyAppShell = lazy(async () => {
	const module = await import('@/shared/ui/layout/AppShell');
	return { default: module.AppShell };
});

const LazyLoginPage = lazy(async () => {
	const module = await import('@/pages/auth/login/ui/LoginPage');
	return { default: module.LoginPage };
});

const LazyRegisterPage = lazy(async () => {
	const module = await import('@/pages/auth/register/ui/RegisterPage');
	return { default: module.RegisterPage };
});

const LazyNotFoundPage = lazy(async () => {
	const module = await import('@/pages/not-found/ui/NotFoundPage');
	return { default: module.NotFoundPage };
});

const LazyStudentDashboardPage = lazy(async () => {
	const module = await import('@/pages/student/dashboard/ui/DashboardPage');
	return { default: module.DashboardPage };
});

const LazyCoursesPage = lazy(async () => {
	const module = await import('@/pages/student/courses/ui/CoursesPage');
	return { default: module.CoursesPage };
});

const LazyCoursePage = lazy(async () => {
	const module = await import('@/pages/student/course/ui/CoursePage');
	return { default: module.CoursePage };
});

const LazyLessonPage = lazy(async () => {
	const module = await import('@/pages/student/lesson/ui/LessonPage');
	return { default: module.LessonPage };
});

const LazyStudentProfilePage = lazy(async () => {
	const module = await import('@/pages/student/profile/ui/ProfilePage');
	return { default: module.ProfilePage };
});

const LazyLeaderboardPage = lazy(async () => {
	const module = await import('@/pages/student/leaderboard/ui/LeaderboardPage');
	return { default: module.LeaderboardPage };
});

const LazyParentDashboardPage = lazy(async () => {
	const module =
		await import('@/pages/parent/dashboard/ui/ParentDashboardPage');
	return { default: module.ParentDashboardPage };
});

const LazyParentProgressPage = lazy(async () => {
	const module = await import('@/pages/parent/progress/ui/ParentProgressPage');
	return { default: module.ParentProgressPage };
});

const LazyParentProfilePage = lazy(async () => {
	const module = await import('@/pages/parent/profile/ui/ParentProfilePage');
	return { default: module.ParentProfilePage };
});

const LazyAdminDashboardPage = lazy(async () => {
	const module = await import('@/pages/admin/dashboard/ui/AdminDashboardPage');
	return { default: module.AdminDashboardPage };
});

const LazyAdminCoursesPage = lazy(async () => {
	const module = await import('@/pages/admin/courses/ui/AdminCoursesPage');
	return { default: module.AdminCoursesPage };
});

const LazyAdminCourseDetailPage = lazy(async () => {
	const module = await import('@/pages/admin/courses/ui/AdminCourseDetailPage');
	return { default: module.AdminCourseDetailPage };
});

const LazyAdminProfilePage = lazy(async () => {
	const module = await import('@/pages/admin/profile/ui/AdminProfilePage');
	return { default: module.AdminProfilePage };
});

// Новые страницы
const LazyAdminShopPage = lazy(async () => {
	const module = await import('@/pages/admin/shop/ui/AdminShopPage');
	return { default: module.AdminShopPage };
});

const LazyAdminAchievementsPage = lazy(async () => {
	const module =
		await import('@/pages/admin/achievements/ui/AdminAchievementsPage');
	return { default: module.AdminAchievementsPage };
});

const LazyStudentShopPage = lazy(async () => {
	const module = await import('@/pages/student/shop/ui/StudentShopPage');
	return { default: module.StudentShopPage };
});

const renderLazy = (Component: ComponentType) => (
	<Suspense fallback={<Spin style={{ marginTop: 48, marginLeft: 24 }} />}>
		<Component />
	</Suspense>
);

export const router = createBrowserRouter([
	{
		path: '/',
		element: renderLazy(LazyRoleHomeRedirect),
	},
	{
		path: '/login',
		element: renderLazy(LazyLoginPage),
	},
	{
		path: '/register',
		element: renderLazy(LazyRegisterPage),
	},
	{
		element: <ProtectedRoute>{renderLazy(LazyAppShell)}</ProtectedRoute>,
		children: [
			{
				path: '/student/dashboard',
				element: (
					<ProtectedRoute roles={['student']}>
						{renderLazy(LazyStudentDashboardPage)}
					</ProtectedRoute>
				),
			},
			{
				path: '/student/courses',
				element: (
					<ProtectedRoute roles={['student']}>
						{renderLazy(LazyCoursesPage)}
					</ProtectedRoute>
				),
			},
			{
				path: '/student/courses/:id',
				element: (
					<ProtectedRoute roles={['student']}>
						{renderLazy(LazyCoursePage)}
					</ProtectedRoute>
				),
			},
			{
				path: '/student/lessons/:id',
				element: (
					<ProtectedRoute roles={['student']}>
						{renderLazy(LazyLessonPage)}
					</ProtectedRoute>
				),
			},
			{
				path: '/student/profile',
				element: (
					<ProtectedRoute roles={['student']}>
						{renderLazy(LazyStudentProfilePage)}
					</ProtectedRoute>
				),
			},
			{
				path: '/student/leaderboard',
				element: (
					<ProtectedRoute roles={['student']}>
						{renderLazy(LazyLeaderboardPage)}
					</ProtectedRoute>
				),
			},
			{
				path: '/student/shop',
				element: (
					<ProtectedRoute roles={['student']}>
						{renderLazy(LazyStudentShopPage)}
					</ProtectedRoute>
				),
			},
			{
				path: '/parent/dashboard',
				element: (
					<ProtectedRoute roles={['parent']}>
						{renderLazy(LazyParentDashboardPage)}
					</ProtectedRoute>
				),
			},
			{
				path: '/parent/progress',
				element: (
					<ProtectedRoute roles={['parent']}>
						{renderLazy(LazyParentProgressPage)}
					</ProtectedRoute>
				),
			},
			{
				path: '/parent/profile',
				element: (
					<ProtectedRoute roles={['parent']}>
						{renderLazy(LazyParentProfilePage)}
					</ProtectedRoute>
				),
			},
			{
				path: '/admin/dashboard',
				element: (
					<ProtectedRoute roles={['admin']}>
						{renderLazy(LazyAdminDashboardPage)}
					</ProtectedRoute>
				),
			},
			{
				path: '/admin/courses',
				element: (
					<ProtectedRoute roles={['admin']}>
						{renderLazy(LazyAdminCoursesPage)}
					</ProtectedRoute>
				),
			},
			{
				path: '/admin/courses/:id',
				element: (
					<ProtectedRoute roles={['admin']}>
						{renderLazy(LazyAdminCourseDetailPage)}
					</ProtectedRoute>
				),
			},
			{
				path: '/admin/profile',
				element: (
					<ProtectedRoute roles={['admin']}>
						{renderLazy(LazyAdminProfilePage)}
					</ProtectedRoute>
				),
			},
			// Новые маршруты
			{
				path: '/admin/shop',
				element: (
					<ProtectedRoute roles={['admin']}>
						{renderLazy(LazyAdminShopPage)}
					</ProtectedRoute>
				),
			},
			{
				path: '/admin/achievements',
				element: (
					<ProtectedRoute roles={['admin']}>
						{renderLazy(LazyAdminAchievementsPage)}
					</ProtectedRoute>
				),
			},
		],
	},
	{
		path: '*',
		element: renderLazy(LazyNotFoundPage),
	},
]);

