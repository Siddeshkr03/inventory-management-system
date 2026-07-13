import { useEffect, useState } from "react";
import Navbar from "./Navbar";
import api from "./api";

function ChangePassword() {
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

      <div className="change-password-page">
        <div className="change-password-card">

          <h2>Change Password</h2>

          <p>
             Enter the verification code sent to your registered email address.
          </p>

          <div className="registered-email">
            <label>Registered Email</label>

            <input
              type="email"
              value={profile?.email || ""}
              readOnly
            />
          </div>

          <button>
            Send OTP
          </button>

        </div>
      </div>
    </>
  );
}

export default ChangePassword;