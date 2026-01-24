
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import windSensorData from "../data/windSensorData";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleSignup = async () => {
    // ✅ Basic validation
    if (!name || !email || !mobile || !password) {
      alert("Please fill all fields");
      return;
    }

    // ✅ Mobile validation
    if (mobile.length !== 10) {
      alert("Please enter a valid 10-digit mobile number");
      return;
    }

    // 🔒 DATASET EMAIL VALIDATION
    const allowed = windSensorData.some(
      d => d.user_email?.toLowerCase() === email.toLowerCase()
    );

    if (!allowed) {
      alert("This email is not authorized to register");
      return;
    }

    // ✅ Signup call
    const success = await signup(email, password, name, mobile);

    if (!success) {
      alert("Signup failed (Email may already exist)");
      return;
    }

    alert("Signup successful 🎉 You can now login");
    navigate("/login");
  };

  return (
    <div className="auth-bg min-vh-100 d-flex justify-content-center align-items-center">
      <div className="auth-card p-4 shadow-lg" style={{ width: 380 }}>
        <h3 className="text-center mb-4 auth-title">Create Account</h3>

        {/* Full Name */}
        <input
          className="form-control mb-3 auth-input"
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        {/* Email */}
        <input
          className="form-control mb-3 auth-input"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        {/* Mobile Number */}
        <input
          className="form-control mb-3 auth-input"
          placeholder="Mobile Number"
          value={mobile}
          maxLength={10}
          onChange={(e) =>
            setMobile(e.target.value.replace(/\D/g, ""))
          }
        />

        {/* Password */}
        <div className="position-relative mb-3">
          <input
            className="form-control auth-input"
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <span
            onClick={() => setShowPassword(!showPassword)}
            style={{
              position: "absolute",
              right: 12,
              top: "50%",
              transform: "translateY(-50%)",
              cursor: "pointer",
            }}
          >
            {showPassword ? "🙈" : "👁️"}
          </span>
        </div>

        {/* Signup Button */}
        <button className="btn btn-success w-100" onClick={handleSignup}>
          Signup
        </button>

        <p className="text-center mt-4">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
