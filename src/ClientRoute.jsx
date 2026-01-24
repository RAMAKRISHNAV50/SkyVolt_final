import { Navigate } from "react-router-dom";
import { useAuth } from "./auth/AuthContext";

const ClientRoute = ({ children }) => {
  const { user, role, plan, freeTrialsLeft, loading } = useAuth();

  /* ⏳ Loading */
  if (loading) {
    return <div style={{ textAlign: "center", padding: 40 }}>Loading...</div>;
  }

  /* 🔐 Not logged in */
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  /* ⛔ Not a client */
  if (role !== "client") {
    return <Navigate to="/access-denied" replace />;
  }

  /* 💳 Free plan exhausted → pricing */
  if (plan === "free" && freeTrialsLeft <= 0) {
    return <Navigate to="/pricing" replace />;
  }

  /* ✅ Allow client */
  return children;
};

export default ClientRoute;
