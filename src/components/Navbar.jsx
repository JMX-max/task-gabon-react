import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Navbar.css";

export default function Navbar() {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="navbar">
      <div className="navbar__brand">Task Gabon</div>

      <nav className="navbar__links">
        <NavLink to="/accueil">Accueil</NavLink>
        <NavLink to="/a-propos">À propos</NavLink>
        <NavLink to="/blog">Blog</NavLink>
        <NavLink to="/contact">Contact</NavLink>
      </nav>

      <div className="navbar__right">
        <span>{user?.name}</span>
        <button onClick={handleLogout}>Déconnexion</button>
      </div>
    </header>
  );
}