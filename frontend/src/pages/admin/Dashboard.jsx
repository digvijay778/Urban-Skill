import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  // Mock data - replace with actual API calls
  const stats = {
    totalUsers: 1247,
    totalWorkers: 384,
    totalBookings: 2891,
    revenue: 458900,
    activeBookings: 145,
    pendingVerifications: 23,
    newUsersToday: 12,
    completionRate: 94.5
  };

  const recentActivities = [
    { id: 1, type: 'booking', user: 'John Doe', action: 'booked Plumbing service', time: '2 mins ago', icon: '📅' },
    { id: 2, type: 'worker', user: 'Sarah Smith', action: 'completed verification', time: '15 mins ago', icon: '✅' },
    { id: 3, type: 'payment', user: 'Mike Johnson', action: 'payment received ₹2,500', time: '1 hour ago', icon: '💰' },
    { id: 4, type: 'review', user: 'Emma Wilson', action: 'left 5-star review', time: '2 hours ago', icon: '⭐' },
    { id: 5, type: 'user', user: 'David Brown', action: 'registered as customer', time: '3 hours ago', icon: '👤' },
  ];

  const topWorkers = [
    { id: 1, name: 'Alex Kumar', rating: 4.9, jobs: 145, revenue: 45000 },
    { id: 2, name: 'Priya Sharma', rating: 4.8, jobs: 132, revenue: 38900 },
    { id: 3, name: 'Rahul Verma', rating: 4.7, jobs: 128, revenue: 36700 },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-purple-50 to-pink-50 py-8">
      <div className="container">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent mb-2">
            Admin Dashboard
          </h1>
          <p className="text-gray-600">Welcome back! Here's what's happening today.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Users */}
          <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-purple-100 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <span className="text-green-600 text-sm font-semibold">+{stats.newUsersToday} today</span>
            </div>
            <h3 className="text-gray-600 text-sm font-medium mb-1">Total Users</h3>
            <p className="text-3xl font-bold text-gray-900">{stats.totalUsers.toLocaleString()}</p>
          </div>

          {/* Total Workers */}
          <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-purple-100 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-secondary-600 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <span className="text-orange-600 text-sm font-semibold">{stats.pendingVerifications} pending</span>
            </div>
            <h3 className="text-gray-600 text-sm font-medium mb-1">Total Workers</h3>
            <p className="text-3xl font-bold text-gray-900">{stats.totalWorkers.toLocaleString()}</p>
          </div>

          {/* Total Bookings */}
          <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-purple-100 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <span className="text-blue-600 text-sm font-semibold">{stats.activeBookings} active</span>
            </div>
            <h3 className="text-gray-600 text-sm font-medium mb-1">Total Bookings</h3>
            <p className="text-3xl font-bold text-gray-900">{stats.totalBookings.toLocaleString()}</p>
          </div>

          {/* Revenue */}
          <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-purple-100 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <span className="text-green-600 text-sm font-semibold">{stats.completionRate}% rate</span>
            </div>
            <h3 className="text-gray-600 text-sm font-medium mb-1">Total Revenue</h3>
            <p className="text-3xl font-bold text-gray-900">₹{stats.revenue.toLocaleString()}</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          {/* Recent Activity */}
          <div className="lg:col-span-2 bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-purple-100">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Recent Activity</h2>
              <Link to="/admin/activity" className="text-primary-600 hover:text-primary-700 text-sm font-semibold">
                View All →
              </Link>
            </div>
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-4 p-4 rounded-lg hover:bg-purple-50 transition-colors">
                  <div className="text-2xl">{activity.icon}</div>
                  <div className="flex-1">
                    <p className="text-gray-900 font-medium">{activity.user}</p>
                    <p className="text-gray-600 text-sm">{activity.action}</p>
                  </div>
                  <span className="text-gray-500 text-sm whitespace-nowrap">{activity.time}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Top Workers */}
          <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-purple-100">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Top Workers</h2>
              <Link to="/admin/manage-workers" className="text-primary-600 hover:text-primary-700 text-sm font-semibold">
                View All →
              </Link>
            </div>
            <div className="space-y-4">
              {topWorkers.map((worker, index) => (
                <div key={worker.id} className="flex items-center space-x-4 p-4 rounded-lg hover:bg-purple-50 transition-colors">
                  <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-secondary-600 rounded-full flex items-center justify-center text-white font-bold">
                    #{index + 1}
                  </div>
                  <div className="flex-1">
                    <p className="text-gray-900 font-semibold">{worker.name}</p>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <span className="flex items-center">
                        ⭐ {worker.rating}
                      </span>
                      <span>•</span>
                      <span>{worker.jobs} jobs</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-green-600 font-bold">₹{(worker.revenue / 1000).toFixed(1)}k</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-purple-100">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Quick Actions</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link
              to="/admin/manage-users"
              className="flex flex-col items-center justify-center p-6 rounded-lg border-2 border-purple-200 hover:border-primary-500 hover:bg-purple-50 transition-all group"
            >
              <svg className="w-10 h-10 text-primary-600 mb-3 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              <span className="text-gray-700 font-semibold">Manage Users</span>
            </Link>
            <Link
              to="/admin/manage-workers"
              className="flex flex-col items-center justify-center p-6 rounded-lg border-2 border-purple-200 hover:border-primary-500 hover:bg-purple-50 transition-all group"
            >
              <svg className="w-10 h-10 text-secondary-600 mb-3 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <span className="text-gray-700 font-semibold">Verify Workers</span>
            </Link>
            <Link
              to="/admin/bookings"
              className="flex flex-col items-center justify-center p-6 rounded-lg border-2 border-purple-200 hover:border-primary-500 hover:bg-purple-50 transition-all group"
            >
              <svg className="w-10 h-10 text-green-600 mb-3 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <span className="text-gray-700 font-semibold">View Bookings</span>
            </Link>
            <Link
              to="/admin/reports"
              className="flex flex-col items-center justify-center p-6 rounded-lg border-2 border-purple-200 hover:border-primary-500 hover:bg-purple-50 transition-all group"
            >
              <svg className="w-10 h-10 text-orange-600 mb-3 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              <span className="text-gray-700 font-semibold">View Reports</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
