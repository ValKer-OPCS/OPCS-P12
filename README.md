# OPCS‑P12 — Frontend Next.js (TypeScript)

Un projet frontend moderne développé avec **Next.js (App Router)**, **TypeScript**, **SCSS modules**, et une architecture modulaire orientée composants et features. Ce projet s’inscrit dans le cadre du parcours *OpenClassrooms – Intégrateur Web / Développeur Frontend*.

---

![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)
![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Sass](https://img.shields.io/badge/Sass-CC6699?style=for-the-badge&logo=sass&logoColor=white)
![Jest](https://img.shields.io/badge/Jest-C21325?style=for-the-badge&logo=jest&logoColor=white)
![Testing Library](https://img.shields.io/badge/Testing%20Library-E33332?style=for-the-badge&logo=testinglibrary&logoColor=white)
![ESLint](https://img.shields.io/badge/ESLint-4B32C3?style=for-the-badge&logo=eslint&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![Redis](https://img.shields.io/badge/Redis-DC382D?style=for-the-badge&logo=redis&logoColor=white)

---
## 🌐 Démonstration

<p align="center">
  <a href="https://valker.dev" target="_blank">
    <img src="https://img.shields.io/badge/Démo-En%20ligne-success?style=for-the-badge&logo=vercel" alt="Démo en ligne">
  </a>
</p>

<p align="center">
  <strong>👉 Testez l'application directement depuis votre navigateur.</strong>
</p>


---

## 🛠️  Stack technique

- **Next.js 14+** (App Router)
- **React 18**
- **TypeScript**
- **SCSS / Sass**
- **Jest + Testing Library**
- **ESLint + Prettier**
- **MongoDB** (via MONGODB_URI)
- **Supabase** (API + Auth)
- **Upstash Redis** (cache / rate limit)
- Architecture modulaire : `components/`, `containers/`, `lib/`, `types/`, `app/`

---
## ✨ Fonctionnalités

- 🔐 Authentification JWT
- 📧 Envoi d'e-mails via SMTP
- 🗄️ Stockage des données avec MongoDB
- ⚡ Cache avec Upstash Redis
- ☁️ Intégration Supabase
---

## ⚙️ Configuration

Avant de lancer l'application, créez un fichier `.env` à la racine du projet et renseignez les variables d'environnement suivantes :

```env
# URI de connexion à votre base de données MongoDB
MONGODB_URI=
# Nom d'utilisateur du compte administrateur initial
ADMIN_USERNAME=
# Mot de passe du compte administrateur initial
ADMIN_PASSWORD=
# Adresse du serveur SMTP (ex. smtp.gmail.com)
SMTP_HOST=
# Port du serveur SMTP (ex. 587 ou 465)
SMTP_PORT=
# Nom d'utilisateur du compte SMTP
SMTP_USER=
# Mot de passe ou clé d'application du compte SMTP
SMTP_PASS=
# Adresse e-mail qui recevra les messages de contact
CONTACT_TO=
# URL REST de votre base Upstash Redis
UPSTASH_REDIS_REST_URL=
# Jeton d'authentification Upstash Redis
UPSTASH_REDIS_REST_TOKEN=
# URL publique de l'application (ex. http://localhost:3000)
NEXT_PUBLIC_BASE_URL=
# URL de votre projet Supabase
NEXT_PUBLIC_SUPABASE_URL=
# Clé Service Role Supabase (à conserver strictement confidentielle)
SUPABASE_SERVICE_ROLE_KEY=
# Clé secrète utilisée pour signer les Refresh Tokens JWT
REFRESH_TOKEN_SECRET=
# Clé secrète utilisée pour signer les Access Tokens JWT
ACCESS_TOKEN_SECRET=
```

> **Important**
>
> * Ne versionnez jamais votre fichier `.env`.
> * Générez des clés secrètes (`*_SECRET`) longues et aléatoires.
> * La clé `SUPABASE_SERVICE_ROLE_KEY` possède des privilèges élevés et ne doit jamais être exposée côté client.
>
---
## 🚀 Installation & lancement

### 1. Cloner le dépôt

```bash
git clone <URL_DU_DEPOT>
cd <NOM_DU_PROJET>
```

### 2. Installer les dépendances

Avec **npm** :

```bash
npm install
```

Ou avec **pnpm** :

```bash
pnpm install
```

Ou avec **yarn** :

```bash
yarn install
```

### 3. Configurer les variables d'environnement

Créez un fichier `.env` à la racine du projet en vous basant sur l'exemple présenté dans la section précédente.

### 4. Lancer le serveur de développement

Avec **npm** :

```bash
npm run dev
```

Ou avec **pnpm** :

```bash
pnpm dev
```

Ou avec **yarn** :

```bash
yarn dev
```

Une fois l'application démarrée, elle est accessible à l'adresse :

```text
http://localhost:3000
```

### 5. Générer une version de production

```bash
npm run build
```

Puis démarrer l'application :

```bash
npm run start
```

---



