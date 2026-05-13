import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Navbar.css";

export default function Navbar() {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <nav className="navbar">
      <div className="logo">
        <h2>Task Gabon</h2>
      </div>

      <div className="nav-links">
        <NavLink to="/accueil">Accueil</NavLink>
        <NavLink to="/blog">Blog</NavLink>
        <NavLink to="/a-propos">À propos</NavLink>
        <NavLink to="/contact">Contact</NavLink>
      </div>

      <div className="user-box">
        <span>
          {user?.displayName || user?.email}
        </span>

        <button onClick={handleLogout}>
          Déconnexion
        </button>
      </div>
    </nav>
  );
}