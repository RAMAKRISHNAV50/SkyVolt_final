import { useState } from "react";
import { useNavigate } from "react-router-dom";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const handleSendOtp = () => {
    if (!email) {
      alert("Please enter email");
      return;
    }

    const users = JSON.parse(localStorage.getItem("users")) || [];
    const userExists = users.find((u) => u.email === email);

    if (!userExists) {
      alert("Email not registered");
      return;
    }

    const otp = Math.floor(100000 + Math.random() * 900000);
    const expiry = Date.now() + 2 * 60 * 1000; // 2 minutes

    localStorage.setItem(
      "otpData",
      JSON.stringify({ email, otp, expiry })
    );

    alert(`Demo OTP (copy this): ${otp}`);
    navigate("/verify-otp");
  };

  return (
    <div className="auth-bg min-vh-100 d-flex justify-content-center align-items-center">
      <div className="auth-card p-4" style={{ width: 380 }}>
        <h4 className="text-center mb-3">Forgot Password</h4>

        <input
          className="form-control mb-3"
          placeholder="Registered Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <button className="btn btn-primary w-100" onClick={handleSendOtp}>
          Send OTP
        </button>
      </div>
    </div>
  );
};

export default ForgotPassword;
