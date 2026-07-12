# Hostel Booking Platform — Frontend

React + Vite + TypeScript frontend for the Hostel Booking Platform.

## Tech Stack

- **React 19** with **Vite 8**
- **TypeScript**
- **Tailwind CSS v4** (theme tokens in `src/styles/theme.css`)
- **Redux Toolkit + RTK Query** (Step 3+)
- **React Router v6** (Step 4+)
- **React Hook Form + Zod** (Step 3+)
- **Lodash**

## Getting Started

```bash
cd frontend
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) — you'll see the theme preview (dark sidebar, teal accent, skeleton cards).

## Environment

Copy `.env.example` to `.env`:

```
VITE_API_BASE_URL=/api
```

The Vite dev server proxies `/api` → `http://localhost:8822` (Spring Boot backend).

## Build

```bash
npm run build
npm run preview
```

## Folder Structure

Feature-based layout mirroring the backend — see `src/` for the full tree. Placeholder stubs are in place for Steps 2–8.

## Theme

All colors, radii, and shadows are defined as CSS variables in `src/styles/theme.css` and exposed as Tailwind utilities (`bg-sidebar-bg`, `text-accent`, `rounded-card`, etc.). **Never hardcode hex values in components.**

| Token | Value | Usage |
|-------|-------|-------|
| `--color-sidebar-bg` | `#0f1b2d` | Dark navy sidebar |
| `--color-accent` | `#14b8a6` | Teal accent, CTAs |
| `--color-bg-page` | `#eef1f6` | Page background |
| `--radius-card` | `12px` | Card corners |
| `--shadow-card` | subtle | Card elevation |

## Implementation Steps

1. ✅ Project scaffold + Tailwind theme
2. Reusable UI components
3. Redux store + auth API + login/register
4. Routes + layouts
5. Owner panel (hostels, rooms, payments)
6. Owner bookings
7. Student browse + seat map
8. Checkout + my bookings

Say **"next"** in Cursor to proceed to Step 2.
