const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");
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

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },
  })
);

app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "Backend Task Gabon en ligne" });
});

const codes = new Map();

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT || 587),
  secure: String(process.env.SMTP_SECURE).toLowerCase() === "true",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

function generateCode() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

app.post("/api/send-code", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email manquant." });
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

    res.json({ message: "Code envoyé avec succès." });
  } catch (error) {
    console.error("Erreur send-code:", error);
    res.status(500).json({ message: "Erreur lors de l'envoi du code." });
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
  return res.json({ message: "Code validé avec succès." });
});

app.listen(PORT, () => {
  console.log(`Backend lancé sur http://localhost:${PORT}`);
});