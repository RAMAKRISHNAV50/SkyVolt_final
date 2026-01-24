import { useState } from "react";
import { useNavigate } from "react-router-dom";

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState("");
  const navigate = useNavigate();

  const handleResetPassword = () => {
    if (!newPassword) {
      alert("Enter new password");
      return;
    }

    const otpData = JSON.parse(localStorage.getItem("otpData"));
    if (!otpData) {
      alert("Session expired");
      return;
    }

    const users = JSON.parse(localStorage.getItem("users")) || [];

    const updatedUsers = users.map((u) =>
      u.email === otpData.email ? { ...u, password: newPassword } : u
    );

    localStorage.setItem("users", JSON.stringify(updatedUsers));
    localStorage.removeItem("otpData");

    alert("Password changed successfully ✅");
    navigate("/login");
  };

  return (
    <div className="auth-bg min-vh-100 d-flex justify-content-center align-items-center">
      <div className="auth-card p-4" style={{ width: 380 }}>
        <h4 className="text-center mb-3">Reset Password</h4>

        <input
          type="password"
          className="form-control mb-3"
          placeholder="New Password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />

        <button className="btn btn-success w-100" onClick={handleResetPassword}>
          Update Password
        </button>
      </div>
    </div>
  );
};

export default ResetPassword;
