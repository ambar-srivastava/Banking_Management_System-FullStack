import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

export function ProtectedRoute() {
  const token = useSelector((state) => state.auth.token);

  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return <Outlet />;
}
