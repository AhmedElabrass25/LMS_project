import { Navigate } from "react-router-dom";

export default function AdminProtectedRoute({ children }) {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  // Only allow if logged in AND role is user
  return token && role === "admin" ? (
    children
  ) : (
    <Navigate to="/login" replace />
  );
}
