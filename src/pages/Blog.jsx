export default function Blog() {
  const articles = [
    {
      title: "Organisation des étudiants à Libreville",
      content:
        "De nombreux étudiants gabonais ont du mal à organiser leurs projets universitaires. Une bonne gestion des tâches améliore la productivité.",
    },
    {
      title: "Pourquoi utiliser le cloud ?",
      content:
        "Grâce à Firebase, les tâches sont sauvegardées en ligne et accessibles depuis plusieurs appareils.",
    },
    {
      title: "Le développement web au Gabon",
      content:
        "Le secteur du numérique évolue rapidement au Gabon avec l’augmentation des formations en développement web et mobile.",
    },
  ];

  return (
    <main className="page">
      <section className="hero">
        <h1>Blog</h1>

        <p>
          Découvrez des articles sur la productivité,
          les études et le numérique au Gabon.
        </p>
      </section>

      <section className="blog-grid">
        {articles.map((article, index) => (
          <article key={index} className="blog-card">
            <h2>{article.title}</h2>
            <p>{article.content}</p>
          </article>
        ))}
      </section>
    </main>
  );
}