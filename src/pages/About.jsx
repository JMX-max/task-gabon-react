export default function About() {
  return (
    <main className="page">
      <section className="hero">
        <h1>À propos de Task Gabon</h1>

        <p>
          Task Gabon est une application moderne de gestion de tâches
          développée avec React, Firebase et Node.js.
        </p>
      </section>

      <section className="blog-grid">
        <article className="blog-card">
          <h2>Pourquoi cette application ?</h2>

          <p>
            Beaucoup d’étudiants et de jeunes travailleurs au Gabon
            utilisent encore le papier ou WhatsApp pour gérer leurs tâches.
          </p>

          <p>
            Cette plateforme permet d’organiser :
          </p>

          <ul>
            <li>les devoirs ;</li>
            <li>les projets scolaires ;</li>
            <li>les tâches quotidiennes ;</li>
            <li>les activités professionnelles ;</li>
            <li>les rendez-vous importants.</li>
          </ul>
        </article>

        <article className="blog-card">
          <h2>Technologies utilisées</h2>

          <ul>
            <li>React JS</li>
            <li>Firebase Authentication</li>
            <li>Cloud Firestore</li>
            <li>Node.js</li>
            <li>Express</li>
            <li>Nodemailer SMTP</li>
          </ul>

          <p>
            Le projet respecte les principes modernes du développement web :
            composants, hooks, routes protégées, formulaires dynamiques et stockage cloud.
          </p>
        </article>
      </section>
    </main>
  );
}