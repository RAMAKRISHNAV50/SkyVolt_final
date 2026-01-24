import { useState } from "react";
import { useNavigate } from "react-router-dom";

const VerifyOtp = () => {
  const [otp, setOtp] = useState("");
  const navigate = useNavigate();

  const handleVerifyOtp = () => {
    const data = JSON.parse(localStorage.getItem("otpData"));

    if (!data) {
      alert("OTP expired");
      return;
    }

    if (Date.now() > data.expiry) {
      localStorage.removeItem("otpData");
      alert("OTP expired");
      return;
    }

    if (Number(otp) !== data.otp) {
      alert("Invalid OTP");
      return;
    }

    navigate("/reset-password");
  };

  return (
    <div className="auth-bg min-vh-100 d-flex justify-content-center align-items-center">
      <div className="auth-card p-4" style={{ width: 380 }}>
        <h4 className="text-center mb-3">Verify OTP</h4>

        <input
          className="form-control mb-3"
          placeholder="Enter OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
        />

        <button className="btn btn-success w-100" onClick={handleVerifyOtp}>
          Verify OTP
        </button>
      </div>
    </div>
  );
};

export default VerifyOtp;
