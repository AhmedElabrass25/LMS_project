import { Navigate } from "react-router-dom";

export default function PrivateRoute({ children }) {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  // Only allow if logged in AND role is user
  return token && role === "user" ? children : <Navigate to="/login" replace />;
}
