import { Outlet, Navigate } from "react-router-dom";

interface User {
  id: number;
  name: string;
  email: string;
}

const PrivateRoutes = () => {
  const token = localStorage.getItem("token");
  const user: User | null = JSON.parse(localStorage.getItem("user") || "null");

  return token && user ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoutes;
