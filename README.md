# Srytal Todo Frontend

This repository contains the frontend for the Srytal task management application. It is a React + TypeScript app built with Vite and designed around two user roles: employee and admin.

The UI is organized by feature, uses lazy-loaded routes, and relies on a persisted auth store so users remain logged in between page refreshes.

## Overview

- Role-based access control for employee and admin portals
- Dashboard and management screens for tasks, projects, and employees
- Protected routes based on authenticated user and required role
- Responsive shell with header and sidebar layout
- API-driven data layer using React Query and Axios
- Theme support via Mantine and custom styling tokens

## Tech stack

- React 19
- TypeScript
- Vite
- React Router DOM
- TanStack Query
- Mantine UI
- Zustand
- Axios
- Framer Motion
- Recharts
- React Hook Form + Zod
- Jest + Testing Library

## Prerequisites

- Node.js 20+
- npm
- A running backend API for authentication and data operations

## Getting started

```bash
npm install
npm run dev
```

By default, the app is served on:

- http://localhost:5173

## Environment variables

Create a `.env` file in the project root if your backend URL is not using the default app configuration:

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

If the backend is running elsewhere, update this value accordingly before starting the frontend.

## Available scripts

```bash
npm run dev
npm run build
npm run typecheck
npm run lint
npm run lint:fix
npm run format
npm run format:check
npm test
npm run test:watch
npm run test:coverage
npm run server
```

### Script descriptions

- `npm run dev` — start the Vite development server
- `npm run build` — run type checking and create a production build
- `npm run typecheck` — run TypeScript checks only
- `npm run lint` — run ESLint
- `npm run format` — format the codebase with Prettier
- `npm test` — run the Jest suite
- `npm run server` — start the local mock JSON server

## App architecture

### Routing

The application uses React Router and lazy loading for page modules. Key routing files are:

- [src/app/App.tsx](src/app/App.tsx)
- [src/app/router/index.tsx](src/app/router/index.tsx)
- [src/app/router/ProtectedRoute.tsx](src/app/router/ProtectedRoute.tsx)
- [src/shared/config/routes.ts](src/shared/config/routes.ts)

The router includes:

- public login routes for employee and admin
- employee-protected dashboard routes
- admin-protected dashboard routes
- redirect logic for unauthenticated users and password resets

### Auth

Authentication state is stored with Zustand and persisted locally:

- [src/features/auth/store/auth.store.ts](src/features/auth/store/auth.store.ts)

It stores:

- current user
- access token
- refresh token
- methods for login, logout, session updates, and user updates

### Providers

Global application providers are configured in:

- [src/app/providers/AppProviders.tsx](src/app/providers/AppProviders.tsx)

This includes:

- React Query client
- Mantine provider
- toast notifications

### Layout

The UI uses a main application shell with a header and sidebar:

- [src/layouts/MainLayout/MainLayout.tsx](src/layouts/MainLayout/MainLayout.tsx)
- [src/layouts/MainLayout/Header.tsx](src/layouts/MainLayout/Header.tsx)
- [src/layouts/MainLayout/Sidebar.tsx](src/layouts/MainLayout/Sidebar.tsx)

## Feature structure

The project is organized by feature under the `src/features` directory:

```text
src/
├── app/
│   ├── providers/
│   └── router/
├── assets/
├── components/
├── features/
│   ├── auth/
│   ├── dashboard/
│   ├── employee/
│   ├── task/
│   ├── project/
│   ├── report/
│   ├── notification/
│   ├── profile/
│   └── settings/
├── layouts/
├── shared/
├── styles/
├── theme/
├── tests/
└── main.tsx
```

Main feature areas include:

- auth: login and password change flow
- dashboard: overview and analytics summary screens
- employee: employee management and details
- task: task list, board, details, and task actions
- project: project list and details
- report: reporting and charts
- settings and profile: account configuration screens

## Notes

- The app uses lazy-loaded screens via `React.lazy()` to keep route loading modular.
- Role checks happen at the router level through `ProtectedRoute`.
- Users who must change their password are redirected to the password-change screen before accessing protected pages.
- The project includes a sizeable Jest suite under [src/tests](src/tests) covering UI, hooks, services, and screens.

## License

This project is provided as-is for the Srytal task management frontend.
