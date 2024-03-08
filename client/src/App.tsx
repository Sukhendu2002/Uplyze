import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import Nav from "./components/Nav";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import PrivateRoutes from "./utils/PrivateRoutes";

function App() {
  return (
    <Router>
      <Nav />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route element={<PrivateRoutes />}>
          <Route path="/dashboard" element={<div>Dashboard</div>} />
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
