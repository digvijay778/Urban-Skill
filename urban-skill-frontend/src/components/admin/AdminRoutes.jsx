import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AdminDashboard from './AdminDashboard';
import Analytics from './Analytics';
import BookingManagement from './BookingManagement';
import PaymentManagement from './PaymentManagement';
import Reports from './Reports';
import ServiceManagement from './ServiceManagement';
import UserManagement from './UserManagement';
import WorkerVerification from './WorkerVerification';

const AdminRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<AdminDashboard />} />
      <Route path="/dashboard" element={<AdminDashboard />} />
      <Route path="/analytics" element={<Analytics />} />
      <Route path="/bookings" element={<BookingManagement />} />
      <Route path="/payments" element={<PaymentManagement />} />
      <Route path="/reports" element={<Reports />} />
      <Route path="/services" element={<ServiceManagement />} />
      <Route path="/users" element={<UserManagement />} />
      <Route path="/users/add" element={<UserManagement />} />
      <Route path="/verifications" element={<WorkerVerification />} />
      <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
    </Routes>
  );
};

export default AdminRoutes;
