const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(express.static(path.join(__dirname, "public")));

// Proxy vers l'API Anthropic
app.post("/api/analyze", async (req, res) => {
  const { apiKey, imageB64, productName, productTarget, productTol } = req.body;

  if (!apiKey || !imageB64) {
    return res.status(400).json({ error: "Paramètres manquants" });
  }

  const prompt = `Tu es un système expert de contrôle de grammage pour un kebab/snack.

Analyse cette image et estime le POIDS EN GRAMMES de la viande visible (poulet rôti, agneau, bœuf, shawarma, falafel ou toute protéine).

Règles :
- Estime selon la surface couverte, l'épaisseur et la densité apparente
- Référence : kebab normal ≈ 150g
- Pas de viande ou image vide/floue → weight: 0
- confidence: "high" si viande clairement visible, "medium" si partielle, "low" si incertitude

Produit : "${productName}" (cible ${productTarget}g ±${productTol}g)

Réponds UNIQUEMENT avec du JSON valide sur une ligne, sans markdown :
{"weight": NUMBER, "confidence": "high"|"medium"|"low", "note": "description courte en français"}`;

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-opus-4-6",
        max_tokens: 120,
        messages: [{
          role: "user",
          content: [
            { type: "image", source: { type: "base64", media_type: "image/jpeg", data: imageB64 } },
            { type: "text", text: prompt }
          ]
        }]
      })
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      return res.status(response.status).json({ error: err?.error?.message || `HTTP ${response.status}` });
    }

    const data = await response.json();
    const raw = data.content?.[0]?.text || "";
    const parsed = JSON.parse(raw.replace(/```json|```/g, "").trim());
    res.json(parsed);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Test clé API
app.post("/api/test-key", async (req, res) => {
  const { apiKey } = req.body;
  try {
    const r = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-api-key": apiKey, "anthropic-version": "2023-06-01" },
      body: JSON.stringify({ model: "claude-opus-4-6", max_tokens: 5, messages: [{ role: "user", content: "ok" }] })
    });
    if (r.status === 401) return res.json({ valid: false, error: "Clé invalide" });
    res.json({ valid: true });
  } catch (e) {
    res.json({ valid: false, error: e.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`PortionCheck server running on port ${PORT}`));
