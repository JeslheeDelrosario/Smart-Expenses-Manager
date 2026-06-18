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
   ├─ App.tsx                      # Main app component with routing
   ├─ index.css                    # Global styles
   ├─ main.tsx                     # React DOM entry point
   ├─ assets/                      # Static assets (images, fonts)
   ├─ components/
   │  └─ ShapeLandingHero.tsx      # Animated landing page hero
   ├─ lib/
   │  ├─ utils.ts                  # Utility functions (including clsx/tailwind-merge)
   │  └─ supabase.ts               # Supabase client configuration
   ├─ services/
   │  ├─ auth.ts                   # Authentication service (login/logout)
   │  └─ expenses.ts               # Expenses CRUD service
   └─ pages/
      ├─ LandingPage.tsx           # Main landing page
      ├─ Login.tsx                 # Full functional login page
      └─ Signup.tsx                # Full functional signup page
```

## 🎯 Next Steps for Development
1. **Build out authentication components** - Complete login and signup forms with validation
2. **Create main dashboard layout** - Set up the core application shell for logged-in users
3. **Implement expense data models** - Define TypeScript interfaces for expenses, categories, and users
4. **Add state management** - Integrate Zustand for global state management
5. **Build CRUD operations** - Create the ability to add, edit, and delete expenses
6. **Implement basic charts** - Add Recharts to visualize spending patterns