import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import Spinner from "../components/ui/Spinner.jsx";

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return <Spinner className="min-h-screen" />;
  if (!isAuthenticated) return <Navigate to="/admin/login" replace />;

  return children;
}
