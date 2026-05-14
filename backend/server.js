const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");
const crypto = require("crypto");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

const allowedOrigins = [
  "http://localhost:5173",
  "https://splendorous-crepe-5a13a2.netlify.app",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      return callback(new Error("Not allowed by CORS"));
    },
  })
);

app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "Backend Task Gabon en ligne" });
});

const codes = new Map();   // email -> { code, expiresAt }
const sessions = new Map(); // token -> { email, expiresAt }

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT || 587),
  secure: String(process.env.SMTP_SECURE).toLowerCase() === "true",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  connectionTimeout: 10000,
  greetingTimeout: 10000,
  socketTimeout: 10000,
});

transporter.verify((err, success) => {
  if (err) console.error("SMTP non disponible :", err.message);
  else console.log("SMTP prêt :", success);
});

function generateCode() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

function generateToken() {
  return crypto.randomBytes(32).toString("hex");
}

app.post("/api/send-code", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email manquant." });
    }

    if (!process.env.SMTP_USER || !process.env.SMTP_PASS || !process.env.SMTP_HOST) {
      return res.status(500).json({ message: "Configuration SMTP manquante." });
    }

    const code = generateCode();
    const expiresAt = Date.now() + 10 * 60 * 1000;

    codes.set(email, { code, expiresAt });

    await transporter.sendMail({
      from: process.env.FROM_EMAIL || process.env.SMTP_USER,
      to: email,
      subject: "Code de confirmation Task Gabon",
      text: `Ton code de confirmation est : ${code}`,
      html: `
        <div style="font-family: Arial, sans-serif;">
          <h2>Code de confirmation</h2>
          <p>Ton code est :</p>
          <div style="font-size: 28px; font-weight: bold; letter-spacing: 6px;">${code}</div>
          <p>Il expire dans 10 minutes.</p>
        </div>
      `,
    });

    return res.json({ message: "Code envoyé avec succès." });
  } catch (error) {
    console.error("Erreur send-code:", error);
    return res.status(500).json({ message: "Erreur lors de l'envoi du code." });
  }
});

app.post("/api/verify-code", (req, res) => {
  const { email, code } = req.body;

  if (!email || !code) {
    return res.status(400).json({ message: "Email ou code manquant." });
  }

  const stored = codes.get(email);

  if (!stored) {
    return res.status(400).json({ message: "Aucun code trouvé pour cet email." });
  }

  if (Date.now() > stored.expiresAt) {
    codes.delete(email);
    return res.status(400).json({ message: "Code expiré." });
  }

  if (stored.code !== code) {
    return res.status(400).json({ message: "Code incorrect." });
  }

  codes.delete(email);

  const token = generateToken();
  sessions.set(token, {
    email,
    expiresAt: Date.now() + 24 * 60 * 60 * 1000, // 24h
  });

  return res.json({
    message: "Code validé avec succès.",
    token,
  });
});

app.get("/api/session-check", (req, res) => {
  const token = req.headers.authorization?.replace("Bearer ", "");
  if (!token) {
    return res.status(401).json({ message: "Non autorisé." });
  }

  const session = sessions.get(token);
  if (!session) {
    return res.status(401).json({ message: "Session invalide." });
  }

  if (Date.now() > session.expiresAt) {
    sessions.delete(token);
    return res.status(401).json({ message: "Session expirée." });
  }

  return res.json({ message: "Session valide.", email: session.email });
});

app.listen(PORT, () => {
  console.log(`Backend lancé sur http://localhost:${PORT}`);
});