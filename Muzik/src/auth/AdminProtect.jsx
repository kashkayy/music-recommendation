import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./AuthContext";
export default function AdminProtectedRoute() {
  const { adminStatus } = useAuth();
  return <>{adminStatus ? <Outlet /> : <Navigate to={"/home"} replace />}</>;
}
