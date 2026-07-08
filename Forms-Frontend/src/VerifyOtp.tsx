import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "./api";
import "./VerifyOtp.css";

function VerifyOtp() {
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email;

  useEffect(() => {
    if (!email) {
      navigate("/forgot-password");
    }
  }, [email, navigate]);

  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [apiError, setApiError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setOtp(e.target.value);

    setError("");

    setApiError("");
  };

  const validate = () => {
    if (!otp.trim()) {
      setError("OTP is required");

      return false;
    }

    if (!/^\d{6}$/.test(otp)) {
      setError("OTP must be 6 digits");

      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    try {
      setApiError("");

      await api.post("/users/verify-otp", {
        email,
        otp,
      });

      navigate("/reset-password", {
        state: {
          email,
        },
      });
    } catch (error: any) {
      if (error.response) {
        setApiError(error.response.data);
      } else {
        setApiError("Something went wrong.");
      }
    }
  };

  return (
    <div className="verify-otp-page">
      <div className="verify-otp-card">
        <h2>Verify OTP</h2>

        <p>Enter the OTP sent to your email.</p>

        <form onSubmit={handleSubmit}>
          <div className="verify-otp-group">
            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={handleChange}
            />

            {error && <p className="error-message">{error}</p>}
          </div>

          {apiError && <p className="api-error">{apiError}</p>}

          <button type="submit" className="verify-otp-btn">
            Verify OTP
          </button>
        </form>
      </div>
    </div>
  );
}

export default VerifyOtp;
