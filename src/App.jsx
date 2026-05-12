import { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Blog from "./pages/Blog";
import Dashboard from "./pages/Dashboard";

function Loader() {
  return (
    <div className="loader-overlay">
      <div className="loader-card">
        <div className="spinner" />
        <h2>Chargement de l'application...</h2>
        <p>Préparation de Task Gabon</p>
      </div>
    </div>
  );
}

export default function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <style>{styles}</style>
      {loading ? (
        <Loader />
      ) : (
        <>
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/accueil" element={<Home />} />
            <Route path="/a-propos" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </>
      )}
    </>
  );
}

const styles = `
  .loader-overlay {
    position: fixed;
    inset: 0;
    background: linear-gradient(135deg, #0f172a, #312e81);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 9999;
    color: white;
    padding: 20px;
  }

  .loader-card {
    background: rgba(255, 255, 255, 0.08);
    border: 1px solid rgba(255, 255, 255, 0.18);
    backdrop-filter: blur(12px);
    border-radius: 24px;
    padding: 32px 28px;
    text-align: center;
    box-shadow: 0 18px 40px rgba(0, 0, 0, 0.25);
    min-width: min(92vw, 360px);
  }

  .spinner {
    width: 54px;
    height: 54px;
    margin: 0 auto 18px;
    border: 5px solid rgba(255, 255, 255, 0.25);
    border-top-color: #fff;
    border-radius: 50%;
    animation: spin 0.9s linear infinite;
  }

  .loader-card h2 {
    margin: 0 0 8px;
    font-size: 1.35rem;
  }

  .loader-card p {
    margin: 0;
    opacity: 0.85;
    font-size: 0.95rem;
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;
