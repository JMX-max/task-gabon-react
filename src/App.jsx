import { Navigate, Route, Routes } from "react-router-dom";
import login from "./pages/login";
import Register from "./pages/Register";
import Home from "./pages/Home";

function ProtectedRoute({ children }) {
  const user = JSON.parse(localStorage.getItem("task-gabon-user") || "null");

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route
        path="/accueil"
        element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}