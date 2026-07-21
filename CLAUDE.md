# SRYTAL Task Management System — Frontend

> React 19 + TypeScript SPA for an HRMS + Project Management platform. This file
> is the source of truth for architecture and conventions. Follow it for every
> change.

## Stack
- React 19, TypeScript (strict)
- React Router (v7)
- TanStack Query (all server state)
- React Hook Form + Zod (forms + validation)
- Mantine UI (**only** UI library) + Tabler icons
- Zustand (client state: auth, selection)
- Axios, DayJS, framer-motion

## Architecture — feature-based
```
src/
 ├── features/<name>/           auth, employee, project, task, ...
 │     ├── components/          presentational + small stateful UI
 │     ├── screens/             route-level pages
 │     ├── hooks/               React Query hooks wrapping services
 │     ├── services/            axios API calls (the ONLY place calling the API)
 │     ├── store/               zustand stores
 │     ├── types/ constants/ utils/ validation/
 ├── components/common/         cross-feature reusable UI (modals, etc.)
 ├── shared/
 │     ├── services/api.ts      configured axios instance (adds JWT header)
 │     ├── config/              routes.ts, queryKeys.ts, env.ts
 │     ├── hooks/ ui/ utils/
 ├── layouts/                   AuthLayout, DashboardLayout, MainLayout
 └── app/                       providers, router
```

## Golden rules
- **No API calls inside components.** `services/` call the API, `hooks/` wrap the
  services with React Query, components/screens consume the hooks.
- **No business logic inside components** — keep them presentational where possible.
- Mantine UI only. Reuse common components. Professional, enterprise HRMS look,
  responsive.
- Strong typing everywhere. **No `any`.**
- All server state goes through TanStack Query. Client-only state → Zustand.

## Data-flow pattern (per feature)
```
services/*.service.ts   → axios call, normalize API shape → domain type
hooks/use*.ts           → useQuery / useMutation, invalidate on success
components / screens     → consume hooks, render Mantine UI
```

## Routing & roles
- Two portals share screens, differ by path prefix and `ProtectedRoute requiredRole`.
- Employee under `/dashboard/*`, Admin under `/admin/dashboard/*`.
- Central route builders in `src/shared/config/routes.ts` (`ROUTES`). Add new
  routes there and in `src/app/router/index.tsx`, and link them in
  `layouts/MainLayout/Sidebar.tsx`.
- `useAuthStore` (persisted) holds `user` + `token`; `api.ts` injects the bearer token.

## Query keys (keep consistent!)
Shared keys live in `shared/config/queryKeys.ts`. Task-related keys currently in
use: `['tasks']` (all tasks), `['tasks', id]` (one task), `['my-tasks']`
(assigned to me). When invalidating after a mutation, match these **exactly** —
e.g. use `['my-tasks']`, not `['myTasks']`.

## Status update flow
`features/task/services/taskStatus.service.ts` → `PATCH /tasks/:id/status`,
wrapped by `features/task/hooks/useUpdateTaskStatus.ts`. Used by task detail and
the Kanban board. Employees may only change status on tasks assigned to them
(enforced server-side).

## Roadmap
✅ Phase 1 Auth · ✅ Phase 2 Employee · ✅ Phase 3 Project · ✅ Phase 4 Task CRUD
· ✅ Phase 5 Employee "My Tasks" · ⬜ Phase 6 Kanban (drag & drop) · ⬜ 7
Comments · ⬜ 8 Attachments · ⬜ 9 Notifications · ⬜ 10 Activity Timeline · ⬜
11 Reports · ⬜ 12 Role Permissions · ⬜ 13 Settings · ⬜ 14 Deployment

## Pending high-priority work
- Force-change-password flow (blocking modal/screen until `mustChangePassword`
  is false, then dashboard).
- Password validation: min 8 chars, upper, lower, special.
