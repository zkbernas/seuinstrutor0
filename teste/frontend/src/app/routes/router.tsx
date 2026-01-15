import { createBrowserRouter, Navigate } from 'react-router-dom';
import { ProtectedRoute, PublicRoute } from '../../auth/guards';
import { AppShell } from '../layout/AppShell';

// Public pages
import { LoginPage } from '../../pages/public/LoginPage';

// App pages
import { DashboardPage } from '../../pages/app/DashboardPage';
import { InstructorsPage } from '../../pages/app/InstructorsPage';
import { InstructorDetailsPage } from '../../pages/app/InstructorDetailsPage';
import { StudentsPage } from '../../pages/app/StudentsPage';
import { BillingPlansPage } from '../../pages/app/BillingPlansPage';
import { ClassesPage } from '../../pages/app/ClassesPage';
import { SettingsPage } from '../../pages/app/SettingsPage';

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
    ],
  },
  {
    path: '/app',
    element: <ProtectedRoute />,
    children: [
      {
        element: <AppShell />,
        children: [
          {
            index: true,
            element: <Navigate to="/app/dashboard" replace />,
          },
          {
            path: 'dashboard',
            element: <DashboardPage />,
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
            path: 'students',
            element: <StudentsPage />,
          },
          {
            path: 'classes',
            element: <ClassesPage />,
          },
          {
            path: 'billing',
            element: <BillingPlansPage />,
          },
          {
            path: 'settings',
            element: <SettingsPage />,
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
