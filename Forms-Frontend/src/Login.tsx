import { useState, useEffect } from "react";
import api from "./api";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import { saveToken } from "./token";
import { CircleUserRound, LockKeyhole } from "lucide-react";
import "./Login.css";

function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { checkAuth } = useAuth();
  const [successMessage, setSuccessMessage] = useState("");

  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });

  const [apiError, setApiError] = useState("");

  useEffect(() => {
    if (location.state?.message) {
      setSuccessMessage(location.state.message);

      navigate(location.pathname, {
        replace: true,
      });
    }
  }, [location, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setLoginData({
      ...loginData,
      [name]: value,
    });

    setErrors({
      ...errors,
      [name]: "",
    });

    setApiError("");
  };

  const validate = () => {
    const newErrors = {
      email: "",
      password: "",
    };

    if (!loginData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (
      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(loginData.email)
    ) {
      newErrors.email = "Enter a valid email address";
    }

    if (!loginData.password.trim()) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);

    return Object.values(newErrors).every((error) => error === "");
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    setApiError("");

    try {
      const response = await api.post("/users/login", loginData);

      saveToken(response.data.token);

      localStorage.setItem("user", JSON.stringify(response.data.user));

      await checkAuth();

      navigate("/");
    } catch (error: any) {
      if (error.response) {
        setApiError(error.response.data);
      } else {
        setApiError("Something went wrong. Please try again.");
      }
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        {successMessage && <p className="success-message">{successMessage}</p>}
        <h2>Login</h2>

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="login-group">
            <CircleUserRound />

            <div className="login-input-wrapper">
              <input
                type="email"
                name="email"
                placeholder="Enter Email"
                value={loginData.email}
                onChange={handleChange}
              />

              {errors.email && <p className="error-message">{errors.email}</p>}
            </div>
          </div>

          <div className="login-group">
            <LockKeyhole />

            <div className="login-input-wrapper">
              <input
                type="password"
                name="password"
                placeholder="Enter Password"
                value={loginData.password}
                onChange={handleChange}
              />

              {errors.password && (
                <p className="error-message">{errors.password}</p>
              )}
            </div>
          </div>

          {apiError && <p className="api-error">{apiError}</p>}

          <div className="forgot-password">
            <Link to="/forgot-password">Forgot Password?</Link>
          </div>

          <button className="login-btn">Login</button>

          <div className="register-link">
            <span>Don't have an account? </span>

            <Link to="/register">Register</Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
