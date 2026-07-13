import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Pencil } from "lucide-react";
import { toast } from "react-toastify";
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
  const [editProfile, setEditProfile] = useState<Profile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();

  const fetchProfile = async () => {
    try {
      const response = await api.get("/users/profile");

      setProfile(response.data);
      setEditProfile(response.data);
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  };

  const updateProfile = async () => {
    if (!editProfile) return;

    if (!editProfile.fullName.trim()) {
      toast.error("Name is required.");
      return;
    }

    if (!editProfile.email.trim()) {
      toast.error("Email is required.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(editProfile.email)) {
      toast.error("Please enter a valid email address.");
      return;
    }

    try {
      const response = await api.put("/users/profile", {
        fullName: editProfile.fullName,
        email: editProfile.email,
      });

      setProfile(response.data);
      setEditProfile(response.data);
      setIsEditing(false);

      toast.success("Profile updated successfully.");
    } catch (error: any) {
      console.error("Error updating profile:", error);

      if (error.response?.data) {
        toast.error(error.response.data);
      } else {
        toast.error("Unable to update profile.");
      }
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
          <div className="profile-header">
            <h2 className="profile-title">My Profile</h2>

            {!isEditing && (
              <button
                type="button"
                className="profile-edit-btn"
                onClick={() => setIsEditing(true)}
              >
                <Pencil size={18} />
                Edit Profile
              </button>
            )}
          </div>

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

              {isEditing ? (
                <input
                  type="text"
                  value={editProfile?.fullName || ""}
                  onChange={(e) =>
                    setEditProfile((prev) =>
                      prev
                        ? {
                            ...prev,
                            fullName: e.target.value,
                          }
                        : null,
                    )
                  }
                />
              ) : (
                <p className="profile-text">{profile?.fullName}</p>
              )}
            </div>

            <div className="profile-form-group">
              <label>Email Address</label>

              {isEditing ? (
                <input
                  type="email"
                  value={editProfile?.email || ""}
                  onChange={(e) =>
                    setEditProfile((prev) =>
                      prev
                        ? {
                            ...prev,
                            email: e.target.value,
                          }
                        : null,
                    )
                  }
                />
              ) : (
                <p className="profile-text">{profile?.email}</p>
              )}
            </div>
          </div>

          {isEditing && (
            <div className="profile-action-buttons">
              <button
                type="button"
                className="profile-cancel-btn"
                onClick={() => {
                  setEditProfile(profile ? { ...profile } : null);
                  setIsEditing(false);
                }}
              >
                Cancel
              </button>

              <button
                type="button"
                className="profile-save-btn"
                onClick={updateProfile}
              >
                Save Changes
              </button>
            </div>
          )}

          <div className="profile-security">
            <button type="button" onClick={() => navigate("/profile/change-password")}>
              Change Password
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default Profile;
