# PortionCheck Pro — Guide de déploiement

## Déploiement sur Render.com (gratuit, 5 minutes)

### Étape 1 — GitHub (1 minute)
1. Créez un compte sur https://github.com si vous n'en avez pas
2. Cliquez sur "+" → "New repository"
3. Nommez-le `portioncheck` → "Create repository"
4. Uploadez les fichiers du dossier (server.js, package.json, et le dossier public/)

### Étape 2 — Render (3 minutes)
1. Créez un compte sur https://render.com
2. Cliquez "New +" → "Web Service"
3. Connectez votre repo GitHub `portioncheck`
4. Configurez :
   - **Name** : portioncheck-pro
   - **Runtime** : Node
   - **Build Command** : `npm install`
   - **Start Command** : `npm start`
   - **Plan** : Free
5. Cliquez "Create Web Service"

### Étape 3 — Accès (1 minute)
- Render vous donne une URL : `https://portioncheck-pro.onrender.com`
- Ouvrez cette URL dans Safari sur iPhone → tout fonctionne !

## Structure des fichiers
```
portioncheck/
├── server.js        ← Serveur Node.js (proxy API)
├── package.json     ← Dépendances
└── public/
    └── index.html   ← Application frontend
```

## Notes importantes
- La clé API Anthropic est saisie dans l'app, elle n'est jamais stockée sur le serveur
- Le plan gratuit de Render met le service en veille après 15min d'inactivité (réveil ~30s)
- Pour un usage professionnel continu, passez au plan Starter ($7/mois)
