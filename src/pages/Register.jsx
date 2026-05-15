import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const API_URL =
  import.meta.env.VITE_API_URL || "https://task-gabon-react-1.onrender.com";

export default function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    nom: "",
    prenom: "",
    email: "",
    genre: "",
    nationalite: "",
    telephone: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showCodeModal, setShowCodeModal] = useState(false);
  const [code, setCode] = useState("");
  const [pendingEmail, setPendingEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(false);

  const updateField = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!form.nom.trim() || !form.prenom.trim() || !form.email.trim()) {
      setError("Le nom, le prénom et l'email sont obligatoires.");
      return;
    }

    if (!form.password.trim()) {
      setError("Le mot de passe est obligatoire.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(`${API_URL}/api/send-code`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: form.email,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Impossible d'envoyer le code.");
      }

      setPendingEmail(form.email);
      setShowCodeModal(true);
      setSuccess("Un code de confirmation a été envoyé à ton email.");
    } catch (err) {
      setError(err.message || "Erreur lors de l'inscription.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async (e) => {
    e.preventDefault();
    setError("");

    try {
      setVerifying(true);

      const response = await fetch(`${API_URL}/api/verify-code`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: pendingEmail,
          code,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Code incorrect.");
      }

      const user = {
        nom: form.nom,
        prenom: form.prenom,
        email: form.email,
        genre: form.genre,
        nationalite: form.nationalite,
        telephone: form.telephone,
        password: form.password,
      };

      localStorage.setItem("task-gabon-user", JSON.stringify(user));
      localStorage.setItem("task-gabon-current-user", JSON.stringify(user));

      setShowCodeModal(false);
      navigate("/accueil");
    } catch (err) {
      setError(err.message || "Échec de vérification.");
    } finally {
      setVerifying(false);
    }
  };

  return (
    <>
      <main className="auth-page">
        <section className="auth-card">
          <h1>Inscription</h1>
          <p>Crée ton compte puis valide le code envoyé par email.</p>

          <form className="form" onSubmit={handleRegister}>
            <input
              type="text"
              name="nom"
              placeholder="Nom *"
              value={form.nom}
              onChange={updateField}
            />

            <input
              type="text"
              name="prenom"
              placeholder="Prénom *"
              value={form.prenom}
              onChange={updateField}
            />

            <input
              type="email"
              name="email"
              placeholder="Email *"
              value={form.email}
              onChange={updateField}
            />

            <input
              type="text"
              name="genre"
              placeholder="Genre (optionnel)"
              value={form.genre}
              onChange={updateField}
            />

            <input
              type="text"
              name="nationalite"
              placeholder="Nationalité (optionnel)"
              value={form.nationalite}
              onChange={updateField}
            />

            <input
              type="text"
              name="telephone"
              placeholder="Numéro de téléphone (optionnel)"
              value={form.telephone}
              onChange={updateField}
            />

            <input
              type="password"
              name="password"
              placeholder="Mot de passe *"
              value={form.password}
              onChange={updateField}
            />

            <button type="submit" disabled={loading}>
              {loading ? "Envoi du code..." : "Valider l'inscription"}
            </button>
          </form>

          {error && <p className="error-text">{error}</p>}
          {success && <p className="info-text">{success}</p>}

          <p className="small-link">
            Déjà inscrit ? <Link to="/login">Se connecter</Link>
          </p>
        </section>
      </main>

      {showCodeModal && (
        <div className="modal-overlay">
          <div className="modal-card">
            <h2>Vérification du code</h2>
            <p>
              Entre le code reçu sur <strong>{pendingEmail}</strong>.
            </p>

            <form className="form" onSubmit={handleVerifyCode}>
              <input
                type="text"
                placeholder="Code de confirmation"
                value={code}
                onChange={(e) => setCode(e.target.value)}
              />

              <button type="submit" disabled={verifying}>
                {verifying ? "Vérification..." : "Confirmer"}
              </button>
            </form>

            {error && <p className="error-text">{error}</p>}
          </div>
        </div>
      )}
    </>
  );
}