import { useEffect, useState } from "react";
import Navbar from "./Navbar";
import "./Profile.css";
import api from "./api";

function Profile() {
  interface Profile {
    id: number;
    fullName: string;
    email: string;
    profileImage: string | null;
  }

  const [profile, setProfile] = useState<Profile | null>(null);

  const fetchProfile = async () => {
    try {
      const response = await api.get("/profile");

      setProfile(response.data);
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  return (
    <>
      <Navbar />

      <div className="profile-page">
        <div className="profile-card">
          <h2 className="profile-title">My Profile</h2>

          <div className="profile-image-section">
            <div className="profile-avatar">👤</div>

            <div className="profile-image-buttons">
              <button type="button">Change Photo</button>

              <button type="button">Remove</button>
            </div>
          </div>

          <div className="profile-form">
            <div className="profile-form-group">
              <label>Full Name</label>

              <input type="text" value={profile?.fullName || ""} readOnly />
            </div>

            <div className="profile-form-group">
              <label>Email Address</label>

              <input type="email" value={profile?.email || ""} readOnly />
            </div>
          </div>

          <button type="button" className="profile-save-btn">
            Save Changes
          </button>

          <div className="profile-security">
            <h3>Security</h3>

            <p>Change your password anytime.</p>

            <button type="button">Change Password</button>
          </div>
        </div>
      </div>
    </>
  );
}

export default Profile;
