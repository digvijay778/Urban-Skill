import { createBrowserRouter } from 'react-router-dom';
import MainLayout from '@components/layout/MainLayout';
import DashboardLayout from '@components/layout/DashboardLayout';
import ProtectedRoute from '@components/common/ProtectedRoute';
import { USER_ROLES } from '@/utils/constants';

// Auth Pages
import Login from '@features/auth/Login';
import Register from '@features/auth/Register';
import WorkerRegister from '@features/auth/WorkerRegister';

// Public Pages
import Home from '@/pages/Home';
import Services from '@/pages/Services';
import Workers from '@/pages/Workers';
import WorkerDetails from '@/pages/WorkerDetails';
import NotFound from '@/pages/NotFound';
import Unauthorized from '@/pages/Unauthorized';

// Customer Pages
import MyBookings from '@/pages/customer/MyBookings';
import BookingDetails from '@/pages/customer/BookingDetails';
import Profile from '@/pages/customer/Profile';

// Worker Pages
import WorkerDashboard from '@/pages/worker/Dashboard';
import WorkerProfile from '@/pages/worker/Profile';
import WorkerBookings from '@/pages/worker/Bookings';
import WorkerBookingDetails from '@/pages/worker/BookingDetails';
import Availability from '@/pages/worker/Availability';
import WorkerReviews from '@/pages/worker/Reviews';
import WorkerEarnings from '@/pages/worker/Earnings';

// Admin Pages
import AdminDashboard from '@/pages/admin/Dashboard';
import ManageUsers from '@/pages/admin/ManageUsers';
import ManageWorkers from '@/pages/admin/ManageWorkers';
import ManageWorkerVerifications from '@/pages/admin/ManageWorkerVerifications';
import ManageBookings from '@/pages/admin/ManageBookings';
import ManageCategories from '@/pages/admin/ManageCategories';
import ManagePayments from '@/pages/admin/ManagePayments';
export const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: 'login',
        element: <Login />,
      },
      {
        path: 'register',
        element: <Register />,
      },
      {
        path: 'register-worker',
        element: <WorkerRegister />,
      },
      {
        path: 'services',
        element: <Services />,
      },
      {
        path: 'workers',
        element: <Workers />,
      },
      {
        path: 'workers/:id',
        element: <WorkerDetails />,
      },
      {
        path: 'my-bookings',
        element: (
          <ProtectedRoute allowedRoles={[USER_ROLES.CUSTOMER]}>
            <MyBookings />
          </ProtectedRoute>
        ),
      },
      {
        path: 'bookings/:id',
        element: (
          <ProtectedRoute>
            <BookingDetails />
          </ProtectedRoute>
        ),
      },
      {
        path: 'profile',
        element: (
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        ),
      },
      {
        path: 'unauthorized',
        element: <Unauthorized />,
      },
      {
        path: '*',
        element: <NotFound />,
      },
    ],
  },
  {
    path: '/worker',
    element: (
      <ProtectedRoute allowedRoles={[USER_ROLES.WORKER]}>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        path: 'dashboard',
        element: <WorkerDashboard />,
      },
      {
        path: 'profile',
        element: <WorkerProfile />,
      },
      {
        path: 'bookings',
        element: <WorkerBookings />,
      },
      {
        path: 'bookings/:id',
        element: <WorkerBookingDetails />,
      },
      {
        path: 'availability',
        element: <Availability />,
      },
      {
        path: 'reviews',
        element: <WorkerReviews />,
      },
      {
        path: 'earnings',
        element: <WorkerEarnings />,
      },
    ],
  },
  {
    path: '/admin',
    element: (
      <ProtectedRoute allowedRoles={[USER_ROLES.ADMIN]}>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        path: 'dashboard',
        element: <AdminDashboard />,
      },
      {
        path: 'users',
        element: <ManageUsers />,
      },
      {
        path: 'workers',
        element: <ManageWorkers />,
      },
      {
        path: 'verifications',
        element: <ManageWorkerVerifications />,
      },
      {
        path: 'bookings',
        element: <ManageBookings />,
      },
      {
        path: 'categories',
        element: <ManageCategories />,
      },
      {
        path: 'payments',
        element: <ManagePayments />,
      },
    ],
  },
]);
