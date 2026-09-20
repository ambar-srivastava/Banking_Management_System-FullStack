import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

export function RoleProtectedRoute({ allowedRoles }) {
  const token = useSelector((state) => state.auth.token);
  const role = useSelector((state) => state.auth.user?.role);

  if (!token) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}
