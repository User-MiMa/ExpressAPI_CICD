# Express API DevOps

**Español:** App full-stack "Mystery Page": formulario de suscripción en React (Vite) + API Express + Postgres en Neon (Drizzle ORM). Usa GitHub + GitHub Actions para tests automatizados como parte del pipeline CI/CD a Docker Hub + Render. Es un formulario donde introduces tu email y se guarda en una base de datos remota (Neon) (para saber cómo usar la app, ver [⚙️ Cómo funciona](#como-funciona)). Incluye una migración expand/contract sin downtime `email → email_adress` (ver [🧪 Testing](#testing) → DB).

**English:** Full-stack "Mystery Page" app: React signup form (Vite) + Express API + Postgres on Neon (Drizzle ORM). Uses GitHub + GitHub Actions for automated tests as part of the CI/CD pipeline to Docker Hub + Render. It's a signup form where you enter your email and it's stored in a remote DB (Neon) (to learn how to use the app, see [⚙️ How it works](#como-funciona)). Includes a zero-downtime expand/contract migration `email → email_adress` (see [🧪 Testing](#testing) → DB).

🌐 Demo en producción / Live demo: [https://cicd-1udv.onrender.com](https://cicd-1udv.onrender.com)

---

<details>
<summary>🏁 Inicio Rápido / Quick Start</summary>

**Español:**

1. Clona el repositorio (HTTPS, SSH o GitHub CLI).
2. Renombra `.env.example` a `.env` y añade tus propias variables (`DATABASE_URL`, `DATABASE_URL_TEST`), que obtienes desde Neon o el proveedor de DB de tu elección.
3. Ejecuta `pnpm install` para instalar dependencias.
4. Ejecuta `pnpm db:migrate` para aplicar migraciones a tu base Neon.
5. Ejecuta `pnpm build && pnpm start` y abre `http://localhost:3000`.

> Para probar sin base de datos real, ver `🧪 Testing` (usa mock en memoria `src/fakeDb.js`).

**English:**

1. Clone the repository (HTTPS, SSH or GitHub CLI).
2. Rename `.env.example` to `.env` and add your own vars (`DATABASE_URL`, `DATABASE_URL_TEST`), which you get from Neon or the DB provider of your choice.
3. Run `pnpm install` to install dependencies.
4. Run `pnpm db:migrate` to apply migrations to your Neon DB.
5. Run `pnpm build && pnpm start` and open `http://localhost:3000`.

> To test without a real database, see `🧪 Testing` (uses in-memory mock `src/fakeDb.js`).

</details>

<details>
<summary>📁 Archivos del proyecto / Project files</summary>

**Español:**

- `src/app.js` — Rutas `GET /api/health`, `POST /api/subscribers` + `express.static(dist)`
- `src/server.js` — Arranca el servidor en `PORT || 3000`
- `src/fakeDb.js` — Mock en memoria para tests sin DB real
- `src/db/schema.js` — Tabla `subscribers(id, email_adress unique)`
- `src/db/index.js` — Singleton `getDb()` con Neon
- `src/db/migrate.js` — Ejecuta migraciones Drizzle
- `drizzle.config.js` + `drizzle/migrations/` — Configuración + migraciones SQL
- `public/App.jsx` — Formulario, `fetch` y mensajes de estado
- `public/index.jsx`, `public/index.html`, `public/index.css` — Entrada React, HTML y estilos
- `src/app.test.js`, `public/App.test.jsx` — Tests unitarios e integración
- `e2e/e2e.test.js`, `e2e/global-setup.js` — Tests e2e Playwright + limpieza
- `vite.config.js`, `vitest.config.js`, `playwright.config.js` — Config de build, tests unitarios y e2e
- `eslint.config.js`, `.prettierrc` — Lint y formato
- `Dockerfile` (+ `.dockerignore`) — Solo usado por el CD para producción
- `.github/workflows/ci.yaml` — Pipeline CI/CD
- `package.json`, `.env.example` — Dependencias y ejemplo de variables

**English:**

- `src/app.js` — Routes `GET /api/health`, `POST /api/subscribers` + `express.static(dist)`
- `src/server.js` — Starts server on `PORT || 3000`
- `src/fakeDb.js` — In-memory mock for tests without real DB
- `src/db/schema.js` — `subscribers(id, email_adress unique)` table
- `src/db/index.js` — `getDb()` Neon singleton
- `src/db/migrate.js` — Runs Drizzle migrations
- `drizzle.config.js` + `drizzle/migrations/` — Config + SQL migrations
- `public/App.jsx` — Form, `fetch` and status messages
- `public/index.jsx`, `public/index.html`, `public/index.css` — React entry, HTML and styles
- `src/app.test.js`, `public/App.test.jsx` — Unit and integration tests
- `e2e/e2e.test.js`, `e2e/global-setup.js` — Playwright e2e tests + cleanup
- `vite.config.js`, `vitest.config.js`, `playwright.config.js` — Build, unit test and e2e config
- `eslint.config.js`, `.prettierrc` — Lint and format
- `Dockerfile` (+ `.dockerignore`) — Only used by CD for production
- `.github/workflows/ci.yaml` — CI/CD pipeline
- `package.json`, `.env.example` — Dependencies and vars example

</details>

<details>
<summary>▶️ Cómo empezar a usarlo / How to start using it</summary>

### Opción 1: Localmente / Option 1: Locally

```bash
pnpm install
# renombra .env.example a .env / rename .env.example to .env
pnpm db:migrate
pnpm build && pnpm start
# opcional solo frontend / optional frontend-only:
pnpm dev
```

**Español:**

- API + frontend en `http://localhost:3000`.
- `pnpm dev` usa Vite en `:5173` con proxy `/api` → `:3000` (`vite.config.js`).

**English:**

- API + frontend at `http://localhost:3000`.
- `pnpm dev` runs Vite on `:5173` with `/api` proxy → `:3000` (`vite.config.js`).

### Opción 2: Producción real / Option 2: Real production

**Español:** Producción está alojada en Render para front/back y Neon para DB, con deploy automático desde `main` (migra la DB + construye una imagen Docker versionada por commit + avisa a Render vía deploy hook).

**English:** Production is hosted on Render for front/back and Neon for DB, with auto-deploy from `main` (migrates DB + builds a per-commit versioned Docker image + triggers Render via deploy hook).
</details>

<details>
<summary>📦 ¿Qué necesitas? / What you need?</summary>

**Español:**

- Node.js 24 (versión usada en `Dockerfile` y `ci.yaml`)
- pnpm 11.6.0 (ver `devEngines` en `package.json`)
- Cuenta Neon o Postgres compatible (para `DATABASE_URL` + `DATABASE_URL_TEST`)
- Docker (opcional, solo para reproducir el build de producción localmente)
- Git + cuenta GitHub (para CI/CD, secrets `DATABASE_URL`, `DATABASE_URL_TEST`, `DOCKERHUB_TOKEN`, `RENDER_DEPLOY_HOOK_URL`)

**English:**

- Node.js 24 (version used in `Dockerfile` and `ci.yaml`)
- pnpm 11.6.0 (see `devEngines` in `package.json`)
- Neon account or compatible Postgres (for `DATABASE_URL` + `DATABASE_URL_TEST`)
- Docker (optional, only to reproduce the production build locally)
- Git + GitHub account (for CI/CD, secrets `DATABASE_URL`, `DATABASE_URL_TEST`, `DOCKERHUB_TOKEN`, `RENDER_DEPLOY_HOOK_URL`)

</details>

<details id="como-funciona">
<summary>⚙️ Cómo funciona / How it works</summary>

**Español:**

1. Frontend `public/App.jsx:7` `submitEmail` → `fetch POST /api/subscribers` con `{email: trimmed}` → según status: `200` limpia input + "Successfully subscribed", `409` → "Already subscribed", `400` → "Invalid email", otro/`catch` → "Something went wrong...".
2. Backend `src/app.js:24-50` trim + `validator.isEmail(email)` → `400 {error:'Invalid email'}` si falla; si no, `insert(...).onConflictDoNothing({target: emailAdress}).returning()` → vacío = `409 {error:'Already subscribed'}`, con fila = `200 {message:'Successfully subscribed'}`; `throw`/sin `DATABASE_URL` → `500 {error:'An error ocurred'}`.
3. DB `src/db/schema.js:3` `subscribers(id serial PK, email_adress varchar(254) unique not null)` + `src/db/index.js:7` singleton Neon `drizzle(neon(DATABASE_URL))` + `drizzle.config.js` dialecto `postgresql`.
4. Servido + health: `src/app.js:52` `express.static(dist)` (prod `pnpm build` → `dist/`), `vite.config.js:11` proxy `/api → :3000` en dev; `GET /api/health` (`src/app.js:15`) `SELECT 1` → `200 {status:'ok'}` o `503 {status:'unavailable'}`.

**English:**

1. Frontend `public/App.jsx:7` `submitEmail` → `fetch POST /api/subscribers` with `{email: trimmed}` → by status: `200` clears input + "Successfully subscribed", `409` → "Already subscribed", `400` → "Invalid email", other/`catch` → "Something went wrong...".
2. Backend `src/app.js:24-50` trim + `validator.isEmail(email)` → `400 {error:'Invalid email'}` on fail; else `insert(...).onConflictDoNothing({target: emailAdress}).returning()` → empty = `409 {error:'Already subscribed'}`, with row = `200 {message:'Successfully subscribed'}`; `throw`/missing `DATABASE_URL` → `500 {error:'An error ocurred'}`.
3. DB `src/db/schema.js:3` `subscribers(id serial PK, email_adress varchar(254) unique not null)` + `src/db/index.js:7` Neon singleton `drizzle(neon(DATABASE_URL))` + `drizzle.config.js` `postgresql` dialect.
4. Serving + health: `src/app.js:52` `express.static(dist)` (prod `pnpm build` → `dist/`), `vite.config.js:11` `/api → :3000` proxy in dev; `GET /api/health` (`src/app.js:15`) `SELECT 1` → `200 {status:'ok'}` or `503 {status:'unavailable'}`.

</details>

<details>
<summary>🧱 Estructura de archivos / File structure</summary>

Entry points / Puntos de entrada:

```
├── src/app.js             → API + dist estático / API + static dist
├── src/server.js          → escucha en PORT||3000 / listens on PORT||3000
└── public/index.jsx       → entrada React, renderiza App en #root / React entry, renders App in #root
```

Backend + DB:

```
├── src/db/schema.js       → tabla subscribers / subscribers table
├── src/db/index.js        → singleton getDb() con Neon / getDb() Neon singleton
├── src/db/migrate.js      → runner de migraciones / migration runner
└── drizzle/migrations/    → migraciones SQL 0000-0005 / SQL migrations 0000-0005
```

Frontend:

```
├── public/App.jsx         → formulario + fetch / form + fetch
├── public/index.html      → HTML principal / main HTML
└── public/index.css       → estilos globales / global styles
```

Testing / Tests:

```
├── src/app.test.js + src/fakeDb.js   → tests API + mock en memoria / API tests + in-memory mock
├── public/App.test.jsx               → tests del formulario / form tests
└── e2e/{e2e.test.js, global-setup.js} → tests e2e + limpieza / e2e tests + cleanup
```

Config / DevOps / Configuración:

```
├── vite.config.js, vitest.config.js, playwright.config.js   → config build, tests unitarios y e2e / build, unit and e2e config
├── eslint.config.js, .prettierrc                            → lint y formato / lint and format
├── Dockerfile, .dockerignore                                → solo usado por CD / only used by CD
├── .github/workflows/ci.yaml                               → pipeline CI/CD / CI/CD pipeline
└── package.json, .env.example                               → dependencias y ejemplo de vars / dependencies and vars example
```

**Español:**

- `server.js` arranca, `app.js` sirve API + `dist/`
- `public/` es `root` de Vite (`vite.config.js`), `outDir: ../dist`
- `e2e/` separado de los tests unitarios

**English:**

- `server.js` starts, `app.js` serves API + `dist/`
- `public/` is Vite `root` (`vite.config.js`), `outDir: ../dist`
- `e2e/` kept separate from unit tests

</details>

<details id="testing">
<summary>🧪 Testing</summary>

### Unitarios e integración / Unit & integration (Vitest)

**Español:** Vitest + Testing Library + jsdom + Supertest. `src/app.test.js` usa `src/fakeDb.js` (sin DB real, 7 casos: health 200/503, subscribe 200/409/400/500). `public/App.test.jsx` mockea `fetch` (7 casos: título, form, 200/409/400/500/`catch`). Config en `vitest.config.js`.

**English:** Vitest + Testing Library + jsdom + Supertest. `src/app.test.js` uses `src/fakeDb.js` (no real DB, 7 cases: health 200/503, subscribe 200/409/400/500). `public/App.test.jsx` mocks `fetch` (7 cases: title, form, 200/409/400/500/`catch`). Config in `vitest.config.js`.

```bash
pnpm test
pnpm test:coverage
```

### E2E (Playwright)

**Español:** `e2e/e2e.test.js` 4 casos (nuevo ok, duplicado → error, inválido no envía, 500 con `page.route`). Solo corre con `DATABASE_URL_TEST` (si no, `skip`). `e2e/global-setup.js` borra `it-%@example.com`. `playwright.config.js` con `baseURL :3000`, `webServer: pnpm start`.

**English:** `e2e/e2e.test.js` 4 cases (new ok, duplicate → error, invalid doesn't submit, 500 via `page.route`). Only runs with `DATABASE_URL_TEST` (else `skip`). `e2e/global-setup.js` wipes `it-%@example.com`. `playwright.config.js` with `baseURL :3000`, `webServer: pnpm start`.

```bash
pnpm build
pnpm e2e:test
```

### Lint + Formato / Lint + Format

```bash
pnpm lint
pnpm format:check
```

### CI/CD

**Español:** `.github/workflows/ci.yaml` 3 jobs: `build-and-test` (format+lint+test) → `end-to-end-test` (chromium + `DATABASE_URL_TEST`) → `build-and-push` (solo `push`: `db:migrate` prod + imagen versionada por commit + deploy hook a Render).

**English:** `.github/workflows/ci.yaml` 3 jobs: `build-and-test` (format+lint+test) → `end-to-end-test` (chromium + `DATABASE_URL_TEST`) → `build-and-push` (on `push` only: prod `db:migrate` + per-commit versioned image + deploy hook to Render).

### DB

**Español:** Migración destacada expand/contract sin downtime `email → email_adress`:

- `0000` crea `subscribers(email unique not null)`
- `0001` añade `email_adress` nullable (expand)
- `0002` backfill `SET email_adress = email`
- `0003` `email_adress SET NOT NULL + UNIQUE`
- `0004` `email DROP NOT NULL` (relaja restricción)
- `0005` `DROP CONSTRAINT + DROP COLUMN email` (contract)

**English:** Highlight zero-downtime expand/contract migration `email → email_adress`:

- `0000` creates `subscribers(email unique not null)`
- `0001` adds nullable `email_adress` (expand)
- `0002` backfill `SET email_adress = email`
- `0003` `email_adress SET NOT NULL + UNIQUE`
- `0004` `email DROP NOT NULL` (relax constraint)
- `0005` `DROP CONSTRAINT + DROP COLUMN email` (contract)

```bash
pnpm db:generate
pnpm db:migrate
```

</details>
