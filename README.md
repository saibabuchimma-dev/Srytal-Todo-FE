# SRYTAL — Task Management (Frontend)

A modern, role-based task and project management web app built with **React 19**, **TypeScript**, and **Mantine**. SRYTAL lets administrators manage employees, projects, and tasks, while employees track their own work through a clean dashboard, Kanban board, and task views. It talks to the [SRYTAL backend API](https://github.com/) over REST.

> This is the **frontend** repository. The REST API lives in the `Srytal-Todo-BE` repository and must be running for the app to work.

---

## ✨ Features

- **Role-based portals** — separate Admin and Employee experiences with protected routes.
- **Dashboard** — KPIs, task-completion ring, and upcoming work at a glance.
- **Tasks** — create, assign, filter, paginate, and view task detail pages.
- **Kanban board** — drag-and-drop tasks between Pending / In Progress / Completed with optimistic updates.
- **Projects** — manage projects, members, timelines, and per-project task breakdowns.
- **Employees** — admin CRUD for team members with per-employee stats.
- **Comments & attachments** — Markdown comments and file attachments on tasks.
- **Notifications** — in-app bell for assignments, status changes, and comments.
- **Reports & analytics** — status, priority, and monthly-trend charts (Recharts).
- **Settings** — profile (with avatar upload), security (password change), and preferences.
- **Light / dark theme** — centralized design tokens; theme toggle on the dashboard and login screen.
- **Mobile responsive** — collapsible sidebar and adaptive layouts.

---

## 🧰 Tech Stack

| Area | Technology |
| --- | --- |
| Framework | React 19, Vite 8 |
| Language | TypeScript (strict) |
| UI | Mantine 9, Tailwind CSS 4, Tabler / React Icons |
| Data fetching | TanStack Query v5, Axios |
| State | Zustand (with persistence) |
| Routing | React Router 7 (lazy-loaded routes) |
| Forms | React Hook Form + Zod |
| Charts | Recharts |
| Misc | framer-motion, sonner (toasts), date-fns, react-markdown |
| Testing | Jest + React Testing Library |

---

## 📋 Prerequisites

- **Node.js 20+** and **npm**
- A running instance of the **SRYTAL backend** (default: `http://localhost:5000`)

---

## 🚀 Getting Started

```bash
# 1. Install dependencies
npm install

# 2. Create your environment file (see below)
cp .env.example .env

# 3. Start the dev server (http://localhost:5173)
npm run dev
```

### Environment variables

Create a `.env` file in the project root:

```env
# Base URL of the SRYTAL backend API
VITE_API_BASE_URL=http://localhost:5000/api

# App metadata
VITE_APP_NAME=SRYTAL
VITE_APP_VERSION=1.0.0
```

| Variable | Description | Default |
| --- | --- | --- |
| `VITE_API_BASE_URL` | Base URL of the backend REST API | `http://localhost:5000/api` |
| `VITE_APP_NAME` | Application name shown in the UI | `SRYTAL` |
| `VITE_APP_VERSION` | Displayed app version | `1.0.0` |

---

## 📜 Scripts

| Script | Description |
| --- | --- |
| `npm run dev` | Start the Vite dev server |
| `npm run build` | Type-check and build for production |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run ESLint |
| `npm run format` | Format the codebase with Prettier |
| `npm test` | Run the Jest unit test suite |
| `npm run test:watch` | Run tests in watch mode |
| `npm run test:coverage` | Run tests and generate a coverage report |

---

## 🧪 Testing

Unit tests are written with **Jest** and **React Testing Library**, and live in [`src/tests/`](src/tests). The suite covers utilities, stores, hooks, services, shared UI, feature components, and screens.

```bash
npm test              # run all tests
npm run test:coverage # run with a coverage report (see /coverage)
```

Test tooling (config at the repo root):

- `jest.config.cjs` — Jest configuration (jsdom, module mappers, coverage).
- `babel.jest.cjs` — Babel preset used only by Jest.
- `jest/` — setup file, jsdom polyfills, asset/CSS/icon mocks, and a shared `renderWithProviders` helper.

Import specs against the shared render helper via the `@test-utils` alias:

```ts
import { renderWithProviders, screen, userEvent } from '@test-utils';
```

---

## 📁 Project Structure

```
src/
├── app/                # App composition: providers, router, route guards
│   ├── providers/      # QueryClient, Mantine, toaster
│   └── router/         # Route table + lazy-loaded screens
├── assets/             # Images and logos
├── components/         # Cross-cutting shared components
├── features/           # Feature modules (self-contained)
│   ├── auth/           # Login, change-password, auth store
│   ├── dashboard/      # Dashboard screen + stat cards
│   ├── employee/       # Employee CRUD, table, details
│   ├── task/           # Tasks, board, cards, modals
│   ├── project/        # Projects, details, tasks table
│   ├── comment/        # Markdown comments
│   ├── attachment/     # Task attachments
│   ├── notification/   # Notification bell + menu
│   ├── report/         # Analytics charts
│   ├── profile/        # Profile redirect
│   └── settings/       # Profile, security, preferences
├── layouts/            # App shell (header, sidebar)
├── shared/             # Reusable UI, hooks, services, stores, config, utils
├── theme/              # Design tokens (light/dark) + Mantine theme
├── styles/             # Global styles and loader
└── tests/              # Jest specs
```

---

## 🔌 Connecting to the Backend

The app expects the backend at `VITE_API_BASE_URL`. Axios automatically attaches the JWT (from the persisted auth store) to every request and surfaces API errors as toasts. Start the backend first, then run `npm run dev`.

---

## 📄 License

This project is provided as-is for the SRYTAL task-management system.
