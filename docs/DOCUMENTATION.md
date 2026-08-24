# Smart Expense Manager — Developer Documentation

## Table of Contents
1. [Project Overview](#1-project-overview)
2. [Tech Stack](#2-tech-stack)
3. [Project Structure](#3-project-structure)
4. [Getting Started](#4-getting-started)
5. [Environment Variables](#5-environment-variables)
6. [Database Schema](#6-database-schema)
7. [Authentication](#7-authentication)
8. [Routing](#8-routing)
9. [Pages](#9-pages)
10. [Services](#10-services)
11. [Theme & Styling](#11-theme--styling)

---

## 1. Project Overview

Smart Expense Manager is a personal finance web app built with React + TypeScript and Supabase as the backend. Users can track expenses and income, manage budget categories, and monitor spending progress — all scoped to their own account via Row Level Security (RLS).

---

## 2. Tech Stack

| Area | Technology | Version |
|---|---|---|
| UI Library | React | 19 |
| Language | TypeScript | ~5.9 |
| Styling | Tailwind CSS | 4.2 |
| Animations | Framer Motion | 12 |
| Icons | Lucide React | 0.576 |
| Routing | React Router | v7 |
| Backend / Auth | Supabase | 2.x |
| Build Tool | Vite | 7 |
| Linting | ESLint 9 + typescript-eslint | 9 |

---

## 3. Project Structure

```
src/
├── App.tsx                  # Root component — router + AuthProvider
├── main.tsx                 # React DOM entry point
├── index.css                # Global styles & Tailwind theme variables
│
├── contexts/
│   └── AuthContext.tsx      # Global auth state (user, session, signIn, signUp, signOut)
│
├── components/
│   ├── ProtectedRoute.tsx   # Redirects unauthenticated users to /login
│   └── ShapeLandingHero.tsx # Animated geometric hero for the landing page
│
├── pages/
│   ├── LandingPage.tsx      # Public landing page
│   ├── Login.tsx            # Login form
│   ├── Signup.tsx           # Signup form
│   ├── Dashboard.tsx        # Overview — balance, recent transactions, budget progress
│   ├── Transactions.tsx     # Full transaction list with add/edit/delete
│   ├── Budgets.tsx          # Category budget management
│   ├── Income.tsx           # Income tracking
│   ├── Account.tsx          # User profile and account stats
│   └── Settings.tsx         # App preferences, notifications, security
│
├── services/
│   ├── expenses.ts          # Supabase CRUD helpers for the expenses table
│   └── auth.ts              # Auth service helpers
│
└── lib/
    ├── supabase.ts          # Supabase client instance
    └── utils.ts             # clsx + tailwind-merge utility (cn)
```

---

## 4. Getting Started

### Prerequisites
- Node.js ≥ 18
- A [Supabase](https://supabase.com) project

### Installation

```bash
# Install dependencies
npm install

# Start the dev server
npm run dev
```

### Other Scripts

| Script | Description |
|---|---|
| `npm run dev` | Start Vite dev server at `http://localhost:5173` |
| `npm run build` | Type-check + production build |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run ESLint across the project |

---

## 5. Environment Variables

Create a `.env.local` file in the project root:

```env
VITE_SUPABASE_URL="https://your-project-ref.supabase.co"
VITE_SUPABASE_ANON_KEY="your-anon-key-here"
```

Both values are available in your Supabase dashboard under **Settings → API**.

> These variables are exposed to the browser via Vite's `import.meta.env`. Never put secret keys here — only the public anon key.

---

## 6. Database Schema

Run `supabase-schema.sql` in your Supabase SQL Editor to set up the database.

### `expenses` table

| Column | Type | Description |
|---|---|---|
| `id` | UUID | Primary key |
| `user_id` | UUID | References `auth.users` |
| `amount` | DECIMAL(10,2) | Positive = income, negative = expense |
| `description` | TEXT | Transaction label |
| `category` | TEXT | Matches a category name |
| `category_color` | TEXT | Hex color copied from the category at insert time |
| `date` | DATE | Transaction date |
| `created_at` | TIMESTAMPTZ | Auto-set |
| `updated_at` | TIMESTAMPTZ | Auto-set |

> If the table already exists without `category_color`, run:
> ```sql
> ALTER TABLE expenses ADD COLUMN IF NOT EXISTS category_color TEXT NOT NULL DEFAULT '#818cf8';
> ```

### `categories` table

| Column | Type | Description |
|---|---|---|
| `id` | UUID | Primary key |
| `user_id` | UUID | References `auth.users` |
| `name` | TEXT | Category label (e.g. "Food & Dining") |
| `color` | TEXT | Hex color for UI display |
| `budget` | DECIMAL(12,2) | Monthly budget limit |
| `icon` | TEXT | Optional icon name |
| `created_at` | TIMESTAMPTZ | Auto-set |

### Row Level Security (RLS)

All tables have RLS enabled. Each table has four policies (SELECT, INSERT, UPDATE, DELETE) that enforce `auth.uid() = user_id`, so users can only ever access their own data.

### Default Categories Trigger

A PostgreSQL trigger (`on_auth_user_created`) fires after every new user signup and inserts these default categories for them:

| Name | Color | Default Budget |
|---|---|---|
| Food & Dining | `#f59e0b` | ₱15,000 |
| Transportation | `#3b82f6` | ₱8,000 |
| Entertainment | `#8b5cf6` | ₱5,000 |
| Shopping | `#ec4899` | ₱10,000 |
| Bills & Utilities | `#10b981` | ₱12,000 |
| Healthcare | `#ef4444` | ₱5,000 |
| Other | `#6b7280` | ₱10,000 |

---

## 7. Authentication

Authentication is handled by Supabase Auth (JWT-based) and exposed app-wide via `AuthContext`.

### AuthContext (`src/contexts/AuthContext.tsx`)

```typescript
interface AuthContextType {
  user: User | null;       // Current Supabase user object
  session: Session | null; // Current JWT session
  isLoading: boolean;      // True while the initial session is being resolved
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, fullName: string) => Promise<void>;
  signOut: () => Promise<void>;
}
```

Wrap any component with `useAuth()` to access these values:

```typescript
const { user, signOut } = useAuth();
```

`AuthProvider` must wrap the entire app (already done in `App.tsx`). It listens to `supabase.auth.onAuthStateChange` so the UI always reflects the current session state.

### ProtectedRoute (`src/components/ProtectedRoute.tsx`)

Wraps all authenticated routes. If `isLoading` is true it shows a loading state; if there is no `user` it redirects to `/login`.

```tsx
<ProtectedRoute>
  <DashboardPage />
</ProtectedRoute>
```

### Token Handling

Supabase stores the JWT in `localStorage` automatically and refreshes it before expiry. No manual token management is needed.

---

## 8. Routing

Defined in `App.tsx` using React Router v7.

| Path | Component | Protected |
|---|---|---|
| `/` | `LandingPage` | No |
| `/login` | `LoginPage` | No |
| `/signup` | `SignupPage` | No |
| `/dashboard` | `DashboardPage` | Yes |
| `/transactions` | `TransactionsPage` | Yes |
| `/income` | `IncomePage` | Yes |
| `/budgets` | `BudgetsPage` | Yes |
| `/account` | `AccountPage` | Yes |
| `/settings` | `SettingsPage` | Yes |
| `*` | Redirects to `/` | — |

---

## 9. Pages

### Dashboard (`/dashboard`)
Fetches all expenses for the current user on mount and computes:
- **Total Balance** — sum of all transactions (all time)
- **Monthly Income** — sum of positive amounts in the current calendar month
- **Monthly Expenses** — sum of negative amounts in the current calendar month
- **Net Savings** — monthly income minus monthly expenses
- **Recent Transactions** — last 5 transactions ordered by date
- **Budget Progress** — per-category spent vs budget, only shows categories that have a budget set

### Transactions (`/transactions`)
Full CRUD for the `expenses` table.
- Add/edit modal with description, amount, date, category picker (visual grid with color swatches), and an income toggle
- Positive `amount` = income, negative `amount` = expense
- Search filters the list client-side by description
- Categories are loaded from the `categories` table for the current user

### Budgets (`/budgets`)
Manages the `categories` table.
- Add/edit/delete categories with name, monthly budget amount, and color
- Progress bars show spent vs budget per category (turns red at ≥ 80%)
- Overall budget usage bar across all categories
- Spent amounts are calculated from the `expenses` table in real time (no page reload)

### Account (`/account`)
Displays the user's profile pulled from `supabase.auth.getUser()` and live stats:
- Total transactions, total spent, total income, number of categories

### Settings (`/settings`)
UI-only preferences (notifications, appearance, security toggles). Functional items:
- **Export Data** — downloads all expenses and categories as a JSON file
- **Delete Account** — placeholder (requires a Supabase Edge Function to delete auth users)

---

## 10. Services

### `src/services/expenses.ts`

Reusable Supabase query helpers. Pages can use these instead of writing inline queries.

| Function | Description |
|---|---|
| `getExpenses()` | Fetch all expenses for the current user, ordered by date desc |
| `getExpensesWithFilters(filters)` | Fetch with optional `startDate`, `endDate`, `category` filters |
| `createExpense(data)` | Insert a new expense row |
| `updateExpense(id, updates)` | Update an existing expense by ID |
| `deleteExpense(id)` | Delete an expense by ID |
| `getTotalExpenses(startDate?, endDate?)` | Sum of all amounts in a date range |
| `getExpensesByCategory(startDate?, endDate?)` | Returns `Record<string, number>` grouped by category |

### `src/lib/supabase.ts`

Exports a single shared Supabase client instance used across the entire app:

```typescript
import { supabase } from '../lib/supabase';
```

### `src/lib/utils.ts`

Exports the `cn()` helper that merges Tailwind classes safely:

```typescript
import { cn } from '../lib/utils';
cn('px-4 py-2', isActive && 'bg-blue-500')
```

---

## 11. Theme & Styling

The app uses a custom **ocean-inspired dark theme** defined as CSS variables in `src/index.css`.

### Color Palette

| Token | Hex | Usage |
|---|---|---|
| `--background` | `#091114` | Page background |
| `--foreground` | `#ecf1f3` | Primary text |
| `--primary` | `#98c9de` | Buttons, active states |
| `--secondary` | `#1a6382` | Cards, borders |
| `--accent` | `#22ade7` | Interactive highlights |

### Tailwind Semantic Classes

Use these instead of raw hex values to stay consistent with the theme:

```
bg-background    text-foreground
bg-primary       bg-secondary
bg-accent        border-border
```

### Gradient Classes (Tailwind v4)

Tailwind v4 uses `bg-linear-to-*` instead of `bg-gradient-to-*`:

```tsx
// Correct (Tailwind v4)
<div className="bg-linear-to-br from-[#818cf8] to-[#6366f1]" />

// Incorrect (Tailwind v3 syntax — will trigger a lint warning)
<div className="bg-gradient-to-br from-[#818cf8] to-[#6366f1]" />
```
