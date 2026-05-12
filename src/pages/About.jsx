export default function About() {
  return (
    <main className="page">
      <section className="hero">
        <h1>À propos</h1>
        <p>Découvre l’objectif du projet et son lien avec la réalité du quotidien au Gabon.</p>
      </section>

      <div className="blog-card">
        <h2>Présentation du projet</h2>
        <p>
          Task Gabon est une application web de gestion de tâches créée avec React pour montrer
          les bases du développement moderne : composants, props, state, hooks, formulaires,
          navigation et protection de pages.
        </p>
      </div>

      <div className="blog-card" style={{ marginTop: "18px" }}>
        <h2>Le lien avec la réalité gabonaise</h2>
        <p>
          Le projet reprend des situations simples que beaucoup d’élèves et de jeunes vivent au quotidien :
          préparer les cours, organiser les tâches familiales, gérer un petit projet, suivre des priorités
          et garder une bonne organisation même avec un emploi du temps chargé.
        </p>
      </div>

      <div className="blog-card" style={{ marginTop: "18px" }}>
        <h2>Ce que montre le projet</h2>
        <ul>
          <li>Une interface claire et facile à utiliser.</li>
          <li>Une gestion dynamique des tâches.</li>
          <li>Une navigation entre plusieurs pages.</li>
          <li>Une page de connexion avant l’accès à l’accueil.</li>
          <li>Une base adaptée à un projet scolaire sérieux.</li>
        </ul>
      </div>
    </main>
  );
}