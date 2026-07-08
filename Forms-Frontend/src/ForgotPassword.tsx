import { useState } from "react";
import api from "./api";
import { useNavigate } from "react-router-dom";
import "./ForgotPassword.css";

function ForgotPassword() {
  const [email, setEmail] = useState("");

  const [error, setError] = useState("");

  const [apiError, setApiError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);

    setError("");

    setApiError("");
  };

  const validate = () => {
    if (!email.trim()) {
      setError("Email is required");

      return false;
    }

    if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email)) {
      setError("Enter a valid email address");

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

      await api.post("/users/forgot-password", {
        email,
      });

      navigate("/verify-otp", {
        state: {
          email,
        },
      });
    } catch (error: any) {
      if (error.response) {
        setApiError(error.response.data);
      } else {
        setApiError("Something went wrong. Please try again.");
      }
    }
  };

  return (
    <div className="forgot-password-page">
      <div className="forgot-password-card">
        <h2>Forgot Password</h2>

        <p>Enter your registered email address to receive an OTP.</p>

        <form onSubmit={handleSubmit}>
          <div className="forgot-password-group">
            <input
              type="email"
              placeholder="Enter Registered Email"
              value={email}
              onChange={handleChange}
            />

            {error && <p className="error-message">{error}</p>}
          </div>

          {apiError && <p className="api-error">{apiError}</p>}

          <button type="submit" className="forgot-password-btn">
            Send OTP
          </button>
        </form>
      </div>
    </div>
  );
}

export default ForgotPassword;
