const express = require("express");
const cors = require("cors");
const { Resend } = require("resend");
require("dotenv").config();

const app = express();

const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const resend = new Resend(process.env.RESEND_API_KEY);

const verificationCodes = new Map();

function generateCode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Backend Task Gabon opérationnel",
  });
});

app.post("/api/send-code", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email requis",
      });
    }

    const code = generateCode();

    verificationCodes.set(email, {
      code,
      expiresAt: Date.now() + 10 * 60 * 1000,
    });

    await resend.emails.send({
      from: "onboarding@resend.dev",
      to: email,
      subject: "Code de confirmation Task Gabon",
      html: `
        <div style="font-family: Arial; padding: 20px;">
          <h2>Bienvenue sur Task Gabon</h2>

          <p>Votre code de confirmation est :</p>

          <div
            style="
              font-size: 32px;
              font-weight: bold;
              background: #f2f2f2;
              padding: 15px;
              width: fit-content;
              border-radius: 10px;
              letter-spacing: 5px;
            "
          >
            ${code}
          </div>

          <p>Ce code expire dans 10 minutes.</p>
        </div>
      `,
    });

    console.log("Code envoyé :", code);

    return res.json({
      success: true,
      message: "Code envoyé avec succès",
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Erreur lors de l'envoi du code.",
    });
  }
});

app.post("/api/verify-code", (req, res) => {
  try {
    const { email, code } = req.body;

    const stored = verificationCodes.get(email);

    if (!stored) {
      return res.status(400).json({
        success: false,
        message: "Aucun code trouvé",
      });
    }

    if (Date.now() > stored.expiresAt) {
      verificationCodes.delete(email);

      return res.status(400).json({
        success: false,
        message: "Code expiré",
      });
    }

    if (stored.code !== code) {
      return res.status(400).json({
        success: false,
        message: "Code incorrect",
      });
    }

    verificationCodes.delete(email);

    return res.json({
      success: true,
      message: "Code validé",
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Erreur serveur",
    });
  }
});

app.listen(PORT, () => {
  console.log(`Serveur lancé sur le port ${PORT}`);
});