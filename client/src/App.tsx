import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import Nav from "./components/Nav";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import PrivateRoutes from "./utils/PrivateRoutes";
import AuthRoutes from "./utils/AuthRoutes";
import AuthNav from "./components/AuthNav";
import useAuthStore from "../store";
import Dashboard from "./pages/Dashboard";

function App() {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const setIsLoggedIn = useAuthStore((state) => state.setIsLoggedIn);
  const logout = useAuthStore((state) => state.logout);
  console.log(isLoggedIn);

  return (
    <Router>
      {isLoggedIn ? <AuthNav onLogout={logout} /> : <Nav />}

      <Routes>
        <Route element={<AuthRoutes />}>
          <Route path="/" element={<Landing />} />
          <Route
            path="/login"
            element={<Login onLogin={() => setIsLoggedIn(true)} />}
          />
          <Route path="/signup" element={<SignUp />} />
        </Route>
        <Route element={<PrivateRoutes />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<div>Profile</div>} />
        </Route>
        <Route
          path="/*"
          element={
            <div style={{ textAlign: "center", marginTop: "10rem" }}>
              <h1>404</h1>
              <p>Page Not Found</p>
            </div>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
