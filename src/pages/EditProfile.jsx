import { useState } from "react";
import { useAuth } from "../auth/AuthContext";
import { useNavigate } from "react-router-dom";

const EditProfile = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  /* PROFILE FIELDS */
  const [firstName, setFirstName] = useState("Rama");
  const [lastName, setLastName] = useState("Krishna");
  const [email, setEmail] = useState(user?.email || "");
  const [mobile, setMobile] = useState("");
  const [address, setAddress] = useState("");
  const [error, setError] = useState("");

  /* PROFILE IMAGE */
  const [profileImage, setProfileImage] = useState(
    "https://cdn-icons-png.flaticon.com/512/149/149071.png"
  );

  /* IMAGE CHANGE */
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setProfileImage(URL.createObjectURL(file));
  };

  /* SAVE */
  const handleSave = () => {
    setError("");

    if (!firstName || !lastName || !email || !mobile) {
      setError("Please fill all required fields");
      return;
    }

    alert("Profile updated successfully ✅");
    navigate("/client-dashboard");
  };

  return (
    <div className="edit-profile-page mt-5 mb-5">
      <div className="edit-profile-card">
        <h2>Edit Profile</h2>

        {/* PROFILE IMAGE */}
        <div className="profile-image-section">
          <img src={profileImage} alt="Profile" />
          <label className="change-photo-btn">
            Change Photo
            <input
              type="file"
              accept="image/*"
              hidden
              onChange={handleImageChange}
            />
          </label>
        </div>

        {/* FORM */}
        <div className="form-row">
          <div className="form-group">
            <label>First Name</label>
            <input
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="Enter first name"
            />
          </div>

          <div className="form-group">
            <label>Last Name</label>
            <input
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Enter last name"
            />
          </div>
        </div>

        <div className="form-group">
          <label>Email</label>
          <input value={email} disabled />
        </div>

        <div className="form-group">
          <label>Mobile Number</label>
          <input
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}
            placeholder="Enter mobile number"
          />
        </div>

        <div className="form-group">
          <label>Address</label>
          <textarea
            rows="3"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Enter address"
          />
        </div>

        {error && <p className="error-text">{error}</p>}

        {/* BUTTONS */}
        <div className="button-group">
          <button className="save-btn" onClick={handleSave}>
            Save Changes
          </button>
          <button
            className="cancel-btn"
            onClick={() => navigate("/client-dashboard")}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;
