import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";

interface PublicRouteProps {
  children: React.ReactNode;
}

function PublicRoute({ children }: PublicRouteProps) {
  const [isLoggedIn, setIsLoggedIn] = useState(
  localStorage.getItem("isLoggedIn")
);

useEffect(() => {
  const handleStorageChange = () => {
    setIsLoggedIn(localStorage.getItem("isLoggedIn"));
  };

  window.addEventListener("storage", handleStorageChange);

  return () => {
    window.removeEventListener("storage", handleStorageChange);
  };
}, []);

  if (isLoggedIn) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}

export default PublicRoute;