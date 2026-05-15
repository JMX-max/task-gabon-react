import { useState } from "react";

export default function Contact() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [success, setSuccess] = useState("");

  const updateField = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSuccess("Message envoyé avec succès.");
    setForm({
      name: "",
      email: "",
      message: "",
    });
  };

  return (
    <main className="page">
      <section className="hero">
        <h1>Contact</h1>
        <p>Une question, une suggestion ou un problème ?</p>
      </section>

      <section className="contact-container">
        <div className="blog-card">
          <h2>Informations</h2>
          <p>📍 Libreville - Gabon</p>
          <p>📧 contact@taskgabon.com</p>
          <p>📞 +241 74 00 00 00</p>
        </div>

        <form className="blog-card" onSubmit={handleSubmit}>
          <h2>Envoyer un message</h2>

          <input
            type="text"
            name="name"
            placeholder="Votre nom"
            value={form.name}
            onChange={updateField}
          />

          <input
            type="email"
            name="email"
            placeholder="Votre email"
            value={form.email}
            onChange={updateField}
          />

          <textarea
            name="message"
            placeholder="Votre message"
            rows="6"
            value={form.message}
            onChange={updateField}
          />

          <button type="submit">Envoyer</button>

          {success && <p style={{ color: "green", marginTop: 10 }}>{success}</p>}
        </form>
      </section>
    </main>
  );
}