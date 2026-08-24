# Smart Expenses Manager

**A modern, smart personal expense tracker built to help you understand, control, and optimize your spending habits.**

> **Current Project Phase: Early MVP Development (Phase 1)**  
> We're in the initial stages of building the foundation for this application. Core authentication and layout infrastructure is being established before implementing the main expense tracking features.

![App screenshot / hero image placeholder](https://via.placeholder.com/800x400?text=Smart+Expenses+Manager+-+Coming+Soon)  
*(Screenshots will be added as core features are implemented)*

## 🎯 Project Goal & Vision

The main goal of **Smart Expenses Manager** is to create an **intuitive, powerful, and insightful** personal finance tool that goes beyond simple expense logging.

Most expense trackers only record what you spent.  
**Smart Expenses Manager** aims to help you answer:

- Where is my money really going?
- Am I staying within my budget?
- What patterns can I change to save more?
- How close am I to my financial goals?

It combines clean UX, powerful categorization, visual analytics, and (future) smart insights — all built with **React + TypeScript** for a fast, type-safe, and maintainable codebase.

## 🚀 Project Roadmap & Current Status

### Phase 1: Foundation & Authentication (✅ Completed)
✅ **Completed:**
- Project setup with Vite + React + TypeScript
- Basic routing configuration (React Router v7)
- Landing page with geometric hero section
- Full functional Login page with Supabase auth
- Full functional Signup page with Supabase auth
- ShadCN/ui component infrastructure setup
- Tailwind CSS configuration with animations
- **Supabase backend fully integrated** (authentication & database)
- PostgreSQL database schema with RLS policies
- User-specific data isolation
- Automatic default category creation for new users
- **JWT-based authentication system** with AuthContext and protected routes
- Custom ocean-inspired theme implementation
- Full responsive dashboard layout with all core pages

### Phase 2: Core Expense Tracking (Current - In Progress)
🔄 **In Development:**
- Add, edit, and delete expenses functionality
- Expense categorization system (Food, Transport, Bills, Entertainment, etc.)
- Income entry support for balance calculation
- Basic dashboard with transaction list
- Dashboard layout skeleton
- Responsive design implementation across all pages

### Phase 2: Core Expense Tracking (Up Next)
📋 **Planned:**
- Add, edit, and delete expenses functionality
- Expense categorization system (Food, Transport, Bills, Entertainment, etc.)
- Income entry support for balance calculation
- Basic dashboard with transaction list
- LocalStorage data persistence
- Mobile-responsive expense management views

### Phase 3: Analytics & Smart Features
📋 **Planned:**
- Interactive charts and data visualizations (Recharts)
- Monthly budgets per category with alerts
- Spending trend analysis
- Data export (CSV/PDF)
- Dark/Light theme toggle
- Multi-currency support

### Phase 4: Cloud & Advanced Features
📋 **Planned:**
- User authentication backend integration
- Cloud sync & data persistence
- Smart AI-powered categorization suggestions
- Receipt photo upload with OCR parsing
- Mobile app deployment considerations

## 🛠️ Current Tech Stack

| Area            | Technology                          | Status                               | Purpose                              |
|-----------------|-------------------------------------|--------------------------------------|--------------------------------------|
| Frontend        | React 19                            | ✅ Installed                          | Modern UI library with latest features |
| Language        | TypeScript ~5.9                     | ✅ Installed                          | Type safety & improved developer experience |
| Styling         | Tailwind CSS 4.2                    | ✅ Installed                          | Utility-first CSS framework          |
| UI Components   | shadcn/ui (with tailwind-animate)   | ✅ Configured                         | Reusable, accessible component library |
| Animations      | Framer Motion 12                    | ✅ Installed                          | Smooth animations and interactions   |
| Icons           | Lucide React 0.576                  | ✅ Installed                          | Modern icon library                   |
| Routing         | React Router v7                     | ✅ Installed                          | Client-side navigation                |
| Build Tool      | Vite 7.3                             | ✅ Installed                         | Fast development server & builds     |
| Linting         | ESLint 9 + TypeScript-ESLint        | ✅ Configured                         | Code quality enforcement              |
| Backend/Auth    | Supabase                            | ✅ Installed & Integrated             | User authentication & cloud storage  |
| Database        | PostgreSQL (Supabase)               | ✅ Implemented                        | Relational database with RLS policies |
| Database SDK    | @supabase/supabase-js               | ✅ Installed                          | Supabase client for frontend integration |
| **Planned Additions** |                                     |                                      |                                      |
| State Management| Zustand                             | 📋 Planned                            | Lightweight state management         |
| Charts          | Recharts                            | 📋 Planned                            | Data visualization & analytics      |
| Forms           | React Hook Form + Zod               | 📋 Planned                            | Type-safe form validation            |

## 🔐 Authentication System (JWT-based)

The application implements **JWT-based authentication** using Supabase's authentication system, which automatically handles token generation, storage, and refresh.

### Key Authentication Features:
- **Global Auth State Management**: `AuthContext` provides authentication state throughout the app
- **Protected Routes**: Only authenticated users can access dashboard pages
- **Automatic Session Management**: Supabase handles JWT token refresh automatically
- **Secure Storage**: Tokens are stored securely in browser localStorage
- **Redirect Logic**: Unauthenticated users are redirected to login page

### AuthContext Implementation
Located at `src/contexts/AuthContext.tsx`, the context provides:
```typescript
interface AuthContextType {
  user: User | null;           // Current user object
  session: Session | null;     // Current Supabase session
  isLoading: boolean;          // Auth state loading flag
  signIn: (email, password) => Promise<void>;
  signUp: (email, password, fullName) => Promise<void>;
  signOut: () => Promise<void>;
}
```

### Protected Route Component
Located at `src/components/ProtectedRoute.tsx`, this component wraps all authenticated routes to ensure only logged-in users can access them.

### How JWT Works:
1. User logs in → Supabase issues a JWT token
2. Token is stored in localStorage and sent with every API request
3. Tokens are automatically refreshed before expiration
4. On logout, tokens are cleared from storage

## 🎨 Theme Customization

The application features a custom **ocean-inspired dark theme** with blue-centric colors, defined in `src/index.css` using Tailwind CSS's CSS variable system.

### Current Theme Colors
| Purpose    | Hex       | RGB              | HSL               | Description                              |
|------------|-----------|------------------|-------------------|------------------------------------------|
| Text       | `#ecf1f3` | rgb(236, 241, 243)| hsl(197, 23%, 94%)| Primary text color for readability        |
| Background | `#091114` | rgb(9, 17, 20)   | hsl(196, 38%, 6%) | Main page background (deep dark blue)    |
| Primary    | `#98c9de` | rgb(152, 201, 222)| hsl(198, 51%, 73%)| Primary brand color for buttons/actions  |
| Secondary  | `#1a6382` | rgb(26, 99, 130) | hsl(198, 67%, 31%)| Secondary color for cards and borders    |
| Accent     | `#22ade7` | rgb(34, 173, 231)| hsl(198, 80%, 52%)| Bright accent color for interactive elements |

### Modifying the Theme
To change the theme colors, edit the CSS variables in the `.dark` selector in `src/index.css`:

```css
.dark {
  --background: oklch(0.086 0.020 196); /* Your background hex converted to oklch */
  --foreground: oklch(0.943 0.013 197); /* Text color */
  --primary: oklch(0.801 0.052 198);    /* Primary color */
  --secondary: oklch(0.425 0.080 198);  /* Secondary color */
  --accent: oklch(0.730 0.140 198);     /* Accent color */
}
```

### Theme Structure
All components use Tailwind's semantic color classes:
- `bg-background` → Page background
- `text-foreground` → Main text color
- `bg-primary` → Primary button backgrounds
- `bg-accent` → Accent elements and highlights
- `border-border` → Border colors

This structure makes it easy to update the entire app's theme by changing only the CSS variables.

## 🚀 Getting Started

### Prerequisites
- Node.js ≥ 18
- pnpm / yarn / npm

### Installation & Setup

1. **Clone the repo & install dependencies**
```bash
# Clone the repo
git clone https://github.com/yourusername/smart-expenses-manager.git
cd smart-expenses-manager

# Install dependencies
npm install
```

2. **Set up Supabase (required for authentication & database)**
- Create a project at https://supabase.com
- Copy your project URL and anon key from Settings → API
- Create a `.env.local` file in the root:
```env
VITE_SUPABASE_URL="https://your-project-ref.supabase.co"
VITE_SUPABASE_ANON_KEY="your-anon-key-here"
```
- Run the SQL schema from `supabase-schema.sql` in your Supabase SQL Editor
- Add `http://localhost:5173` to Supabase → Settings → API → Allowed origins (CORS)

3. **Start development server**
```bash
npm run dev



## 📁 Current Project Structure
```
Smart Expense Manager/
├─ components.json                 # shadcn/ui configuration
├─ eslint.config.js                # ESLint configuration
├─ index.html                      # Entry HTML file
├─ package.json                    # Dependencies & scripts
├─ package-lock.json               # Lockfile
├─ postcss.config.js               # PostCSS configuration
├─ tailwind.config.js              # Tailwind CSS configuration
├─ tsconfig.app.json               # App TypeScript config
├─ tsconfig.json                   # Root TypeScript config (fixed deprecations)
├─ tsconfig.node.json              # Node TypeScript config
├─ vite.config.ts                  # Vite build configuration
├─ README.md                       # Project documentation
├─ .env.local                      # Environment variables (Supabase credentials)
├─ .gitignore
├─ supabase-schema.sql             # Full PostgreSQL database schema
├─ public/
│  └─ vite.svg
└─ src/
   ├─ App.tsx                      # Main app component with routing & AuthProvider
   ├─ index.css                    # Global styles & theme configuration
   ├─ main.tsx                     # React DOM entry point
   ├─ contexts/
   │  └─ AuthContext.tsx           # Global auth state management (JWT)
   ├─ assets/                      # Static assets (images, fonts)
   ├─ components/
   │  ├─ ShapeLandingHero.tsx      # Animated landing page hero
   │  └─ ProtectedRoute.tsx        # Route protection for authenticated pages
   ├─ lib/
   │  ├─ utils.ts                  # Utility functions (including clsx/tailwind-merge)
   │  └─ supabase.ts               # Supabase client configuration
   ├─ services/
   │  ├─ auth.ts                   # Authentication service (login/logout)
   │  └─ expenses.ts               # Expenses CRUD service
   └─ pages/
      ├─ LandingPage.tsx           # Main landing page
      ├─ Login.tsx                 # Full functional login page
      ├─ Signup.tsx                # Full functional signup page
      ├─ Dashboard.tsx             # Main dashboard page
      ├─ Transactions.tsx          # Transactions management page
      ├─ Income.tsx                # Income tracking page
      ├─ Budgets.tsx               # Budget management page
      ├─ Account.tsx               # User account & profile page
      └─ Settings.tsx              # Application settings page
```

## 🎯 Next Steps for Development
✅ **Completed:**
1. **JWT Authentication System** - AuthContext, protected routes, full login/signup flow
2. **Main dashboard layout** - Core application shell with all page routes
3. **Custom theme implementation** - Ocean-inspired dark theme with Tailwind CSS

📋 **Remaining Development Tasks:**
1. **Implement expense data models** - Define TypeScript interfaces for expenses, categories, and users
2. **Add advanced state management** - Integrate Zustand for global state management
3. **Build CRUD operations** - Create the ability to add, edit, and delete expenses
4. **Implement basic charts** - Add Recharts to visualize spending patterns
5. **Add budget tracking features** - Create budget creation and monitoring system
6. **Mobile responsiveness polish** - Ensure all features work well on mobile devices