import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();
  const currentUser = JSON.parse(localStorage.getItem("task-gabon-current-user") || "null");

  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem("task-gabon-tasks");
    return saved
      ? JSON.parse(saved)
      : [
          {
            id: 1,
            title: "Réviser React",
            description: "Relire les composants et les hooks.",
            priority: "Haute",
            category: "Études",
            completed: false,
          },
          {
            id: 2,
            title: "Préparer le projet",
            description: "Mettre l'application au propre avant le rendu.",
            priority: "Moyenne",
            category: "Projet",
            completed: true,
          },
        ];
  });

  const [form, setForm] = useState({
    title: "",
    description: "",
    priority: "Moyenne",
    category: "Études",
  });

  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    localStorage.setItem("task-gabon-tasks", JSON.stringify(tasks));
  }, [tasks]);

  const stats = useMemo(() => {
    const total = tasks.length;
    const done = tasks.filter((t) => t.completed).length;
    return { total, done, pending: total - done };
  }, [tasks]);

  const visibleTasks = useMemo(() => {
    return tasks.filter((task) => {
      const text = `${task.title} ${task.description} ${task.category}`.toLowerCase();
      const matchesSearch = text.includes(search.toLowerCase());
      const matchesFilter =
        filter === "all" ||
        (filter === "done" && task.completed) ||
        (filter === "pending" && !task.completed);

      return matchesSearch && matchesFilter;
    });
  }, [tasks, search, filter]);

  const submitTask = (e) => {
    e.preventDefault();

    if (!form.title.trim()) return;

    if (editingId !== null) {
      setTasks((prev) =>
        prev.map((task) => (task.id === editingId ? { ...task, ...form } : task))
      );
    } else {
      setTasks((prev) => [
        {
          id: Date.now(),
          ...form,
          completed: false,
        },
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

  const editTask = (task) => {
    setEditingId(task.id);
    setForm({
      title: task.title,
      description: task.description,
      priority: task.priority,
      category: task.category,
    });
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
  };

  const logout = () => {
    localStorage.removeItem("task-gabon-current-user");
    navigate("/login");
  };

  return (
    <main className="page">
<header className="hero">
  <div className="hero-top">
    <div>
      <h1>Accueil</h1>

      <p>
        Bonjour {currentUser?.prenom} {currentUser?.nom}, ton espace personnel est prêt.
      </p>
    </div>

    <button className="logout-btn" onClick={logout}>
      Déconnexion
    </button>
  </div>
</header>

      <section className="home-grid">
        <div className="blog-card">
          <h2>Ajouter une tâche</h2>

          <form className="form" onSubmit={submitTask}>
            <input
              type="text"
              placeholder="Titre"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />
            <textarea
              placeholder="Description"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
            <select
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
            >
              <option>Études</option>
              <option>Maison</option>
              <option>Projet</option>
              <option>Travail</option>
            </select>
            <select
              value={form.priority}
              onChange={(e) => setForm({ ...form, priority: e.target.value })}
            >
              <option>Haute</option>
              <option>Moyenne</option>
              <option>Basse</option>
            </select>

            <button type="submit">
              {editingId ? "Mettre à jour" : "Ajouter"}
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
              placeholder="Rechercher..."
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
            {visibleTasks.map((task) => (
              <article key={task.id} className={`task-item ${task.completed ? "done" : ""}`}>
                <div>
                  <h3>{task.title}</h3>
                  <p>{task.description}</p>
                  <small>
                    Priorité : {task.priority} | Catégorie : {task.category}
                  </small>
                </div>

                <div className="task-actions">
                  <button type="button" onClick={() => toggleDone(task.id)}>
                    {task.completed ? "Annuler" : "Terminer"}
                  </button>
                  <button type="button" onClick={() => editTask(task)}>
                    Éditer
                  </button>
                  <button type="button" onClick={() => deleteTask(task.id)}>
                    Supprimer
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}