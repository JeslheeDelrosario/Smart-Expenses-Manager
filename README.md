# Smart Expenses Manager

**A modern, smart personal expense tracker built to help you understand, control, and optimize your spending habits.**

<img width="1910" height="915" alt="image" src="https://github.com/user-attachments/assets/5aa672a3-26a1-40c8-956f-14a35fd79608" />


## 🎯 Project Goal & Vision

The main goal of **Smart Expenses Manager** is to create an **intuitive, powerful, and insightful** personal finance tool that goes beyond simple expense logging.

Most expense trackers only record what you spent.  
**Smart Expenses Manager** aims to help you answer:

- Where is my money really going?
- Am I staying within my budget?
- What patterns can I change to save more?
- How close am I to my financial goals?

It combines clean UX, powerful categorization, visual analytics, and (future) smart insights — all built with **React + TypeScript** for a fast, type-safe, and maintainable codebase.

## ✨ Key Features (Current & Planned)

### Current / In Progress
- Add, edit, and delete expenses quickly
- Categorize expenses (Food, Transport, Bills, Entertainment, etc.)
- Support for income entries (to calculate real balance)
- Dashboard with:
  - Total balance
  - Total expenses/income
  - Expense breakdown by category (pie chart)
  - Recent transactions list
- Monthly / weekly summary views
- Responsive design (mobile + desktop friendly)
- Data persistence (localStorage for now – future: backend / cloud)

### Planned / Upcoming (Smart Features)
- Monthly budgets per category with progress bars & alerts
- Visual charts & trends (line chart for spending over time)
- Smart categorization suggestions (rule-based or future AI)
- Export data (CSV / PDF)
- Dark / Light theme toggle
- Multi-currency support
- Cloud sync & user accounts (Firebase / Supabase / custom backend)
- Receipt photo upload + OCR parsing (optional advanced feature)

## 🛠️ Tech Stack

| Area            | Technology                          | Purpose                              |
|-----------------|-------------------------------------|--------------------------------------|
| Frontend        | React 18+                           | UI library                           |
| Language        | TypeScript                          | Type safety & better DX              |
| Styling         | Tailwind CSS / CSS Modules / styled-components | (choose your preference)     |
| State Management| Zustand / Redux Toolkit / Context   | (choose based on complexity)         |
| Charts          | Recharts / Chart.js                 | Beautiful & responsive visualizations|
| Forms           | React Hook Form + Zod               | Validation & performance             |
| Routing         | React Router v6                     | Navigation                           |
| Persistence     | localStorage (current)              | Quick MVP data saving                |
| Build Tool      | Vite                                | Fast dev server & builds             |
| Linting/Formatting | ESLint + Prettier                | Code quality                         |

## 🚀 Getting Started

### Prerequisites
- Node.js ≥ 18
- pnpm / yarn / npm

### Installation

```bash
# Clone the repo
git clone https://github.com/yourusername/smart-expenses-manager.git
cd smart-expenses-manager

# Install dependencies
pnpm install
# or
yarn install
# or
npm install

# Start development server
pnpm dev
# or
yarn dev
# or
npm run dev



## Project Structure ##
Smart Expense Manager/
├─ components.json
├─ eslint.config.js
├─ index.html
├─ package.json
├─ package-lock.json
├─ postcss.config.js
├─ tailwind.config.js
├─ tsconfig.app.json
├─ tsconfig.json
├─ tsconfig.node.json
├─ vite.config.ts
├─ README.md
├─ public/
│  └─ vite.svg
└─ src/
   ├─ App.tsx
   ├─ index.css
   ├─ main.tsx
   ├─ assests/
   ├─ components/
   │  └─ ShapeLandingHero.tsx
   ├─ features/
   ├─ lib/
   │  └─ utils.ts
   └─ pages/
      ├─ LandingPage.tsx
      └─ Login.tsx
      └─ Signup.tsx
