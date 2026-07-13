import { useEffect, useState } from "react";
import Navbar from "./Navbar";
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

      <div>
        <h2>My Profile</h2>

        {profile && (
          <>
            <p>Name: {profile.fullName}</p>
            <p>Email: {profile.email}</p>
          </>
        )}
      </div>
    </>
  );
}

export default Profile;