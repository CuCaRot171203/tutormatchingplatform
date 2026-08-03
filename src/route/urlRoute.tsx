import React from 'react';
import { RouteObject } from 'react-router-dom';
import { Navigate } from 'react-router-dom';

// Layouts
import { AuthLayout } from '../components/Layout/AuthLayout';
import AdminLayout from '../layout/Admin/AdminLayout';
import UserLayout from '../layout/User/UserLayout';
import TutorLayout from '../layout/Tutor/TutorLayout';

// Auth Pages
import LoginPage from '../pages/auth/LoginPage';
import RegisterPage from '../pages/auth/RegisterPage';
import ForgotPasswordPage from '../pages/auth/ForgotPasswordPage';
import ResetPasswordPage from '../pages/auth/ResetPasswordPage';

// Student Pages
import StudentDashboard from '../pages/student/Dashboard';
import StudentComplaints from '../pages/student/Complaints';
import StudentNotifications from '../pages/student/Notifications';
import SearchTutors from '../pages/student/SearchTutors';
import TutorProfile from '../pages/student/TutorProfile';
import BookSession from '../pages/student/BookSession';
import StudentSessions from '../pages/student/Sessions';
import SessionDetail from '../pages/student/SessionDetail';
import Wallet from '../pages/student/Wallet';
import Progress from '../pages/student/Progress';
import Profile from '../pages/student/Profile';
import StudentProfileEdit from '../pages/student/ProfileEdit';
import ChangePassword from '../pages/student/ChangePassword';

// Tutor Pages
import TutorDashboard from '../pages/tutor/Dashboard';
import TutorSessions from '../pages/tutor/Sessions';
import TutorSessionDetail from '../pages/tutor/SessionDetail';
import Schedule from '../pages/tutor/Schedule';
import Students from '../pages/tutor/Students';
import TutorProgress from '../pages/tutor/Progress';
import TutorFeedback from '../pages/tutor/Feedback';
import TutorProfilePage from '../pages/tutor/Profile';
import TutorWallet from '../pages/tutor/Wallet';
import TutorNotifications from '../pages/tutor/Notifications';
import ProfileEdit from '../pages/tutor/ProfileEdit';

// Milestone Pages
import StudentMilestones from '../pages/student/Milestones';
import StudentMilestoneDetail from '../pages/student/MilestoneDetail';
import TutorMilestones from '../pages/tutor/Milestones';

// Admin Pages
import AdminDashboard from '../pages/admin/Dashboard';
import TutorApprovals from '../pages/admin/TutorApprovals';
import TutorDetail from '../pages/admin/TutorDetail';
import CreditRequests from '../pages/admin/CreditRequests';
import Complaints from '../pages/admin/Complaints';
import Users from '../pages/admin/Users';
import AdminSubjects from '../pages/admin/Subjects';
import AdminSessions from '../pages/admin/Sessions';
import AdminProfile from '../pages/admin/Profile';
import AdminNotifications from '../pages/admin/Notifications';

// Common Pages
import HomePage from '../pages/HomePage';
import FindTutorPage from '../pages/public/FindTutorPage';
import SubjectsPage from '../pages/public/SubjectsPage';
import PricingPage from '../pages/public/PricingPage';
import AboutPage from '../pages/public/AboutPage';

// Protected Route
import { ProtectedRoute } from '../components/common/ProtectedRoute';

/**
 * Public routes
 * - /
 * - /login
 * - /register
 * - /forgot-password
 * - /reset-password
 * - /find-tutor
 * - /subjects
 * - /pricing
 * - /about
 */
const publicRoutes: RouteObject[] = [
  {
    path: '/',
    element: <HomePage />,
  },
  {
    path: '/login',
    element: <AuthLayout><LoginPage /></AuthLayout>,
  },
  {
    path: '/register',
    element: <AuthLayout><RegisterPage /></AuthLayout>,
  },
  {
    path: '/forgot-password',
    element: <AuthLayout><ForgotPasswordPage /></AuthLayout>,
  },
  {
    path: '/reset-password',
    element: <AuthLayout><ResetPasswordPage /></AuthLayout>,
  },
  {
    path: '/find-tutor',
    element: <FindTutorPage />,
  },
  {
    path: '/subjects',
    element: <SubjectsPage />,
  },
  {
    path: '/pricing',
    element: <PricingPage />,
  },
  {
    path: '/about',
    element: <AboutPage />,
  },
];

/**
 * Student routes (wrapped with ProtectedRoute + UserLayout)
 * - /student/dashboard
 * - /student/search-tutors
 * - /student/tutor/:id
 * - /student/book/:tutorId
 * - /student/sessions
 * - /student/session/:id
 * - /student/wallet
 * - /student/progress
 * - /student/complaints
 * - /student/profile
 */
const studentLayoutRoutes: RouteObject[] = [
  {
    path: 'dashboard',
    element: <StudentDashboard />,
  },
  {
    path: 'search-tutors',
    element: <SearchTutors />,
  },
  {
    path: 'tutor/:id',
    element: <TutorProfile />,
  },
  {
    path: 'book/:tutorId',
    element: <BookSession />,
  },
  {
    path: 'sessions',
    element: <StudentSessions />,
  },
  {
    path: 'session/:id',
    element: <SessionDetail />,
  },
  {
    path: 'wallet',
    element: <Wallet />,
  },
  {
    path: 'progress',
    element: <Progress />,
  },
  {
    path: 'complaints',
    element: <StudentComplaints />,
  },
  {
    path: 'profile',
    element: <Profile />,
  },
  {
    path: 'profile/edit',
    element: <StudentProfileEdit />,
  },
  {
    path: 'profile/change-password',
    element: <ChangePassword />,
  },
  {
    path: 'notifications',
    element: <StudentNotifications />,
  },
  {
    path: 'milestones',
    element: <StudentMilestones />,
  },
  {
    path: 'milestone/:id',
    element: <StudentMilestoneDetail />,
  },
];

const studentRoutes: RouteObject = {
  path: '/student',
  element: <ProtectedRoute allowedRoles={['Student']} />,
  children: [
    {
      path: '',
      element: <UserLayout />,
      children: studentLayoutRoutes,
    },
  ],
};

/**
 * Tutor routes (wrapped with ProtectedRoute + TutorLayout)
 * - /tutor/dashboard
 * - /tutor/sessions
 * - /tutor/session/:id
 * - /tutor/schedule
 * - /tutor/students
 * - /tutor/progress
 * - /tutor/feedback
 * - /tutor/profile
 * - /tutor/wallet
 */
const tutorLayoutRoutes: RouteObject[] = [
  {
    path: 'dashboard',
    element: <TutorDashboard />,
  },
  {
    path: 'sessions',
    element: <TutorSessions />,
  },
  {
    path: 'session/:id',
    element: <TutorSessionDetail />,
  },
  {
    path: 'schedule',
    element: <Schedule />,
  },
  {
    path: 'students',
    element: <Students />,
  },
  {
    path: 'progress',
    element: <TutorProgress />,
  },
  {
    path: 'feedback',
    element: <TutorFeedback />,
  },
  {
    path: 'profile',
    element: <TutorProfilePage />,
  },
  {
    path: 'profile/edit',
    element: <ProfileEdit />,
  },
  {
    path: 'wallet',
    element: <TutorWallet />,
  },
  {
    path: 'notifications',
    element: <TutorNotifications />,
  },
  {
    path: 'milestones',
    element: <TutorMilestones />,
  },
];

const tutorRoutes: RouteObject = {
  path: '/tutor',
  element: <ProtectedRoute allowedRoles={['Tutor']} />,
  children: [
    {
      path: '',
      element: <TutorLayout />,
      children: tutorLayoutRoutes,
    },
  ],
};

/**
 * Admin routes (wrapped with ProtectedRoute + AdminLayout)
 * - /admin/dashboard
 * - /admin/tutors/pending
 * - /admin/tutor/:id
 * - /admin/subjects
 * - /admin/credits/pending
 * - /admin/credits/complaints
 * - /admin/complaints
 * - /admin/users
 * - /admin/sessions
 * - /admin/profile
 */
const adminLayoutRoutes: RouteObject[] = [
  {
    path: 'dashboard',
    element: <AdminDashboard />,
  },
  {
    path: 'tutors/pending',
    element: <TutorApprovals />,
  },
  {
    path: 'tutor/:id',
    element: <TutorDetail />,
  },
  {
    path: 'subjects',
    element: <AdminSubjects />,
  },
  {
    path: 'credits/pending',
    element: <CreditRequests />,
  },
  {
    path: 'credits/complaints',
    element: <Complaints />,
  },
  {
    path: 'complaints',
    element: <Complaints />,
  },
  {
    path: 'users',
    element: <Users />,
  },
  {
    path: 'sessions',
    element: <AdminSessions />,
  },
  {
    path: 'profile',
    element: <AdminProfile />,
  },
  {
    path: 'notifications',
    element: <AdminNotifications />,
  },
];

const adminRoutes: RouteObject = {
  path: '/admin',
  element: <ProtectedRoute allowedRoles={['Administrator']} />,
  children: [
    {
      path: '',
      element: <AdminLayout />,
      children: adminLayoutRoutes,
    },
  ],
};

/**
 * Fallback route - redirects unknown paths to home
 */
const fallbackRoute: RouteObject = {
  path: '*',
  element: <Navigate to="/" replace />,
};

/**
 * All routes combined for use in <Routes>
 */
export const allRoutes: RouteObject[] = [
  ...publicRoutes,
  studentRoutes,
  tutorRoutes,
  adminRoutes,
  fallbackRoute,
];

// ============================================================
// NAMED EXPORTS (for partial use if needed)
// ============================================================

/**
 * Public routes
 * Student routes
 * Tutor routes
 * Admin routes
 *
 * @returns {RouteObject[]} All routes
 * Author: TutorMatch - dev
 */
export {
  publicRoutes,
  studentRoutes,
  tutorRoutes,
  adminRoutes,
};
