// import { useState } from "react";
// import { useNavigate, Link } from "react-router-dom";
// import { useAuth } from "../auth/AuthContext";

// const Signup = () => {
//   const [name, setName] = useState("");          // ✅ NEW
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [showPassword, setShowPassword] = useState(false); // ✅ NEW

//   const { signup } = useAuth();
//   const navigate = useNavigate();

//   const handleSignup = () => {
//     if (!name || !email || !password) {
//       alert("Please fill all fields");
//       return;
//     }

//     const success = signup(email, password, name);

//     if (!success) {
//       alert("User already exists");
//       return;
//     }

//     alert("Signup successful. Please login.");
//     navigate("/login");
//   };

//   return (
//     <div className="auth-bg min-vh-100 d-flex justify-content-center align-items-center">
//       <div className="auth-card p-4 shadow-lg" style={{ width: 380 }}>
//         <h3 className="text-center mb-4 auth-title">
//           Create Account
//         </h3>

//         {/* ✅ NAME */}
//         <input
//           className="form-control mb-3 auth-input"
//           placeholder="Full Name"
//           value={name}
//           onChange={(e) => setName(e.target.value)}
//         />

//         {/* EMAIL */}
//         <input
//           className="form-control mb-3 auth-input"
//           placeholder="Email"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//         />

//         {/* ✅ PASSWORD WITH EYE ICON */}
//         <div className="position-relative mb-3">
//           <input
//             className="form-control auth-input"
//             type={showPassword ? "text" : "password"}
//             placeholder="Password"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//           />

//           <span
//             onClick={() => setShowPassword(!showPassword)}
//             style={{
//               position: "absolute",
//               right: 12,
//               top: "50%",
//               transform: "translateY(-50%)",
//               cursor: "pointer",
//               fontSize: 18
//             }}
//             title={showPassword ? "Hide password" : "Show password"}
//           >
//             {showPassword ? "🙈" : "👁️"}
//           </span>
//         </div>

//         {/* SIGNUP BUTTON */}
//         <button
//           className="btn btn-success w-100 auth-btn"
//           onClick={handleSignup}
//         >
//           Signup
//         </button>

//         <p className="text-center mt-4">
//           Already have an account?{" "}
//           <Link to="/login" className="signup-link">
//             Login
//           </Link>
//         </p>
//       </div>
//     </div>
//   );
// };

// export default Signup;


// import { useState } from "react";
// import { useNavigate, Link } from "react-router-dom";
// import { useAuth } from "../auth/AuthContext";

// const Signup = () => {
//   const [name, setName] = useState("");
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [showPassword, setShowPassword] = useState(false);

//   const { signup } = useAuth();
//   const navigate = useNavigate();

//   const handleSignup = async () => {
//     if (!name || !email || !password) {
//       alert("Please fill all fields");
//       return;
//     }

//     const success = await signup(email, password, name);

//     if (!success) {
//       alert("Signup failed (Email may already exist)");
//       return;
//     }

//     alert("Signup successful 🎉");
//     navigate("/login");
//   };

//   return (
//     <div className="auth-bg min-vh-100 d-flex justify-content-center align-items-center">
//       <div className="auth-card p-4 shadow-lg" style={{ width: 380 }}>
//         <h3 className="text-center mb-4 auth-title">Create Account</h3>

//         <input
//           className="form-control mb-3 auth-input"
//           placeholder="Full Name"
//           value={name}
//           onChange={(e) => setName(e.target.value)}
//         />

//         <input
//           className="form-control mb-3 auth-input"
//           placeholder="Email"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//         />

//         <div className="position-relative mb-3">
//           <input
//             className="form-control auth-input"
//             type={showPassword ? "text" : "password"}
//             placeholder="Password"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//           />
//           <span
//             onClick={() => setShowPassword(!showPassword)}
//             style={{
//               position: "absolute",
//               right: 12,
//               top: "50%",
//               transform: "translateY(-50%)",
//               cursor: "pointer"
//             }}
//           >
//             {showPassword ? "🙈" : "👁️"}
//           </span>
//         </div>

//         <button className="btn btn-success w-100" onClick={handleSignup}>
//           Signup
//         </button>

//         <p className="text-center mt-4">
//           Already have an account?{" "}
//           <Link to="/login">Login</Link>
//         </p>
//       </div>
//     </div>
//   );
// };

// export default Signup;

import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import windSensorData from "../data/windSensorData";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleSignup = async () => {
    if (!name || !email || !password) {
      alert("Please fill all fields");
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

    const success = await signup(email, password, name);

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

        <input
          className="form-control mb-3 auth-input"
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          className="form-control mb-3 auth-input"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

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
