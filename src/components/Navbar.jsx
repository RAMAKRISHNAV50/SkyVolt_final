import { NavLink, useNavigate } from "react-router-dom";
import { FaUserCircle, FaSignOutAlt, FaUserEdit } from "react-icons/fa";
import { useEffect, useState } from "react";
import { useAuth } from "../auth/AuthContext";
import logo from "../assets/logo-png.png";

const colors = ["#22c55e", "#38bdf8", "#facc15", "#a855f7"];

const Navbar = () => {
  const navigate = useNavigate();
  const { user, role, logout } = useAuth(); // ✅ FIXED

  const isLoggedIn = !!user;
  const userEmail = user?.email;

  const [titleColor, setTitleColor] = useState(colors[0]);
  const [showProfile, setShowProfile] = useState(false);

  /* 🔁 Title color animation */
  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      index = (index + 1) % colors.length;
      setTitleColor(colors[index]);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  const handleLogout = async () => {
    await logout();
    setShowProfile(false);
    navigate("/login");
  };

  return (
    <nav className="navbar navbar-expand-lg skyvolt-navbar px-3 shadow-sm">
      {/* LOGO */}
      <NavLink to="/" className="navbar-brand d-flex align-items-center gap-2">
        <img src={logo} alt="logo" className="skyvolt-logo" />
        <h4 className="m-0 skyvolt-title" style={{ color: titleColor }}>
          SKYVOLT
        </h4>
      </NavLink>

      {/* TOGGLER */}
      <button
        className="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#skyvoltNav"
      >
        <span className="navbar-toggler-icon"></span>
      </button>

      {/* MENU */}
      <div className="collapse navbar-collapse" id="skyvoltNav">
        {/* CENTER LINKS */}
        <ul className="navbar-nav mx-auto gap-lg-4 text-center">
          <li className="nav-item">
            <NavLink className="nav-link" to="/">Home</NavLink>
          </li>
          <li className="nav-item">
            <NavLink className="nav-link" to="/about">About</NavLink>
          </li>
          <li className="nav-item">
            <NavLink className="nav-link" to="/contact">Contact</NavLink>
          </li>

          {/* ADMIN LINKS */}
          {isLoggedIn && role === "admin" && (
            <>
              <li className="nav-item">
                <NavLink className="nav-link" to="/admin-dashboard">
                  Dashboard
                </NavLink>
              </li>

            </>
          )}

          {/* CLIENT LINKS */}
          {isLoggedIn && role === "client" && (
            <li className="nav-item">
              <NavLink className="nav-link" to="/client-dashboard">
                 Dashboard
              </NavLink>
            </li>
          )}
        </ul>

        {/* RIGHT SIDE */}
        <div className="d-lg-flex align-items-center gap-3 text-center">
          {!isLoggedIn ? (
            <>
              <button
                className="btn btn-outline-info w-100 my-1"
                onClick={() => navigate("/login")}
              >
                Login
              </button>
              <button
                className="btn btn-warning w-100 my-1"
                onClick={() => navigate("/signup")}
              >
                Signup
              </button>
            </>
          ) : (
            <div className="position-relative user-dropdown">
              <FaUserCircle
                className="user-icon"
                onClick={() => setShowProfile(!showProfile)}
              />

              {showProfile && (
                <div className="profile-menu shadow">
                  <p className="email">{userEmail}</p>

                  <button
                    className="btn btn-sm btn-outline-primary w-100 mb-2"
                    onClick={() => {
                      setShowProfile(false);
                      navigate("/edit-profile");
                    }}
                  >
                    <FaUserEdit /> Change Profile
                  </button>

                  <button
                    className="btn btn-sm btn-outline-danger w-100"
                    onClick={handleLogout}
                  >
                    <FaSignOutAlt /> Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
