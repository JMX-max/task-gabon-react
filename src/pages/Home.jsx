import { useEffect, useMemo, useState } from "react";
import "./home.css";

const initialTasks = [
  {
    id: 1,
    title: "Réviser le cours de React",
    description: "Relire les composants, les props et les hooks avant le rendu.",
    priority: "Haute",
    completed: false,
    category: "Études",
  },
  {
    id: 2,
    title: "Préparer le devoir pour l'école",
    description: "Mettre le projet au propre avec un design simple et clair.",
    priority: "Moyenne",
    completed: true,
    category: "Projet",
  },
  {
    id: 3,
    title: "Organiser les courses à Libreville",
    description: "Gérer les tâches de la maison et les petites dépenses du jour.",
    priority: "Basse",
    completed: false,
    category: "Maison",
  },
];

export default function Home() {
  const [tasks, setTasks] = useState(initialTasks);
  const [form, setForm] = useState({
    title: "",
    description: "",
    priority: "Moyenne",
    category: "Études",
  });
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  const stats = useMemo(() => {
    const total = tasks.length;
    const done = tasks.filter((t) => t.completed).length;
    const pending = total - done;
    return { total, done, pending };
  }, [tasks]);

  const visibleTasks = useMemo(() => {
    return tasks.filter((task) => {
      const matchesSearch =
        `${task.title} ${task.description} ${task.category}`
          .toLowerCase()
          .includes(search.toLowerCase());

      const matchesFilter =
        filter === "all" ||
        (filter === "done" && task.completed) ||
        (filter === "pending" && !task.completed);

      return matchesSearch && matchesFilter;
    });
  }, [tasks, search, filter]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title.trim()) return;

    if (editingId !== null) {
      setTasks((prev) =>
        prev.map((task) => (task.id === editingId ? { ...task, ...form } : task))
      );
    } else {
      setTasks((prev) => [
        { id: Date.now(), ...form, completed: false },
        ...prev,
      ]);
    }

    setForm({
      title: "",
      description: "",
      priority: "Moyenne",
      category: "Études",
    });
    setEditingId(null);
  };

  const toggleDone = (id) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const deleteTask = (id) => {
    setTasks((prev) => prev.filter((task) => task.id !== id));
    if (editingId === id) {
      setEditingId(null);
      setForm({
        title: "",
        description: "",
        priority: "Moyenne",
        category: "Études",
      });
    }
  };

  const editTask = (task) => {
    setForm({
      title: task.title,
      description: task.description,
      priority: task.priority,
      category: task.category,
    });
    setEditingId(task.id);
  };

  useEffect(() => {
    localStorage.setItem("task-gabon", JSON.stringify(tasks));
  }, [tasks]);

  return (
    <main className="page">
      <section className="hero">
        <h1>Accueil</h1>
        <p>
          Une application de gestion de tâches inspirée de la vie quotidienne au Gabon :
          école, maison, petits projets, organisation personnelle et travail en groupe.
        </p>
      </section>

      <section className="home-grid">
        <div className="blog-card">
          <h2>Ajouter une tâche</h2>
          <form onSubmit={handleSubmit} className="form">
            <input
              type="text"
              placeholder="Titre de la tâche"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />
            <textarea
              placeholder="Description"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
            <select
              value={form.priority}
              onChange={(e) => setForm({ ...form, priority: e.target.value })}
            >
              <option>Haute</option>
              <option>Moyenne</option>
              <option>Basse</option>
            </select>
            <select
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
            >
              <option>Études</option>
              <option>Maison</option>
              <option>Projet</option>
              <option>Travail</option>
            </select>

            <button type="submit">
              {editingId ? "Modifier la tâche" : "Ajouter la tâche"}
            </button>
          </form>

          <div className="stats">
            <div className="stat-box">
              <strong>{stats.total}</strong>
              <span>Total</span>
            </div>
            <div className="stat-box">
              <strong>{stats.done}</strong>
              <span>Terminées</span>
            </div>
            <div className="stat-box">
              <strong>{stats.pending}</strong>
              <span>En attente</span>
            </div>
          </div>
        </div>

        <div className="blog-card">
          <h2>Mes tâches</h2>

          <div className="search-row">
            <input
              type="text"
              placeholder="Rechercher une tâche..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <select value={filter} onChange={(e) => setFilter(e.target.value)}>
              <option value="all">Toutes</option>
              <option value="done">Terminées</option>
              <option value="pending">En attente</option>
            </select>
          </div>

          <div className="task-list">
            {visibleTasks.length === 0 ? (
              <p>Aucune tâche trouvée.</p>
            ) : (
              visibleTasks.map((task) => (
                <article key={task.id} className={`task-item ${task.completed ? "done" : ""}`}>
                  <div>
                    <h3>{task.title}</h3>
                    <p>{task.description}</p>
                    <small>
                      Priorité : {task.priority} | Catégorie : {task.category}
                    </small>
                  </div>

                  <div className="task-actions">
                    <button onClick={() => toggleDone(task.id)}>
                      {task.completed ? "Annuler" : "Terminer"}
                    </button>
                    <button onClick={() => editTask(task)}>Éditer</button>
                    <button onClick={() => deleteTask(task.id)}>Supprimer</button>
                  </div>
                </article>
              ))
            )}
          </div>
        </div>
      </section>

      <section className="blog-card" style={{ marginTop: "20px" }}>
        <h2>Pourquoi cette page correspond bien au contexte gabonais ?</h2>
        <p>
          Dans un pays très urbanisé comme le Gabon, où la vie scolaire, les petits projets,
          les déplacements et l’organisation du quotidien sont importants, une application
          de tâches simple comme celle-ci aide à mieux planifier sa journée.
        </p>
      </section>
    </main>
  );
}