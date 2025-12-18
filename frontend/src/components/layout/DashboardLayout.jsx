import React, { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { USER_ROLES } from '@/utils/constants';

const DashboardLayout = () => {
  const location = useLocation();
  const { user } = useSelector((state) => state.auth);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const getMenuItems = () => {
    if (user?.role === USER_ROLES.ADMIN) {
      return [
        { path: '/admin/dashboard', label: 'Dashboard', icon: '📊' },
        { path: '/admin/verifications', label: 'Verifications', icon: '✓' },
        { path: '/admin/users', label: 'Users', icon: '👥' },
        { path: '/admin/workers', label: 'Workers', icon: '👷' },
        { path: '/admin/bookings', label: 'Bookings', icon: '📅' },
        { path: '/admin/payments', label: 'Payments', icon: '💳' },
        { path: '/admin/categories', label: 'Categories', icon: '📂' },
      ];
    }

    if (user?.role === USER_ROLES.WORKER) {
      return [
        { path: '/worker/dashboard', label: 'Dashboard', icon: '📊' },
        { path: '/worker/profile', label: 'My Profile', icon: '👤' },
        { path: '/worker/bookings', label: 'My Bookings', icon: '📅' },
        { path: '/worker/availability', label: 'Availability', icon: '📆' },
        { path: '/worker/earnings', label: 'Earnings', icon: '💰' },
        { path: '/worker/reviews', label: 'Reviews', icon: '⭐' },
      ];
    }

    return [];
  };

  const menuItems = getMenuItems();

  const isActive = (path) => location.pathname === path;

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Mobile sidebar toggle */}
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-md shadow-md"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </button>

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:static inset-y-0 left-0 z-40
          w-64 bg-white shadow-lg transform transition-transform duration-300
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b">
            <Link to="/" className="flex items-center">
              <span className="text-xl font-bold text-primary-600">
                Urban Skill
              </span>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto p-4">
            <ul className="space-y-2">
              {menuItems.map((item) => (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={`
                      flex items-center px-4 py-3 rounded-lg transition-colors
                      ${
                        isActive(item.path)
                          ? 'bg-primary-600 text-white'
                          : 'text-gray-700 hover:bg-primary-50'
                      }
                    `}
                    onClick={() => setIsSidebarOpen(false)}
                  >
                    <span className="mr-3 text-xl">{item.icon}</span>
                    <span className="font-medium">{item.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* User Info */}
          <div className="p-4 border-t">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center text-white font-semibold">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                <p className="text-xs text-gray-500">{user?.role}</p>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-6">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
