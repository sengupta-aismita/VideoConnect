import { Navigate, Outlet } from "react-router-dom";

export default function ProtectedRoute() {
  const token = localStorage.getItem("token");

  // not logged in
  if (!token) return <Navigate to="/auth" replace />;

  // logged in
  return <Outlet />;
}
