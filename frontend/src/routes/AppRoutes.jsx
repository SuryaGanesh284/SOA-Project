import { Routes, Route } from 'react-router-dom';

import AppLayout from '../layouts/AppLayout';

import HomePage from '../pages/HomePage';
import NotFoundPage from '../pages/NotFoundPage';
import LoginPage from '../pages/auth/LoginPage';
import RegisterPage from '../pages/auth/RegisterPage';
import UserDashboardPage from '../pages/user/UserDashboardPage';
import AdminDashboardPage from '../pages/admin/AdminDashboardPage';

function AppRoutes() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Authenticated user routes — wrapped in app layout shell */}
      <Route element={<AppLayout />}>
        <Route path="/user" element={<UserDashboardPage />} />
        <Route path="/admin" element={<AdminDashboardPage />} />
      </Route>

      {/* Catch-all */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default AppRoutes;
