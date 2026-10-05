import { Routes, Route } from 'react-router-dom';

import AppLayout from '../layouts/AppLayout';

import HomePage from '../pages/HomePage';
import NotFoundPage from '../pages/NotFoundPage';
import LoginPage from '../pages/auth/LoginPage';
import RegisterPage from '../pages/auth/RegisterPage';
import UserDashboardPage from '../pages/user/UserDashboardPage';
import AdminDashboardPage from '../pages/admin/AdminDashboardPage';

import ProtectedRoute from './ProtectedRoute';
import RoleRoute from './RoleRoute';

function AppRoutes() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Authenticated user routes — wrapped in app layout shell */}
      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route element={<RoleRoute requiredRole="USER" />}>
            <Route path="/user" element={<UserDashboardPage />} />
            <Route path="/user/*" element={<UserDashboardPage />} />
          </Route>

          <Route element={<RoleRoute requiredRole="ADMIN" />}>
            <Route path="/admin" element={<AdminDashboardPage />} />
            <Route path="/admin/*" element={<AdminDashboardPage />} />
          </Route>
        </Route>
      </Route>

      {/* Catch-all */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default AppRoutes;
