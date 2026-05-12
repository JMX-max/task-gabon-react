const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || "secret123";

app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());

const products = [
  {
    id: 1,
    name: "T-shirt React",
    description: "Un t-shirt stylé pour les fans de React.",
    price: 10000,
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800",
  },
  {
    id: 2,
    name: "Casquette Dev",
    description: "Casquette moderne pour développeur.",
    price: 8000,
    image: "https://images.unsplash.com/photo-1523398002811-999ca8dec234?w=800",
  },
  {
    id: 3,
    name: "Sac Laptop",
    description: "Sac pratique pour transporter ton ordinateur.",
    price: 15000,
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800",
  },
];

const blogPosts = [
  {
    id: 1,
    title: "Comprendre React",
    content: "React permet de créer des interfaces dynamiques avec des composants.",
  },
  {
    id: 2,
    title: "Pourquoi utiliser les routes ?",
    content: "Les routes servent à organiser les pages dans une application web.",
  },
  {
    id: 3,
    title: "Le rôle du backend",
    content: "Le backend gère les données, l'authentification et les requêtes API.",
  },
];

function authMiddleware(req, res, next) {
  const header = req.headers.authorization;
  if (!header) return res.status(401).json({ message: "Token manquant" });

  const token = header.split(" ")[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    return res.status(401).json({ message: "Token invalide" });
  }
}

app.get("/api/products", (req, res) => {
  res.json(products);
});

app.get("/api/blog", (req, res) => {
  res.json(blogPosts);
});

app.post("/api/contact", (req, res) => {
  console.log("Nouveau message contact :", req.body);
  res.json({ message: "Message reçu avec succès" });
});

app.post("/api/login", (req, res) => {
  const { email, password } = req.body;

  if (email === "admin@mail.com" && password === "123456") {
    const user = { id: 1, name: "Admin", email };
    const token = jwt.sign(user, JWT_SECRET, { expiresIn: "1d" });

    return res.json({ token, user });
  }

  return res.status(401).json({ message: "Email ou mot de passe incorrect" });
});

app.get("/api/me", authMiddleware, (req, res) => {
  res.json({ user: req.user });
});

app.listen(PORT, () => {
  console.log(`Backend lancé sur http://localhost:${PORT}`);
});