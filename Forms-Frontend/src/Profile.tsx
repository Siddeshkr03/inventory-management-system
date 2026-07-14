import { useEffect, useState, useRef } from "react";
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
  const securitySectionRef = useRef<HTMLDivElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

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

      // Update Navbar data
      const storedUser = localStorage.getItem("user");

      if (storedUser) {
        const user = JSON.parse(storedUser);

        user.name = response.data.fullName;
        user.email = response.data.email;

        localStorage.setItem("user", JSON.stringify(user));
      }

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

  const updatePassword = async () => {
    if (!profile) return;

    if (!newPassword.trim()) {
      toast.error("New password is required.");
      return;
    }

    if (!confirmPassword.trim()) {
      toast.error("Confirm password is required.");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    try {
      await api.post("/users/reset-password", {
        email: profile.email,
        newPassword: newPassword,
      });

      toast.success("Password updated successfully.");

      setIsChangingPassword(false);
      setOtpSent(false);
      setOtpVerified(false);

      setOtp("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error: any) {
      console.error(error);

      if (error.response?.data) {
        toast.error(error.response.data);
      } else {
        toast.error("Unable to update password.");
      }
    }
  };

  const handleProfilePhotoChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];

    if (!file) return;

    const formData = new FormData();

    formData.append("file", file);

    try {
      const response = await api.post("/users/profile/photo", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setProfile(response.data);
      setEditProfile(response.data);

      const storedUser = localStorage.getItem("user");

      if (storedUser) {
        const user = JSON.parse(storedUser);

        user.profileImage = response.data.profileImage;

        localStorage.setItem("user", JSON.stringify(user));
      }

      toast.success("Profile photo updated successfully.");
    } catch (error: any) {
      console.error(error);

      if (error.response?.data) {
        toast.error(error.response.data);
      } else {
        toast.error("Unable to upload profile photo.");
      }
    }
  };

  const removeProfilePhoto = async () => {
    if (!profile?.profileImage) {
      toast.info("No profile photo to remove.");
      return;
    }

    const confirmRemove = window.confirm(
      "Are you sure you want to remove your profile photo?",
    );

    if (!confirmRemove) return;

    try {
      const response = await api.delete("/users/profile/photo");

      setProfile(response.data);
      setEditProfile(response.data);

      const storedUser = localStorage.getItem("user");

      if (storedUser) {
        const user = JSON.parse(storedUser);

        user.profileImage = response.data.profileImage;

        localStorage.setItem("user", JSON.stringify(user));
      }

      toast.success("Profile photo removed successfully.");
    } catch (error: any) {
      console.error(error);

      if (error.response?.data) {
        toast.error(error.response.data);
      } else {
        toast.error("Unable to remove profile photo.");
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
            <div className="profile-avatar">
              {profile?.profileImage ? (
                <img
                  src={`http://localhost:8080/api/files/${profile.profileImage}`}
                  alt="Profile"
                  className="profile-avatar-image"
                />
              ) : (
                "👤"
              )}
            </div>
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              style={{ display: "none" }}
              onChange={handleProfilePhotoChange}
            />

            <div className="profile-image-buttons">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
              >
                {profile?.profileImage ? "Change Photo" : "Upload Photo"}
              </button>

              {profile?.profileImage && (
                <button type="button" onClick={removeProfilePhoto}>
                  Remove
                </button>
              )}
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

          <div className="profile-security" ref={securitySectionRef}>
            <button
              className="change-password-btn"
              onClick={() => {
                const opening = !isChangingPassword;

                setIsChangingPassword(opening);

                if (opening) {
                  setTimeout(() => {
                    securitySectionRef.current?.scrollIntoView({
                      behavior: "smooth",
                      block: "start",
                    });
                  }, 100);
                }
              }}
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

                    <button className="profile-up-btn" onClick={updatePassword}>
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
