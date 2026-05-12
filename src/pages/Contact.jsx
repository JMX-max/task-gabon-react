import { useState } from "react";

export default function Contact() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [sent, setSent] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSent(true);
    setForm({ name: "", email: "", message: "" });
  };

  return (
    <main className="page">
      <section className="hero">
        <h1>Contact</h1>
        <p>Une page simple pour poser une question, demander une aide ou partager une idée de projet.</p>
      </section>

      <div className="home-grid">
        <div className="blog-card">
          <h2>Nous écrire</h2>
          <form onSubmit={handleSubmit} className="form">
            <input
              name="name"
              placeholder="Ton nom"
              value={form.name}
              onChange={handleChange}
            />
            <input
              name="email"
              placeholder="Ton email"
              value={form.email}
              onChange={handleChange}
            />
            <textarea
              name="message"
              placeholder="Ton message"
              value={form.message}
              onChange={handleChange}
            />
            <button type="submit">Envoyer</button>
          </form>

          {sent && <p style={{ marginTop: "12px", color: "green" }}>Message envoyé avec succès.</p>}
        </div>

        <div className="blog-card">
          <h2>Infos utiles</h2>
          <p><strong>Ville :</strong> Libreville</p>
          <p><strong>Projet :</strong> Application React de gestion de tâches</p>
          <p><strong>Utilisation :</strong> Pour un devoir, une présentation ou un mini projet scolaire</p>
          <p>
            Cette page peut servir à simuler un contact pour une petite équipe, un client ou un professeur.
          </p>
        </div>
      </div>
    </main>
  );
}