// src/pages/Dashboard.tsx
import { useState } from "react";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  Wallet,
  TrendingUp,
  Receipt,
  PieChart,
  Settings,
  Menu,
  Plus,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  CreditCard,
  Home,
  User,
  Calendar,
  Bell,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

// Mock data for dashboard
const mockTransactions = [
  { id: 1, name: "Puregold Grocery", category: "Food", amount: -2450.75, date: "2024-01-15" },
  { id: 2, name: "Monthly Salary", category: "Income", amount: 45000.00, date: "2024-01-14" },
  { id: 3, name: "Netflix Subscription", category: "Entertainment", amount: -299.00, date: "2024-01-13" },
  { id: 4, name: "Petron Gas Station", category: "Transport", amount: -1200.00, date: "2024-01-12" },
  { id: 5, name: "Meralco Bill", category: "Bills", amount: -3500.00, date: "2024-01-11" },
];

const mockCategories = [
  { name: "Food", spent: 12000, budget: 15000, color: "bg-[#f59e0b]" },
  { name: "Transport", spent: 5000, budget: 8000, color: "bg-[#8b5cf6]" },
  { name: "Entertainment", spent: 3500, budget: 5000, color: "bg-[#ec4899]" },
  { name: "Bills", spent: 8500, budget: 10000, color: "bg-[#3b82f6]" },
];

export default function DashboardPage() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeNav, setActiveNav] = useState("dashboard");

  // Calculate totals
  const totalBalance = 157550.25;
  const monthlyIncome = 45000.00;
  const monthlyExpenses = 29000.00;
  const savings = monthlyIncome - monthlyExpenses;

  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "transactions", label: "Transactions", icon: Receipt },
    { id: "budgets", label: "Budgets", icon: PieChart },
    { id: "accounts", label: "Accounts", icon: Wallet },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  const handleLogout = () => {
    navigate("/login");
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-PH", {
      style: "currency",
      currency: "PHP",
    }).format(amount);
  };

  const fadeInVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        delay: i * 0.1,
      },
    }),
  };

  return (
    <div className="min-h-screen bg-[#0f172a] flex">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-72 bg-[#1e293b] border-r border-[#4b5563] flex flex-col transform transition-transform duration-300 ease-in-out
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
      >
        {/* Sidebar Header */}
        <div className="p-6 border-b border-[#4b5563]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#818cf8] rounded-xl flex items-center justify-center shadow-lg shadow-[#818cf8]/25">
              <Wallet className="w-5 h-5 text-[#0f172a]" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-[#e2e8f0]">ExpenseTrack</h1>
              <p className="text-xs text-[#94a3b8]">Smart Expense Manager</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-2">
          <p className="text-[#64748b] text-xs font-semibold uppercase tracking-wider px-4 mb-2">Main Menu</p>
          <ul className="space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.id}>
                  <button
                    onClick={() => setActiveNav(item.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200
                      ${activeNav === item.id
                        ? "bg-[#818cf8] text-[#0f172a] shadow-lg shadow-[#818cf8]/25 scale-[1.02]"
                        : "text-[#94a3b8] hover:bg-[#334155] hover:text-[#e2e8f0]"}`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium text-sm">{item.label}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* User Profile */}
        <div className="p-4 border-t border-[#4b5563] mt-auto">
          <div className="bg-[#0f172a]/50 rounded-xl p-3.5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#818cf8] rounded-full flex items-center justify-center shadow-lg shadow-[#818cf8]/20">
                <User className="w-5 h-5 text-white" />
              </div>
              <div className="min-w-0">
                <p className="font-semibold text-[#f8fafc] text-sm truncate">John Doe</p>
                <p className="text-xs text-[#94a3b8]">Premium User</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="mt-3.5 w-full py-2.5 bg-[#ef4444]/10 text-[#ef4444] rounded-lg font-semibold hover:bg-[#ef4444]/20 transition-all duration-200 text-sm active:scale-[0.98]"
            >
              Logout
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Dashboard Content */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden">
          {/* Mobile Header */}
          <div className="lg:hidden sticky top-0 z-40 bg-[#0f172a]/95 backdrop-blur-lg border-b border-[#4b5563] p-4 flex items-center justify-between">
            <h1 className="text-xl font-bold text-[#f8fafc]">FinanceHub</h1>
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2.5 rounded-xl hover:bg-[#334155] transition-colors duration-200"
            >
              <Menu className="w-6 h-6 text-[#e2e8f0]" />
            </button>
          </div>

          {/* Desktop Header */}
          <div className="hidden lg:flex sticky top-0 z-30 bg-[#0f172a]/90 backdrop-blur-sm px-8 py-4 border-b border-[#4b5563]/50 -mx-4 mt-0 mb-6 pb-5">
                <div>
                <h2 className="text-2xl font-bold text-[#f8fafc]">Dashboard Overview</h2>
                <p className="text-sm text-[#94a3b8] mt-1">Track your finances, expenses, and savings all in one place</p>
                </div>
                <div className="ml-auto flex items-center gap-4">
                <button className="hidden sm:flex items-center gap-2 px-5 py-2.5 bg-[#818cf8] hover:bg-[#818cf8]/90 text-[#0f172a] rounded-xl font-semibold transition-all duration-200 shadow-lg shadow-[#818cf8]/25 hover:scale-[1.02] active:scale-[0.98]">
                    <Plus className="w-4 h-4" />
                    Add Transaction
                </button>
                <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-[#1e293b] rounded-xl border border-[#4b5563]">
                    <Calendar className="w-4 h-4 text-[#94a3b8]" />
                    <span className="text-sm text-[#e2e8f0]">January 2024</span>
                </div>
                <button className="relative p-2.5 bg-[#1e293b] rounded-xl border border-[#4b5563] hover:bg-[#334155] transition-colors">
                    <Bell className="w-5 h-5 text-[#e2e8f0]" />
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#ef4444] rounded-full"></span>
                </button>
                </div>
          </div>

          <div className="p-4 md:p-6 lg:px-8 lg:pb-8">
            {/* Stats Cards - 8px grid spacing, perfect alignment */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-8 w-full max-w-full">
              {/* Total Balance */}
              <motion.div
                custom={0}
                variants={fadeInVariants}
                initial="hidden"
                animate="visible"
                className="bg-[#1e293b] backdrop-blur-lg rounded-2xl border border-[#4b5563] p-5 md:p-6 shadow-xl hover:shadow-2xl transition-shadow duration-300"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="w-11 h-11 bg-[#818cf8]/20 rounded-xl flex items-center justify-center">
                    <DollarSign className="w-5 h-5 text-[#818cf8]" />
                  </div>
                  <span className="flex items-center gap-1 text-xs font-semibold text-[#22c55e] bg-[#22c55e]/10 px-2.5 py-1 rounded-lg">
                    <ArrowUpRight className="w-3 h-3" />
                    12.5%
                  </span>
                </div>
                <h3 className="text-xs md:text-sm font-medium text-[#94a3b8] uppercase tracking-wide mb-1.5">Total Balance</h3>
                <p className="text-xl md:text-2xl lg:text-3xl font-bold text-[#f8fafc] leading-tight">{formatCurrency(totalBalance)}</p>
              </motion.div>

              {/* Monthly Income */}
              <motion.div
                custom={1}
                variants={fadeInVariants}
                initial="hidden"
                animate="visible"
                className="bg-[#1e293b] backdrop-blur-lg rounded-2xl border border-[#4b5563] p-5 md:p-6 shadow-xl hover:shadow-2xl transition-shadow duration-300"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="w-11 h-11 bg-[#22c55e]/20 rounded-xl flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-[#22c55e]" />
                  </div>
                  <span className="flex items-center gap-1 text-xs font-semibold text-[#22c55e] bg-[#22c55e]/10 px-2.5 py-1 rounded-lg">
                    <ArrowUpRight className="w-3 h-3" />
                    8.2%
                  </span>
                </div>
                <h3 className="text-xs md:text-sm font-medium text-[#94a3b8] uppercase tracking-wide mb-1.5">Monthly Income</h3>
                <p className="text-xl md:text-2xl lg:text-3xl font-bold text-[#f8fafc] leading-tight">{formatCurrency(monthlyIncome)}</p>
              </motion.div>

              {/* Monthly Expenses */}
              <motion.div
                custom={2}
                variants={fadeInVariants}
                initial="hidden"
                animate="visible"
                className="bg-[#1e293b] backdrop-blur-lg rounded-2xl border border-[#4b5563] p-5 md:p-6 shadow-xl hover:shadow-2xl transition-shadow duration-300"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="w-11 h-11 bg-[#ef4444]/20 rounded-xl flex items-center justify-center">
                    <CreditCard className="w-5 h-5 text-[#ef4444]" />
                  </div>
                  <span className="flex items-center gap-1 text-xs font-semibold text-[#ef4444] bg-[#ef4444]/10 px-2.5 py-1 rounded-lg">
                    <ArrowDownRight className="w-3 h-3" />
                    3.1%
                  </span>
                </div>
                <h3 className="text-xs md:text-sm font-medium text-[#94a3b8] uppercase tracking-wide mb-1.5">Monthly Expenses</h3>
                <p className="text-xl md:text-2xl lg:text-3xl font-bold text-[#f8fafc] leading-tight">{formatCurrency(monthlyExpenses)}</p>
              </motion.div>

              {/* Savings */}
              <motion.div
                custom={3}
                variants={fadeInVariants}
                initial="hidden"
                animate="visible"
                className="bg-[#1e293b] backdrop-blur-lg rounded-2xl border border-[#4b5563] p-5 md:p-6 shadow-xl hover:shadow-2xl transition-shadow duration-300"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="w-11 h-11 bg-[#a855f7]/20 rounded-xl flex items-center justify-center">
                    <Home className="w-5 h-5 text-[#a855f7]" />
                  </div>
                  <span className="flex items-center gap-1 text-xs font-semibold text-[#22c55e] bg-[#22c55e]/10 px-2.5 py-1 rounded-lg">
                    <ArrowUpRight className="w-3 h-3" />
                    15.3%
                  </span>
                </div>
                <h3 className="text-xs md:text-sm font-medium text-[#94a3b8] uppercase tracking-wide mb-1.5">Net Savings</h3>
                <p className="text-xl md:text-2xl lg:text-3xl font-bold text-[#f8fafc] leading-tight">{formatCurrency(savings)}</p>
              </motion.div>
            </div>

            {/* Main Grid - Recent Transactions & Budget Progress - Proper responsive columns */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 md:gap-6 w-full max-w-full">
              {/* Recent Transactions - Takes 2/3 of space on large screens */}
              <motion.div
                custom={4}
                variants={fadeInVariants}
                initial="hidden"
                animate="visible"
                className="xl:col-span-2 bg-[#1e293b] backdrop-blur-lg rounded-2xl border border-[#4b5563] p-5 md:p-6 shadow-xl hover:shadow-2xl transition-shadow duration-300"
              >
                <div className="flex items-center justify-between mb-5 md:mb-6">
                  <h3 className="text-base md:text-lg font-semibold text-[#f8fafc]">Recent Transactions</h3>
                  <button className="text-xs md:text-sm text-[#818cf8] hover:text-[#818cf8]/80 font-semibold transition-colors px-3 py-1.5 rounded-lg hover:bg-[#818cf8]/10">
                    View All
                  </button>
                </div>
                <div className="space-y-3">
                  {mockTransactions.map((transaction) => (
                    <div
                      key={transaction.id}
                      className="flex items-center justify-between p-3 md:p-4 bg-[#0f172a]/50 rounded-xl hover:bg-[#0f172a]/70 transition-all duration-200 border border-transparent hover:border-[#4b5563]/50"
                    >
                      <div className="flex items-center gap-3 md:gap-4 min-w-0">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0
                          ${transaction.amount > 0 ? "bg-[#22c55e]/20" : "bg-[#ef4444]/20"}`}>
                          <Receipt className={`w-4.5 h-4.5 ${transaction.amount > 0 ? "text-[#22c55e]" : "text-[#ef4444]"}`} />
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium text-[#f8fafc] truncate text-sm md:text-base">{transaction.name}</p>
                          <p className="text-xs md:text-sm text-[#94a3b8] mt-0.5">{transaction.category} • {transaction.date}</p>
                        </div>
                      </div>
                      <p className={`font-bold text-sm md:text-base whitespace-nowrap ml-4 ${transaction.amount > 0 ? "text-[#22c55e]" : "text-[#ef4444]"}`}>
                        {transaction.amount > 0 ? "+" : ""}{formatCurrency(transaction.amount)}
                      </p>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Budget Progress - Takes 1/3 of space on large screens */}
              <motion.div
                custom={5}
                variants={fadeInVariants}
                initial="hidden"
                animate="visible"
                className="bg-[#1e293b] backdrop-blur-lg rounded-2xl border border-[#4b5563] p-5 md:p-6 shadow-xl hover:shadow-2xl transition-shadow duration-300"
              >
                <div className="flex items-center justify-between mb-5 md:mb-6">
                  <h3 className="text-base md:text-lg font-semibold text-[#f8fafc]">Budget Progress</h3>
                  <button className="text-xs md:text-sm text-[#818cf8] hover:text-[#818cf8]/80 font-semibold transition-colors px-3 py-1.5 rounded-lg hover:bg-[#818cf8]/10">
                    Edit
                  </button>
                </div>
                <div className="space-y-5 md:space-y-6">
                  {mockCategories.map((category) => {
                    const percentage = Math.min((category.spent / category.budget) * 100, 100);
                    const isOverBudget = percentage > 90;
                    return (
                      <div key={category.name}>
                        <div className="flex items-center justify-between mb-2.5">
                          <span className="text-sm font-medium text-[#f8fafc]">{category.name}</span>
                          <span className={`text-xs font-medium ${isOverBudget ? "text-[#ef4444]" : "text-[#94a3b8]"}`}>
                            {formatCurrency(category.spent)} / {formatCurrency(category.budget)}
                          </span>
                        </div>
                        <div className="w-full h-2.5 bg-[#0f172a] rounded-full overflow-hidden">
                          <div
                            className={`h-full ${isOverBudget ? "bg-[#ef4444]" : category.color} rounded-full transition-all duration-700 ease-out`}
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                        <p className="text-right text-xs mt-1 text-[#64748b]">{percentage.toFixed(0)}% used</p>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}