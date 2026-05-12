const posts = [
  {
    id: 1,
    title: "Comment mieux s’organiser à l’école au Gabon",
    text:
      "Entre les devoirs, les exposés et les révisions, une application de tâches aide à garder l’esprit clair et à suivre les priorités du jour.",
  },
  {
    id: 2,
    title: "Pourquoi React est utile pour les jeunes développeurs",
    text:
      "React permet de créer des interfaces modernes, rapides et bien organisées. C’est une très bonne base pour apprendre le développement web.",
  },
  {
    id: 3,
    title: "Construire un petit projet utile et réaliste",
    text:
      "Un bon projet n’a pas besoin d’être énorme. Il doit être clair, bien structuré, et répondre à un besoin simple du quotidien.",
  },
  {
    id: 4,
    title: "Travail en équipe, méthode et discipline",
    text:
      "Dans un projet scolaire, répartir les tâches, suivre les priorités et garder le code propre sont des qualités très importantes.",
  },
];

export default function Blog() {
  return (
    <main className="page">
      <section className="hero">
        <h1>Blog</h1>
        <p>Petits articles pour présenter l’application et montrer une réflexion autour du projet.</p>
      </section>

      <div className="blog-grid">
        {posts.map((post) => (
          <article key={post.id} className="blog-card">
            <h2>{post.title}</h2>
            <p>{post.text}</p>
          </article>
        ))}
      </div>
    </main>
  );
}