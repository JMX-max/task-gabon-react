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
      if (allowedOrigins.includes(origin)) return callback(null, true);
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
  service: "gmail",
  auth: {
    user: process.env.SMTP_USER,
    pass: (process.env.SMTP_PASS || "").replace(/\s+/g, ""),
  },
  logger: true,
  debug: true,
});

transporter.verify((err, success) => {
  if (err) {
    console.error("SMTP ERROR:", err);
  } else {
    console.log("SMTP prêt:", success);
  }
});

function generateCode() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

app.get("/test-mail", async (req, res) => {
  try {
    await transporter.sendMail({
      from: process.env.FROM_EMAIL || process.env.SMTP_USER,
      to: process.env.SMTP_USER,
      subject: "Test mail Task Gabon",
      text: "Le backend peut envoyer des mails.",
    });

    return res.json({ success: true, message: "Mail test envoyé" });
  } catch (error) {
    console.error("TEST MAIL ERROR:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
});

app.post("/api/send-code", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ success: false, message: "Email requis" });
    }

    const code = generateCode();
    const expiresAt = Date.now() + 10 * 60 * 1000;

    codes.set(email, { code, expiresAt });

    await transporter.sendMail({
      from: process.env.FROM_EMAIL || process.env.SMTP_USER,
      to: email,
      subject: "Code de confirmation Task Gabon",
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2>Bienvenue sur Task Gabon</h2>
          <p>Voici votre code de confirmation :</p>
          <div style="font-size: 32px; font-weight: bold; background: #f2f2f2; padding: 15px; width: fit-content; letter-spacing: 5px; border-radius: 10px;">
            ${code}
          </div>
          <p style="margin-top: 20px;">Ce code expire dans 10 minutes.</p>
        </div>
      `,
    });

    console.log(`Code envoyé à ${email} : ${code}`);

    return res.json({
      success: true,
      message: "Code envoyé avec succès",
    });
  } catch (error) {
    console.error("Erreur SEND CODE :", error);
    return res.status(500).json({
      success: false,
      message: "Erreur lors de l'envoi du code.",
    });
  }
});

app.post("/api/verify-code", (req, res) => {
  try {
    const { email, code } = req.body;

    if (!email || !code) {
      return res.status(400).json({
        success: false,
        message: "Informations manquantes",
      });
    }

    const storedData = codes.get(email);

    if (!storedData) {
      return res.status(400).json({
        success: false,
        message: "Aucun code trouvé",
      });
    }

    if (Date.now() > storedData.expiresAt) {
      codes.delete(email);
      return res.status(400).json({
        success: false,
        message: "Code expiré",
      });
    }

    if (storedData.code !== code) {
      return res.status(400).json({
        success: false,
        message: "Code incorrect",
      });
    }

    codes.delete(email);

    return res.json({
      success: true,
      message: "Code validé",
    });
  } catch (error) {
    console.error("Erreur VERIFY CODE :", error);
    return res.status(500).json({
      success: false,
      message: "Erreur serveur",
    });
  }
});

app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});