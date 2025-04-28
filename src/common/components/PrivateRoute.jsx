import { Navigate } from "react-router-dom";
import { useAuth } from "@/features/auth/context/AuthContext";

export function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Cargando...</div>;
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  // Si hay usuario logueado, deja pasar
  return children;
}
