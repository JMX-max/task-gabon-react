const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");
const crypto = require("crypto");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

app.set("trust proxy", 1);

const allowedOrigins = [
  "http://localhost:5173",
  "https://splendorous-crepe-5a13a2.netlify.app",
  process.env.CLIENT_URL,
].filter(Boolean);

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      return callback(new Error("Not allowed by CORS"));
    },
  })
);

app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: false }));

app.get("/", (req, res) => {
  res.json({ message: "Backend Task Gabon en ligne" });
});

const codes = new Map(); // email -> { code, expiresAt }
const sessions = new Map(); // token -> { email, expiresAt }
const cooldowns = new Map(); // email -> timestamp dernier envoi

const FROM_NAME = process.env.FROM_NAME || "Task Gabon";
const FROM_EMAIL = process.env.FROM_EMAIL || process.env.SMTP_USER;
const SUPPORT_EMAIL = process.env.SUPPORT_EMAIL || FROM_EMAIL;

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
  tls: {
    rejectUnauthorized: true,
  },
});

transporter.verify((err, success) => {
  if (err) {
    console.error("SMTP non disponible :", err.message);
  } else {
    console.log("SMTP prêt :", success);
  }
});

function generateCode() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

function generateToken() {
  return crypto.randomBytes(32).toString("hex");
}

function normalizeEmail(email) {
  return String(email || "").trim().toLowerCase();
}

function cleanupExpiredData() {
  const now = Date.now();

  for (const [email, value] of codes.entries()) {
    if (!value || now > value.expiresAt) {
      codes.delete(email);
    }
  }

  for (const [token, value] of sessions.entries()) {
    if (!value || now > value.expiresAt) {
      sessions.delete(token);
    }
  }

  for (const [email, lastSent] of cooldowns.entries()) {
    if (now - lastSent > 5 * 60 * 1000) {
      cooldowns.delete(email);
    }
  }
}

setInterval(cleanupExpiredData, 60 * 1000);

app.post("/api/send-code", async (req, res) => {
  try {
    const email = normalizeEmail(req.body.email);

    if (!email) {
      return res.status(400).json({ message: "Email manquant." });
    }

    if (!process.env.SMTP_USER || !process.env.SMTP_PASS || !process.env.SMTP_HOST) {
      return res.status(500).json({ message: "Configuration SMTP manquante." });
    }

    const now = Date.now();
    const lastSent = cooldowns.get(email);

    if (lastSent && now - lastSent < 60 * 1000) {
      return res.status(429).json({
        message: "Attends une minute avant de demander un nouveau code.",
      });
    }

    const code = generateCode();
    const expiresAt = now + 10 * 60 * 1000;

    codes.set(email, { code, expiresAt });
    cooldowns.set(email, now);

    await transporter.sendMail({
      from: `"${FROM_NAME}" <${FROM_EMAIL}>`,
      to: email,
      replyTo: SUPPORT_EMAIL,
      subject: "Votre code de vérification Task Gabon",
      text: `Bonjour,

Voici votre code de vérification Task Gabon : ${code}

Ce code expire dans 10 minutes.

Si vous n'êtes pas à l'origine de cette demande, vous pouvez ignorer cet email.`,
      html: `
        <div style="margin:0;padding:0;background:#f6f7fb;font-family:Arial,Helvetica,sans-serif;">
          <div style="max-width:560px;margin:0 auto;padding:32px 16px;">
            <div style="background:#ffffff;border-radius:14px;padding:28px 24px;border:1px solid #e8eaf0;">
              <h2 style="margin:0 0 16px;font-size:22px;color:#111827;">Code de vérification</h2>
              <p style="margin:0 0 18px;font-size:15px;line-height:1.6;color:#374151;">
                Bonjour,<br><br>
                Voici votre code de vérification pour accéder à votre compte Task Gabon.
              </p>
              <div style="text-align:center;margin:28px 0;">
                <div style="display:inline-block;padding:16px 26px;border-radius:12px;background:#f3f4f6;font-size:30px;font-weight:700;letter-spacing:8px;color:#111827;">
                  ${code}
                </div>
              </div>
              <p style="margin:0 0 10px;font-size:14px;line-height:1.6;color:#6b7280;">
                Ce code expire dans <strong>10 minutes</strong>.
              </p>
              <p style="margin:0;font-size:13px;line-height:1.6;color:#9ca3af;">
                Si vous n’êtes pas à l’origine de cette demande, vous pouvez ignorer cet email.
              </p>
            </div>
          </div>
        </div>
      `,
      headers: {
        "X-Priority": "1",
        "X-MSMail-Priority": "High",
        Importance: "High",
        "X-Mailer": "Task Gabon Mailer",
      },
    });

    return res.json({ message: "Code envoyé avec succès." });
  } catch (error) {
    console.error("Erreur send-code:", error);
    return res.status(500).json({ message: "Erreur lors de l'envoi du code." });
  }
});

app.post("/api/verify-code", (req, res) => {
  const email = normalizeEmail(req.body.email);
  const code = String(req.body.code || "").trim();

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
    expiresAt: Date.now() + 24 * 60 * 60 * 1000,
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