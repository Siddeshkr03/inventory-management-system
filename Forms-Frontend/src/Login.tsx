import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Login.css";

function Login() {
  const navigate = useNavigate();
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });

  const [apiError, setApiError] = useState("");

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
         await axios.post(
        "http://localhost:8080/api/users/login",
        loginData,
      );

      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("userEmail", loginData.email);

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
        <h2>Login</h2>

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="login-group">
            <input
              type="email"
              name="email"
              placeholder="Enter Email"
              value={loginData.email}
              onChange={handleChange}
            />
            {errors.email && <p className="error-message">{errors.email}</p>}
          </div>

          <div className="login-group">
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

          {apiError && <p className="api-error">{apiError}</p>}

          <button className="login-btn">Login</button>
        </form>
      </div>
    </div>
  );
}

export default Login;
