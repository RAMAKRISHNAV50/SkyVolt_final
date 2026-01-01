import { Navigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

const ADMIN_EMAIL = "admin@skyvolt.com";

const ProtectedRoute = ({ children, allow = [] }) => {
  const { user, role, loading, plan, freeTrialsLeft } = useAuth();

  /* ================= LOADING ================= */
  if (loading) {
    return <div style={{ textAlign: "center", padding: 30 }}>Loading...</div>;
  }

  /* ================= AUTH CHECK ================= */
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  /* ================= ADMIN SHORT-CIRCUIT (FIX) ================= */
  const isAdmin = user.email === ADMIN_EMAIL;

  // 🔥 THIS MUST COME BEFORE ROLE CHECK
  if (isAdmin) {
    return children;
  }

  /* ================= ROLE CHECK ================= */
  if (allow.length > 0 && !allow.includes(role)) {
    return <Navigate to="/access-denied" replace />;
  }

  /* ================= CLIENT PLAN CHECK ================= */
  if (role === "client") {
    if (plan === "free" && freeTrialsLeft <= 0) {
      return <Navigate to="/pricing" replace />;
    }
  }

  return children;
};

export default ProtectedRoute;
