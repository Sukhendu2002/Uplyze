import { Outlet, Navigate } from "react-router-dom";

interface User {
  id: number;
  name: string;
  email: string;
}

const AuthRoutes = () => {
  const token = localStorage.getItem("token");
  const user: User | null = JSON.parse(localStorage.getItem("user") || "null");

  return token && user ? <Navigate to="/dashboard" /> : <Outlet />;
};

export default AuthRoutes;
