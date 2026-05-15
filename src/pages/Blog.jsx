export default function Blog() {
  const posts = [
    {
      title: "Comment mieux s’organiser à l’école",
      content:
        "Une liste de tâches aide à suivre les cours, les révisions et les exposés sans tout mélanger.",
    },
    {
      title: "Pourquoi React est utile",
      content:
        "React permet de découper l’application en composants et de rendre l’interface dynamique.",
    },
    {
      title: "Le numérique dans le quotidien",
      content:
        "Une petite application bien pensée peut améliorer l’organisation personnelle de façon concrète.",
    },
  ];

  return (
    <main className="page">
      <section className="hero">
        <h1>Blog</h1>
        <p>Petits articles pour accompagner le projet.</p>
      </section>

      <div className="blog-list">
        {posts.map((post, index) => (
          <article key={index} className="blog-post">
            <h2>{post.title}</h2>
            <p>{post.content}</p>
          </article>
        ))}
      </div>
    </main>
  );
}