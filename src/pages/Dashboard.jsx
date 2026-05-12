import { useAuth } from "../context/AuthContext";

export default function Dashboard() {
  const { user } = useAuth();

  return (
    <main className="page">
      <h1>Dashboard</h1>
      <p>Bienvenue {user?.name}, cette page est protégée.</p>
    </main>
  );
}