import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

const AccessDenied = () => {
  const navigate = useNavigate();
  const { role } = useAuth();

  const goBack = () => {
    if (role === "admin") {
      navigate("/admin-dashboard");
    } else if (role === "client") {
      navigate("/client-dashboard");
    } else {
      navigate("/login");
    }
  };

  return (
    <div
      style={{
        minHeight: "70vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        textAlign: "center",
        padding: 20,
      }}
    >
      <h1 style={{ fontSize: "3rem" }}>🚫 Access Denied</h1>

      <p style={{ marginTop: 15, fontSize: "1.1rem", maxWidth: 500 }}>
        You do not have permission to view this page.  
        Please return to your dashboard or contact the administrator if you believe this is an error.
      </p>

      <button
        onClick={goBack}
        style={{
          marginTop: 25,
          padding: "10px 25px",
          fontSize: "1rem",
          borderRadius: 6,
          border: "none",
          backgroundColor: "#0d6efd",
          color: "#fff",
          cursor: "pointer",
        }}
      >
        Go to Dashboard
      </button>
    </div>
  );
};

export default AccessDenied;
