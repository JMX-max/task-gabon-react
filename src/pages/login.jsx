import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const user = JSON.parse(localStorage.getItem("task-gabon-user") || "null");

    if (user && user.email === email && user.password === password) {
      localStorage.setItem("task-gabon-current-user", JSON.stringify(user));
      navigate("/accueil");
      return;
    }

    setError("Email ou mot de passe incorrect.");
  };

  return (
    <main className="auth-page">
      <section className="auth-card">
        <h1>Connexion</h1>
        <p>Connecte-toi pour accéder à ton espace personnel.</p>

        <form className="form" onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Adresse email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Mot de passe"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button type="submit">Se connecter</button>
        </form>

        {error && <p className="error-text">{error}</p>}

        <p className="small-link">
          Pas encore inscrit ? <Link to="/register">Créer un compte</Link>
        </p>

        <div className="hint-box">
      
         
        </div>
      </section>
    </main>
  );
}