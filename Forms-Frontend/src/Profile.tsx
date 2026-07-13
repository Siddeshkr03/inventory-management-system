import { useEffect, useState } from "react";
import { Pencil, ShieldCheck, Eye, EyeOff } from "lucide-react";
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
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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

  const sendOtp = async () => {
    if (!profile) return;

    try {
      await api.post("/users/forgot-password", {
        email: profile.email,
      });

      toast.success("OTP sent successfully.");

      toast.success("OTP sent successfully.");

      setOtpSent(true);
    } catch (error: any) {
      console.error(error);

      if (error.response?.data) {
        toast.error(error.response.data);
      } else {
        toast.error("Unable to send OTP.");
      }
    }
  };

  const verifyOtp = async () => {
    if (!profile) return;

    if (!otp.trim()) {
      toast.error("Please enter the OTP.");
      return;
    }

    try {
      await api.post("/users/verify-otp", {
        email: profile.email,
        otp: otp,
      });

      toast.success("OTP verified successfully.");

      setOtpSent(false);
      setOtp("");
      setOtpVerified(true);
    } catch (error: any) {
      console.error(error);

      if (error.response?.data) {
        toast.error(error.response.data);
      } else {
        toast.error("OTP verification failed.");
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
            <button
              className="change-password-btn"
              onClick={() => setIsChangingPassword(!isChangingPassword)}
            >
              {isChangingPassword ? "Cancel" : "Change Password"}
            </button>

            {isChangingPassword && (
              <div className="password-section">
                <h3>
                  <ShieldCheck />
                </h3>

                <p>
                  A verification code will be sent to your registered email.
                </p>

                <div className="profile-field">
                  <label>Registered Email</label>

                  <input type="email" value={profile?.email || ""} readOnly />
                </div>

                <button className="profile-save-btn" onClick={sendOtp}>
                  Send OTP
                </button>

                {otpSent && (
                  <div className="otp-section">
                    <h3>OTP Verification</h3>

                    <p>Enter the OTP sent to your registered email.</p>

                    <div className="profile-field">
                      <label>OTP</label>

                      <input
                        type="text"
                        placeholder="Enter OTP"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                      />
                    </div>

                    <button className="profile-save-btn" onClick={verifyOtp}>
                      Verify OTP
                    </button>
                  </div>
                )}

                {otpVerified && (
                  <div className="reset-password-section">
                    <h3>Set New Password</h3>

                    <div className="profile-field">
                      <label>New Password</label>

                      <div className="password-input-container">
                        <input
                          type={showNewPassword ? "text" : "password"}
                          placeholder="Enter new password"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                        />

                        <button
                          type="button"
                          className="password-toggle-btn"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                        >
                          {showNewPassword ? (
                            <EyeOff size={20} />
                          ) : (
                            <Eye size={20} />
                          )}
                        </button>
                      </div>
                    </div>

                    <div className="profile-field">
                      <label>Confirm Password</label>

                      <div className="password-input-container">
                        <input
                          type={showConfirmPassword ? "text" : "password"}
                          placeholder="Confirm new password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                        />

                        <button
                          type="button"
                          className="password-toggle-btn"
                          onClick={() =>
                            setShowConfirmPassword(!showConfirmPassword)
                          }
                        >
                          {showConfirmPassword ? (
                            <EyeOff size={20} />
                          ) : (
                            <Eye size={20} />
                          )}
                        </button>
                      </div>
                    </div>

                    <button className="profile-save-btn">
                      Update Password
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default Profile;
