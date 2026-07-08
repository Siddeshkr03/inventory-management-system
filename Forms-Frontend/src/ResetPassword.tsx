import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "./api";
import "./ResetPassword.css";

function ResetPassword() {
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email;

  useEffect(() => {
    if (!email) {
      navigate("/forgot-password");
    }
  }, [email, navigate]);

  const [newPassword, setNewPassword] = useState("");

  const [confirmPassword, setConfirmPassword] = useState("");

  const [errors, setErrors] = useState({
    newPassword: "",
    confirmPassword: "",
  });

  const [apiError, setApiError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === "newPassword") {
      setNewPassword(value);
    } else {
      setConfirmPassword(value);
    }

    setErrors({
      ...errors,
      [name]: "",
    });

    setApiError("");
  };

  const validate = () => {
    const newErrors = {
      newPassword: "",
      confirmPassword: "",
    };

    if (!newPassword.trim()) {
      newErrors.newPassword = "New Password is required";
    } else if (newPassword.length < 6) {
      newErrors.newPassword = "Password must be at least 6 characters";
    }

    if (!confirmPassword.trim()) {
      newErrors.confirmPassword = "Confirm Password is required";
    } else if (newPassword !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);

    return Object.values(newErrors).every((error) => error === "");
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    try {
      setApiError("");

      await api.post("/users/reset-password", {
        email,
        newPassword,
      });

      navigate("/login", {
        state: {
          message: "Password reset successful. Please login.",
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
  <div className="reset-password-page">
    <div className="reset-password-card">
      <h2>Reset Password</h2>

      <form onSubmit={handleSubmit}>
        <div className="reset-password-group">
          <input
            type="password"
            name="newPassword"
            placeholder="Enter New Password"
            value={newPassword}
            onChange={handleChange}
          />

          {errors.newPassword && (
            <p className="error-message">{errors.newPassword}</p>
          )}
        </div>

        <div className="reset-password-group">
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={handleChange}
          />

          {errors.confirmPassword && (
            <p className="error-message">{errors.confirmPassword}</p>
          )}
        </div>

        {apiError && <p className="api-error">{apiError}</p>}

        <button type="submit" className="reset-password-btn">
          Reset Password
        </button>
      </form>
    </div>
  </div>
  );
}

export default ResetPassword;
