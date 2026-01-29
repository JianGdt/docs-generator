# AI Docs Generator  
**Free AI‑powered documentation generator** – paste code, upload files or point to a GitHub repo and let the app create professional markdown docs for you.

---  

<div align="center">

[![Next.js 16](https://img.shields.io/badge/Next.js-16.1.1-000000?logo=nextdotjs&logoColor=white)](https://nextjs.org/)  
[![React 19](https://img.shields.io/badge/React-19.2.3-61DAFB?logo=react)](https://react.dev/)  
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5-3178C6?logo=typescript)](https://www.typescriptlang.org/)  
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-38B2AC?logo=tailwindcss)](https://tailwindcss.com/)  
[![MongoDB](https://img.shields.io/badge/MongoDB-6.9-47A248?logo=mongodb)](https://www.mongodb.com/)  
[![NextAuth.js](https://img.shields.io/badge/NextAuth.js-5.0.0%20beta-000000?logo=auth0)](https://next-auth.js.org/)  
[![Vercel](https://img.shields.io/badge/Deploy-Vercel-000000?logo=vercel)](https://vercel.com/)  

</div>

---

## 📖 Table of Contents  

| Section | Description |
|---|---|
| [Overview](#overview) | What the project does and why it matters |
| [Tech Stack](#tech-stack) | Core libraries & tools |
| [Features](#features) | Main capabilities |
| [Getting Started](#getting-started) | Local development setup |
| [Environment Variables](#environment-variables) | Required `.env` keys |
| [Running the App](#running-the-app) | Scripts & dev workflow |
| [Usage Walk‑through](#usage-walk-through) | Example UI flow |
| [API Endpoints](#api-endpoints) | Server‑side routes (auth, docs) |
| [Folder Structure](#folder-structure) | High‑level layout |
| [Testing & Linting](#testing--linting) | Code quality tools |
| [Deployment](#deployment) | Deploy to Vercel / Docker |
| [Troubleshooting](#troubleshooting) | Common pitfalls |
| [Contributing](#contributing) | How to help |
| [License](#license) | Open‑source license |

---

## 🌟 Overview  

**AI Docs Generator** is a Next.js application that turns source code (or a GitHub repository) into clean, AI‑enhanced documentation.  

* **Zero‑setup UI** – paste a code snippet, drag‑and‑drop a file, or provide a GitHub URL.  
* **Powered by Groq & OpenAI** – the backend calls the Groq SDK (or any OpenAI‑compatible endpoint) to generate markdown.  
* **Secure & multi‑tenant** – users sign‑in with email/password (bcrypt) or OAuth providers via **NextAuth.js**; each user’s docs are stored in a private MongoDB collection.  
* **Fully responsive** – built with **Tailwind CSS**, **Radix UI** primitives, and **next‑themes** for dark/light mode.  

The project is ready for self‑hosting or Vercel deployment and can be extended with custom prompts, additional LLM providers, or CI‑integrated doc generation.

---

## 🛠️ Tech Stack  

| Category | Packages |
|---|---|
| **Framework** | `next@16.1.1`, `react@19.2.3`, `typescript` |
| **Styling** | `tailwindcss`, `radix-ui` components, `lucide-react` icons, `next-themes`, `sonner` (toast), `class-variance-authority` |
| **State / Forms** | `zustand`, `react-hook-form`, `zod`, `@hookform/resolvers` |
| **Authentication** | `next-auth@5.0.0‑beta.30`, `@auth/core`, `@auth/mongodb-adapter`, `bcryptjs`, `jose` |
| **Database** | `mongodb@6.9.0`, `@auth/mongodb-adapter` |
| **LLM / API** | `groq-sdk`, `axios`, `@octokit/rest` (GitHub API) |
| **Utilities** | `date-fns`, `framer-motion`, `use-debounce`, `tailwind-merge` |
| **Dev Tools** | `eslint`, `prettier`, `turbo` (via Next.js turbopack) |

---

## ✨ Features  

| Feature | Description | Key Files |
|---|---|---|
| **AI‑generated docs** | Sends code to Groq (or OpenAI) and receives markdown. | `app/docs-generator/page.tsx`, `lib/groq.ts` |
| **GitHub integration** | Pulls a repo’s file tree via Octokit and feeds it to the generator. | `lib/github.ts` |
| **User accounts** | Email/password + OAuth (Google, GitHub) with secure session cookies. | `app/api/auth/[...nextauth]/route.ts`, `lib/auth.ts` |
| **Rate limiting** | Prevents abuse with Upstash Redis + ratelimit. | `lib/ratelimit.ts` |
| **Theme switcher** | System‑aware dark/light mode. | `app/providers/ThemeProvider.tsx` |
| **Toast notifications** | Success / error feedback via Sonner. | `app/components/ui/sonner.tsx` |
| **Responsive UI** | Radix UI primitives + Tailwind for accessibility. | `app/components/**` |
| **Server‑side protection** | API routes validate session and enforce per‑user quotas. | `app/api/**` |
| **File upload** | Drag‑and‑drop support for local files (max 5 MB). | `app/components/UploadDropzone.tsx` |
| **Breadcrumb navigation** | Shows current step (Home → New Doc → Result). | `app/components/layout/Breadcrumb.tsx` |

---

## 🚀 Getting Started  

### Prerequisites  

| Tool | Minimum version |
|---|---|
| **Node.js** | 20.x (LTS) |
| **pnpm / npm / yarn** | any package manager you prefer |
| **MongoDB** | Atlas free tier or local instance |
| **Upstash Redis** (optional, for rate‑limit) | – |

### 1. Clone the repo  

```bash
git clone https://github.com/JianGdt/docs-generator.git
cd docs-generator
```

### 2. Install dependencies  

```bash
# using pnpm (recommended)
pnpm install

# or npm
npm ci
```

### 3. Set up environment variables  

Create a `.env.local` file at the project root (see the **Environment Variables** section below).

### 4. Run the development server  

```bash
pnpm dev   # or npm run dev
```

Open <http://localhost:3000> – you should see the landing page with a “Generate Docs” button.

---

## 🔐 Environment Variables  

| Variable | Description | Example |
|---|---|---|
| `NEXTAUTH_URL` | Base URL for NextAuth callbacks (e.g., `http://localhost:3000`). | `http://localhost:3000` |
| `NEXTAUTH_SECRET` | Random string used to encrypt session tokens. | `a1b2c3d4e5f6...` |
| `MONGODB_URI` | MongoDB connection string (Atlas or local). | `mongodb+srv://user:pwd@cluster0.mongodb.net/ai-docs?retryWrites=true&w=majority` |
| `GROQ_API_KEY` | API key for the Groq LLM service (or OpenAI key). | `gsk_XXXXXXXXXXXXXXXX` |
| `GITHUB_APP_ID` / `GITHUB_PRIVATE_KEY` | (Optional) GitHub App credentials for repo access. | `12345` / `-----BEGIN PRIVATE KEY-----...` |
| `UPSTASH_REDIS_REST_URL` | Upstash Redis endpoint for rate limiting. | `https://my-redis.upstash.io` |
| `UPSTASH_REDIS_REST_TOKEN` | Upstash token. | `my-token` |
| `JWT_PRIVATE_KEY` | Private key for signing JWTs (used by `jose`). | `-----BEGIN PRIVATE KEY-----...` |
| `JWT_PUBLIC_KEY` | Public key for verifying JWTs. | `-----BEGIN PUBLIC KEY-----...` |

> **Tip:** You can generate a secret with `openssl rand -base64 32`.

---

## 📦 Running the App  

| Script | Description |
|---|---|
| `pnpm dev` | Starts Next.js in development mode with Turbopack. |
| `pnpm build` | Produces an optimized production build (`.next`). |
| `pnpm start` | Serves the production build (requires `pnpm build` first). |
| `pnpm lint` | Runs ESLint against the codebase. |

---

## 🖥️ Usage Walk‑through  

1. **Sign‑up / Sign‑in** – The landing page shows a login modal (`app/components/auth/LoginForm.tsx`).  
2. **Create a new doc** – Click **“New Documentation”** → you are taken to `/docs-generator`.  
3. **Choose input method**  
   * **Paste code** – a textarea (`app/components/forms/CodeInput.tsx`).  
   * **Upload file** – drag‑and‑drop component (`UploadDropzone.tsx`).  
   * **GitHub repo** – enter a repo URL; the app uses `lib/github.ts` to fetch the tree. |
4. **Select a prompt** – optional dropdown (`PromptSelect.tsx`) to customise the tone (e.g., “Technical”, “Beginner”). |
5. **Generate** – click **Generate** → client calls `/api/docs/generate` (see API section). A loading spinner (`framer-motion`) appears. |
6. **Result** – The markdown is displayed in a read‑only editor (`react-markdown` wrapper) with a **Copy** button and **Download as .md** link. |
7. **Save** – Press **Save to My Docs** – the document is persisted in MongoDB under the current user’s collection (`docs` collection). |
8. **History** – Navigate to `/dashboard` to view saved docs, edit prompts, or delete entries. |

---

## 🔌 API Endpoints  

| Method | Route | Protected? | Description |
|---|---|---|---|
| `POST` | `/api/auth/[...nextauth]/route.ts` | No (but uses CSRF) | Handles sign‑in, sign‑out, callbacks for NextAuth. |
| `GET` | `/api/docs/history` | ✅ (session) | Returns a list of the logged‑in user’s saved docs. |
| `POST` | `/api/docs/generate` | ✅ (session) | Accepts `{ code?: string, fileUrl?: string, repoUrl?: string, prompt?: string }` → calls Groq SDK, returns `{ markdown, usage }`. |
| `POST` | `/api/docs/save` | ✅ (session) | Persists generated markdown to MongoDB. |
| `DELETE` | `/api/docs/:id` | ✅ (session) | Deletes a saved document. |
| `GET` | `/api/github/tree?url=...` | ✅ (session) | Retrieves a repo’s file tree via Octokit (used by the UI). |
| `GET` | `/api/ratelimit/status` | ✅ (session) | Returns remaining request quota for the current user. |

All API routes live under `app/api/` and use the **Route Handlers** pattern introduced in Next.js 13+.

---

## 📂 Folder Structure  

```
├─ app/                         # Next.js app router
│  ├─ api/                      # Server‑side route handlers
│  │   ├─ auth/[…nextauth]/     # NextAuth.js endpoints
│  │   └─ docs/                 # Generation, save, history
│  ├─ components/               # UI primitives (Radix, Tailwind)
│  │   ├─ layout/               # Breadcrumb, Header, Footer
│  │   ├─ ui/                   # Sonner, Buttons, Inputs, Icons
│  │   └─ forms/                # CodeInput, PromptSelect, UploadDropzone
│  ├─ docs-generator/           # Main page (input → result)
│  ├─ providers/                # SessionProvider, ThemeProvider
│  ├─ lib/                      # Business logic (auth, db, groq, github, ratelimit)
│  ├─ page.tsx                  # Home page – redirects to docs‑generator
│  └─ layout.tsx                # Root layout (theme, session, toast)
├─ config/                      # Optional config files (e.g., tailwind.config.ts)
├─ public/                      # Static assets
├─ tsconfig.json
├─ next.config.ts
└─ package.json
```

*The `@/*` alias in `tsconfig.json` maps to `./app*`, allowing imports like `import { getSession } from "@/lib/auth"`.*

---

## ✅ Testing & Linting  

The repo ships with **ESLint** (configured for Next.js + TypeScript). To run:

```bash
pnpm lint
```

> **Note:** No dedicated test suite is included yet, but you can add Jest or Playwright. The folder `__tests__/` is ignored by default.

---

## 🚢 Deployment  

### Vercel (recommended)

1. Push the repository to GitHub.  
2. Import the project in the Vercel dashboard.  
3. Set the environment variables (see above) in Vercel → Settings → Environment Variables.  
4. Vercel automatically runs `pnpm install && pnpm build` and deploys the app.

### Docker (alternative)

```dockerfile
# Dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN npm i -g pnpm && pnpm install --frozen-lockfile
COPY . .
RUN pnpm build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./
RUN npm i -g pnpm && pnpm install --prod --ignore-scripts

EXPOSE 3000
CMD ["pnpm", "start"]
```

```bash
docker build -t ai-docs-generator .
docker run -p 3000:3000 -e NEXTAUTH_URL=http://localhost:3000 -e MONGODB_URI=... ai-docs-generator
```

---

## 🐞 Troubleshooting  

| Symptom | Likely Cause | Fix |
|---|---|---|
| **“Failed to fetch” on `/api/docs/generate`** | Missing/invalid `GROQ_API_KEY` or network block. | Verify the key in `.env.local` and ensure outbound HTTPS is allowed. |
| **Auth redirects loop** | `NEXTAUTH_URL` does not match the request host. | Set `NEXTAUTH_URL` to the exact URL (including protocol) you use to access the app. |
| **MongoDB connection timeout** | Wrong `MONGODB_URI` or IP not whitelisted (Atlas). | Double‑check the connection string and add your IP to Atlas network access. |
| **Rate‑limit error (429)** | Upstash Redis not reachable or quota exceeded. | Ensure `UPSTASH_REDIS_REST_URL`/`TOKEN` are correct; increase the limit in `lib/ratelimit.ts`. |
| **Tailwind styles not applied** | `globals.css` not imported or `tailwind.config.ts` missing `content` paths. | Verify `app/globals.css` imports `@tailwind base; @tailwind components; @tailwind utilities;` and that `content` includes `"./app/**/*.{js,ts,jsx,tsx}"`. |
| **Dark mode toggle does nothing** | `ThemeProvider` missing `attribute` prop. | Confirm `app/providers/ThemeProvider.tsx` passes `attribute="class"` (it does by default). |

If you encounter a different issue, open an issue with the error stack and a short description of what you were doing.

---

## 🤝 Contributing  

We welcome contributions! Follow these steps:

1. **Fork** the repository.  
2. **Create a feature branch**: `git checkout -b feat/awesome-feature`.  
3. **Install dependencies** (`pnpm install`).  
4. **Make your changes** – keep TypeScript strictness (`npm run lint` should pass).  
5. **Add tests** (if applicable) and update documentation.  
6. **Commit** with a clear message and **push** to your fork.  
7. Open a **Pull Request** against `main`.  

Please adhere to the existing code style (Prettier + ESLint) and include a brief description of the change in the PR body.

---

## 📄 License  

This project is licensed under the **MIT License** – see the `LICENSE` file for details.

---  

*Happy documenting! 🎉*