
import { RouteObject } from "react-router-dom";
import ProtectedRoute from "../components/ProtectedRoute";
import AdminDashboard from "../pages/AdminDashboard";
import AdminSettingsPage from "../pages/admin/SettingsPage";

const adminAllowedRoles = ['admin'];

export const adminRoutes: RouteObject[] = [
  {
    path: "/admin",
    element: (
      <ProtectedRoute allowedRoles={adminAllowedRoles}>
        <AdminDashboard />
      </ProtectedRoute>
    ),
  },
  {
    path: "/admin/settings",
    element: (
      <ProtectedRoute allowedRoles={adminAllowedRoles}>
        <AdminSettingsPage />
      </ProtectedRoute>
    ),
  },
];
