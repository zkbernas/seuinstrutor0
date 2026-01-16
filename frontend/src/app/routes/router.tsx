import { createBrowserRouter, Navigate } from 'react-router-dom';
import { AuthGuard, AdminGuard, PublicRoute } from '../../auth/guards';
import { AppShell } from '../layout/AppShell';
import { RoleBasedRedirect } from './RoleBasedRedirect';

// Public pages
import { LoginPage } from '../../pages/public/LoginPage';
import { RegisterPage } from '../../pages/public/RegisterPage';
import { PendingReviewPage } from '../../pages/public/PendingReviewPage';
import { TermsPage } from '../../pages/public/TermsPage';
import { PrivacyPage } from '../../pages/public/PrivacyPage';
import { ForgotPasswordPage } from '../../pages/public/ForgotPasswordPage';

// App pages
import { DashboardRoute } from './DashboardRoute';
import { StudentHomeFeed } from '../../pages/app/StudentHomeFeed';
import { InstructorsPage } from '../../pages/app/InstructorsPage';
import { InstructorDetailsPage } from '../../pages/app/InstructorDetailsPage';
import { InstructorProfilePage } from '../../pages/app/InstructorProfilePage';
import { StudentsPage } from '../../pages/app/StudentsPage';
import { BillingPlansPage } from '../../pages/app/BillingPlansPage';
import { ClassesPage } from '../../pages/app/ClassesPage';
import { SettingsPage } from '../../pages/app/SettingsPage';
import { NewLessonPage } from '../../pages/app/NewLessonPage';

// Admin pages
import { AdminDashboard } from '../../pages/app/admin/AdminDashboard';
import { AdminUsers } from '../../pages/app/admin/AdminUsers';
import { AdminDocuments } from '../../pages/app/admin/AdminDocuments';
import { AdminFinance } from '../../pages/app/admin/AdminFinance';
import { AdminAudit } from '../../pages/app/admin/AdminAudit';
import { AdminInstructorDetails } from '../../pages/app/admin/AdminInstructorDetails';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to="/login" replace />,
  },
  {
    element: <PublicRoute />,
    children: [
      {
        path: '/login',
        element: <LoginPage />,
      },
      {
        path: '/register',
        element: <RegisterPage />,
      },
      {
        path: '/pending-review',
        element: <PendingReviewPage />,
      },
      {
        path: '/terms',
        element: <TermsPage />,
      },
      {
        path: '/privacy',
        element: <PrivacyPage />,
      },
      {
        path: '/forgot-password',
        element: <ForgotPasswordPage />,
      },
    ],
  },
  {
    path: '/app',
    element: <AuthGuard />,
    children: [
      {
        element: <AppShell />,
        children: [
          {
            index: true,
            element: <RoleBasedRedirect />,
          },
          {
            path: 'home',
            element: <StudentHomeFeed />,
          },
          {
            path: 'dashboard',
            element: <DashboardRoute />,
          },
          {
            path: 'instructors',
            element: <InstructorsPage />,
          },
          {
            path: 'instructors/:id',
            element: <InstructorDetailsPage />,
          },
          {
            path: 'instructor/:id',
            element: <InstructorProfilePage />,
          },
          {
            path: 'students',
            element: <StudentsPage />,
          },
          {
            path: 'classes',
            element: <ClassesPage />,
          },
          {
            path: 'lessons/new',
            element: <NewLessonPage />,
          },
          {
            path: 'billing',
            element: <BillingPlansPage />,
          },
          {
            path: 'settings',
            element: <SettingsPage />,
          },
          {
            path: 'admin',
            element: <AdminGuard />,
            children: [
              {
                index: true,
                element: <AdminDashboard />,
              },
              {
                path: 'users',
                element: <AdminUsers />,
              },
              {
                path: 'documents',
                element: <AdminDocuments />,
              },
              {
                path: 'finance',
                element: <AdminFinance />,
              },
              {
                path: 'audit',
                element: <AdminAudit />,
              },
              {
                path: 'instructors/:id',
                element: <AdminInstructorDetails />,
              },
            ],
          },
        ],
      },
    ],
  },
  {
    path: '*',
    element: <Navigate to="/login" replace />,
  },
]);
