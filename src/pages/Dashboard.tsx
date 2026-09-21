// src/pages/Dashboard.tsx
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Wallet,
  TrendingUp,
  Receipt,
  PieChart,
  Menu,
  Plus,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  Bell,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import AppLayout, { MobileMenuButton } from "../components/AppLayout";
import { useCurrency } from "../hooks/useCurrency";

interface Transaction {
  id: string;
  description: string;
  category: string;
  category_color: string;
  amount: number;
  date: string;
}

interface CategoryStat {
  name: string;
  spent: number;
  budget: number;
  color: string;
}

interface UpcomingIncome {
  id: string;
  description: string;
  amount: number;
  date: string;
  is_monthly: boolean;
}

export default function DashboardPage() {
  const navigate = useNavigate();
  const [recentTransactions, setRecentTransactions] = useState<Transaction[]>(
    [],
  );
  const [categoryStats, setCategoryStats] = useState<CategoryStat[]>([]);
  const [totalBalance, setTotalBalance] = useState(0);
  const [monthlyRegularIncome, setMonthlyRegularIncome] = useState(0);
  const [oneTimeIncomeThisMonth, setOneTimeIncomeThisMonth] = useState(0);
  const [monthlyExpenses, setMonthlyExpenses] = useState(0);
  const [upcomingIncome, setUpcomingIncome] = useState<UpcomingIncome[]>([]);
  const [totalUpcomingIncome, setTotalUpcomingIncome] = useState(0);

  const totalMonthlyIncome = monthlyRegularIncome + oneTimeIncomeThisMonth;
  const monthlyBudget = totalMonthlyIncome - monthlyExpenses;

  // State for notifications
  const [notifications, setNotifications] = useState<{id: string, message: string, read: boolean, date: string}[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const unreadCount = notifications.filter(n => !n.read).length;

  const { formatCurrency } = useCurrency();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {}); // Optional auth state listener

    const fetchData = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        navigate("/login");
        return;
      }

      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
        .toISOString()
        .split("T")[0];

      // Run both queries in parallel to reduce loading time
      const [expensesResult, categoriesResult] = await Promise.all([
        // Fetch all expenses first
        supabase
          .from("expenses")
          .select("*")
          .eq("user_id", user.id)
          .order("date", { ascending: false }),
        
        // Fetch categories in parallel
        supabase
          .from("categories")
          .select("*")
          .eq("user_id", user.id)
      ]);

      const { data: allExpenses } = expensesResult;
      const { data: cats } = categoriesResult;
      const expenses = allExpenses || [];

      // Calculate current balance: only include NON-PENDING transactions (exclude income you haven't received yet)
      const balance = expenses
        .filter((e) => !e.is_pending) // Only include transactions you've actually received/paid
        .reduce((sum, e) => sum + e.amount, 0);
      const thisMonthExpenses = expenses.filter((e) => e.date >= startOfMonth);

      // Calculate separate income metrics
      const allIncomeThisMonth = thisMonthExpenses.filter(
        (e) => e.amount > 0 && !e.is_pending,
      );
      const monthlyRegular = allIncomeThisMonth
        .filter((e) => e.is_monthly)
        .reduce((sum, e) => sum + e.amount, 0);
      const oneTime = allIncomeThisMonth
        .filter((e) => !e.is_monthly)
        .reduce((sum, e) => sum + e.amount, 0);
      const spent = thisMonthExpenses
        .filter((e) => e.amount < 0)
        .reduce((sum, e) => sum + Math.abs(e.amount), 0);

      // Get upcoming/pending income
      const pending = expenses.filter((e) => e.is_pending && e.amount > 0);
      const upcomingTotal = pending.reduce((sum, e) => sum + e.amount, 0);

      setTotalBalance(balance);
      setMonthlyRegularIncome(monthlyRegular);
      setOneTimeIncomeThisMonth(oneTime);
      setMonthlyExpenses(spent);
      setUpcomingIncome(pending.slice(0, 5) as UpcomingIncome[]); // Show 5 most recent upcoming
      setTotalUpcomingIncome(upcomingTotal);

      setRecentTransactions(expenses.slice(0, 5) as Transaction[]);

      const stats = (cats || [])
        .map((cat) => {
          const catExpenses = expenses.filter(
            (e) => e.category === cat.name && e.amount < 0,
          );
          const catSpent = catExpenses.reduce(
            (sum, e) => sum + Math.abs(e.amount),
            0,
          );
          return {
            name: cat.name,
            spent: catSpent,
            budget: cat.budget || 0,
            color: cat.color,
          };
        })
        .filter((c) => c.budget > 0);

      setCategoryStats(stats);

      // Check for budget alerts to create notifications
      const budgetAlerts: {id: string, message: string, read: boolean, date: string}[] = [];
      stats.forEach(cat => {
        if (cat.budget > 0 && cat.spent >= cat.budget * 0.8) {
          const percentage = Math.round((cat.spent / cat.budget) * 100);
          budgetAlerts.push({
            id: `budget-${cat.name}-${Date.now()}`,
            message: `${cat.name} budget is ${percentage}% used!`,
            read: false,
            date: new Date().toISOString()
          });
        }
      });
      
      // Add pending income notifications
      if (pending.length > 0) {
        budgetAlerts.push({
          id: `pending-${Date.now()}`,
          message: `You have ${pending.length} pending income(s) totaling ${formatCurrency(upcomingTotal)}`,
          read: false,
          date: new Date().toISOString()
        });
      }
      
      // Only update notifications if there are new ones
      if (budgetAlerts.length > 0) {
        setNotifications(prev => {
          // Avoid adding duplicate notifications
          const existingIds = new Set(prev.map(n => n.id));
          const newAlerts = budgetAlerts.filter(a => !existingIds.has(a.id));
          return [...newAlerts, ...prev];
        });
      }
    };

    // ---- Realtime subscription: created ONCE, outside fetchData ----
    let channel: ReturnType<typeof supabase.channel> | null = null;

    const setupChannel = async () => {
      if (channel) return;

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const channelName = `dashboard-changes-${user.id}`;

      // ---- THE CRITICAL FIX: Remove any stale channels from the client registry ----
      // supabase.channel(name) returns the EXISTING channel if one is registered,
      // which is why .on() was failing - it was hitting an already-subscribed channel
      const staleChannels = supabase
        .getChannels()
        .filter((c) => c.topic === `realtime:${channelName}`);
      for (const c of staleChannels) {
        await supabase.removeChannel(c);
      }
      // -----------------------------------------------------------------------------

      // Create a fresh channel after cleaning up any stale ones
      const newChannel = supabase.channel(channelName);

      // Add ALL listeners before subscribing
      newChannel
        .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'expenses', filter: `user_id=eq.${user.id}` }, (payload) => {
          const e = payload.new as { amount: number; description: string; category: string };
          const isIncome = e.category === 'Income' || e.amount > 0;
          setNotifications(prev => [{ id: `new-${isIncome ? 'income' : 'expense'}-${Date.now()}`, message: isIncome ? `New income added: ${e.description}` : `New expense added: ${e.description}`, read: false, date: new Date().toISOString() }, ...prev]);
          void fetchData();
        })
        .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'expenses', filter: `user_id=eq.${user.id}` }, (payload) => {
          const e = payload.new as { description: string; category: string; amount: number };
          const isIncome = e.category === 'Income' || e.amount > 0;
          setNotifications(prev => [{ id: `update-${isIncome ? 'income' : 'expense'}-${Date.now()}`, message: isIncome ? `Income updated: ${e.description}` : `Transaction updated: ${e.description}`, read: false, date: new Date().toISOString() }, ...prev]);
          void fetchData();
        })
        .on('postgres_changes', { event: 'DELETE', schema: 'public', table: 'expenses', filter: `user_id=eq.${user.id}` }, (payload) => {
          const e = payload.old as { description: string; category: string; amount: number };
          const isIncome = e.category === 'Income' || e.amount > 0;
          setNotifications(prev => [{ id: `delete-${isIncome ? 'income' : 'expense'}-${Date.now()}`, message: isIncome ? `Income deleted: ${e.description}` : `Transaction deleted: ${e.description}`, read: false, date: new Date().toISOString() }, ...prev]);
          void fetchData();
        })
        .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'categories', filter: `user_id=eq.${user.id}` }, (payload) => {
          const c = payload.new as { name: string; budget: number };
          setNotifications(prev => [{ id: `new-budget-${Date.now()}`, message: `New budget created: ${c.name}`, read: false, date: new Date().toISOString() }, ...prev]);
          void fetchData();
        })
        .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'categories', filter: `user_id=eq.${user.id}` }, (payload) => {
          const c = payload.new as { name: string };
          setNotifications(prev => [{ id: `update-budget-${Date.now()}`, message: `Budget updated: ${c.name}`, read: false, date: new Date().toISOString() }, ...prev]);
          void fetchData();
        })
        .on('postgres_changes', { event: 'DELETE', schema: 'public', table: 'categories', filter: `user_id=eq.${user.id}` }, (payload) => {
          const c = payload.old as { name: string };
          setNotifications(prev => [{ id: `delete-budget-${Date.now()}`, message: `Budget deleted: ${c.name}`, read: false, date: new Date().toISOString() }, ...prev]);
          void fetchData();
        });

      // Subscribe only after all listeners are added
      newChannel.subscribe();
      channel = newChannel;
    };

    void fetchData();
    void setupChannel();

    return () => {
      if (channel) {
        supabase.removeChannel(channel); // use removeChannel, not unsubscribe
      }
      subscription.unsubscribe(); // Clean up auth state listener
    };
  }, [navigate]);

  // Mark notification as read
  const markAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => 
      n.id === id ? {...n, read: true} : n
    ));
  };

  // Mark all as read
  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({...n, read: true})));
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
    <AppLayout>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Dashboard Content */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden">
          {/* Mobile Header */}
          <div className="lg:hidden sticky top-0 z-40 bg-[#0f172a]/95 backdrop-blur-lg border-b border-[#4b5563] p-4 flex items-center justify-between">
            <h1 className="text-xl font-bold text-[#f8fafc]">FinanceHub</h1>
            <MobileMenuButton
              toggle
              className="p-2.5 rounded-xl hover:bg-[#334155] transition-colors duration-200"
            >
              <Menu className="w-6 h-6 text-[#e2e8f0]" />
            </MobileMenuButton>
          </div>

          {/* Desktop Header */}
          <div className="hidden lg:flex sticky top-0 z-30 bg-[#0f172a]/90 backdrop-blur-sm px-8 py-4 border-b border-[#4b5563]/50 -mx-4 mt-0 mb-6 pb-4">
            <div>
              <h2 className="text-2xl font-bold text-[#f8fafc]">
                Dashboard Overview
              </h2>
              <p className="text-sm text-[#94a3b8] mt-1">
                Track your finances, expenses, and savings all in one place
              </p>
            </div>
            <div className="ml-auto flex items-center gap-4">
              <button
                onClick={() => navigate("/transactions")}
                className="hidden sm:flex items-center gap-2 px-5 py-2.5 bg-[#818cf8] hover:bg-[#818cf8]/90 text-[#0f172a] rounded-xl font-semibold transition-all duration-200 shadow-lg shadow-[#818cf8]/25 hover:scale-[1.02] active:scale-[0.98]"
              >
                <Plus className="w-4 h-4" />
                Add Transaction
              </button>
              <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-[#1e293b] rounded-xl border border-[#4b5563]">
                <Calendar className="w-4 h-4 text-[#94a3b8]" />
                <span className="text-sm text-[#e2e8f0]">
                  {new Date().toLocaleDateString("en-PH", {
                    month: "long",
                    year: "numeric",
                  })}
                </span>
              </div>
              {/* Notification Bell with Dropdown */}
              <div className="relative">
                <button 
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="relative p-2.5 bg-[#1e293b] rounded-xl border border-[#4b5563] hover:bg-[#334155] transition-colors"
                >
                  <Bell className="w-5 h-5 text-[#e2e8f0]" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#ef4444] text-white text-xs flex items-center justify-center rounded-full">
                      {unreadCount}
                    </span>
                  )}
                </button>
                
                {/* Notification Dropdown */}
                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-80 bg-[#1e293b] border border-[#4b5563] rounded-xl shadow-2xl z-50 overflow-hidden">
                    <div className="p-4 border-b border-[#4b5563] flex items-center justify-between">
                      <h3 className="font-semibold text-white">Notifications</h3>
                      {unreadCount > 0 && (
                        <button 
                          onClick={markAllAsRead}
                          className="text-xs text-[#818cf8] hover:text-[#6366f1]"
                        >
                          Mark all read
                        </button>
                      )}
                    </div>
                    <div className="max-h-80 overflow-y-auto">
                      {notifications.length === 0 ? (
                        <div className="p-4 text-center text-gray-400">
                          No new notifications
                        </div>
                      ) : (
                        notifications.map((notification) => (
                          <div 
                            key={notification.id}
                            onClick={() => markAsRead(notification.id)}
                            className={`p-4 border-b border-[#334155] hover:bg-[#334155] cursor-pointer transition-colors ${
                              !notification.read ? 'bg-[#273449]' : ''
                            }`}
                          >
                            <div className="flex items-start gap-3">
                              {!notification.read && (
                                <span className="w-2 h-2 bg-[#818cf8] rounded-full mt-1.5 shrink-0"></span>
                              )}
                              <div className="flex-1">
                                <p className={`text-sm ${notification.read ? 'text-gray-400' : 'text-white'}`}>
                                  {notification.message}
                                </p>
                                <p className="text-xs text-gray-500 mt-1">
                                  {new Date(notification.date).toLocaleString()}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="p-4 md:p-6 lg:px-8 lg:pb-8">
            {/* Stats Cards - 8px grid spacing, perfect alignment */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-8 w-full max-w-full">
              {/* Current Balance - Primary metric */}
              <motion.div
                custom={0}
                variants={fadeInVariants}
                initial="hidden"
                animate="visible"
                className="sm:col-span-2 lg:col-span-1 bg-linear-to-br from-[#818cf8] to-[#6366f1] backdrop-blur-lg rounded-2xl border border-[#818cf8]/30 p-5 md:p-6 shadow-xl hover:shadow-2xl transition-shadow duration-300"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="w-11 h-11 bg-white/20 rounded-xl flex items-center justify-center">
                    <Wallet className="w-5 h-5 text-white" />
                  </div>
                  <span className="flex items-center gap-1 text-xs font-semibold text-white bg-white/20 px-2.5 py-1 rounded-lg">
                    <ArrowUpRight className="w-3 h-3" />
                    Available Now
                  </span>
                </div>
                <h3 className="text-xs md:text-sm font-medium text-white/80 uppercase tracking-wide mb-1.5">
                  Current Balance
                </h3>
                <p className="text-xl md:text-2xl lg:text-3xl font-bold text-white leading-tight">
                  {formatCurrency(totalBalance)}
                </p>
              </motion.div>

              {/* Total Earned This Month */}
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
                  <span className="px-2.5 py-1 text-xs font-semibold text-green-400 bg-green-500/20 rounded-lg">
                    Earned
                  </span>
                </div>
                <h3 className="text-xs md:text-sm font-medium text-[#94a3b8] uppercase tracking-wide mb-1.5">
                  Earned This Month
                </h3>
                <p className="text-xl md:text-2xl lg:text-3xl font-bold text-[#f8fafc] leading-tight">
                  {formatCurrency(
                    monthlyRegularIncome + oneTimeIncomeThisMonth,
                  )}
                </p>
              </motion.div>

              {/* Monthly Expenses */}
              <motion.div
                custom={3}
                variants={fadeInVariants}
                initial="hidden"
                animate="visible"
                className="bg-[#1e293b] backdrop-blur-lg rounded-2xl border border-[#4b5563] p-5 md:p-6 shadow-xl hover:shadow-2xl transition-shadow duration-300"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="w-11 h-11 bg-[#ef4444]/20 rounded-xl flex items-center justify-center">
                    <ArrowDownRight className="w-5 h-5 text-[#ef4444]" />
                  </div>
                  <span className="flex items-center gap-1 text-xs font-semibold text-[#ef4444] bg-[#ef4444]/10 px-2.5 py-1 rounded-lg">
                    <ArrowDownRight className="w-3 h-3" />
                    Spent
                  </span>
                </div>
                <h3 className="text-xs md:text-sm font-medium text-[#94a3b8] uppercase tracking-wide mb-1.5">
                  Monthly Expenses
                </h3>
                <p className="text-xl md:text-2xl lg:text-3xl font-bold text-[#f8fafc] leading-tight">
                  {formatCurrency(monthlyExpenses)}
                </p>
              </motion.div>

              {/* Monthly Budget */}
              <motion.div
                custom={4}
                variants={fadeInVariants}
                initial="hidden"
                animate="visible"
                className="sm:col-span-2 lg:col-span-1 bg-[#1e293b] backdrop-blur-lg rounded-2xl border border-[#4b5563] p-5 md:p-6 shadow-xl hover:shadow-2xl transition-shadow duration-300"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="w-11 h-11 bg-[#a855f7]/20 rounded-xl flex items-center justify-center">
                    <PieChart className="w-5 h-5 text-[#a855f7]" />
                  </div>
                  <span
                    className={`flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-lg ${monthlyBudget >= 0 ? "text-[#22c55e] bg-[#22c55e]/10" : "text-[#ef4444] bg-[#ef4444]/10"}`}
                  >
                    {monthlyBudget >= 0 ? (
                      <ArrowUpRight className="w-3 h-3" />
                    ) : (
                      <ArrowDownRight className="w-3 h-3" />
                    )}
                    Forecast
                  </span>
                </div>
                <h3 className="text-xs md:text-sm font-medium text-[#94a3b8] uppercase tracking-wide mb-1.5">
                  Monthly Budget
                </h3>
                <p
                  className={`text-xl md:text-2xl lg:text-3xl font-bold leading-tight ${monthlyBudget >= 0 ? "text-green-400" : "text-red-400"}`}
                >
                  {formatCurrency(monthlyBudget)}
                </p>
              </motion.div>
            </div>

            {/* Upcoming Income Section */}
            {upcomingIncome.length > 0 && (
              <motion.div
                custom={5}
                variants={fadeInVariants}
                initial="hidden"
                animate="visible"
                className="mb-6 md:mb-8 bg-[#1e293b] backdrop-blur-lg rounded-2xl border border-[#4b5563] p-5 md:p-6 shadow-xl hover:shadow-2xl transition-shadow duration-300"
              >
                <div className="flex items-center justify-between mb-5 md:mb-6">
                  <h3 className="text-base md:text-lg font-semibold text-[#f8fafc]">
                    📅 Upcoming Income
                  </h3>
                  <button
                    onClick={() => navigate("/income")}
                    className="text-xs md:text-sm text-[#818cf8] hover:text-[#818cf8]/80 font-semibold transition-colors px-3 py-1.5 rounded-lg hover:bg-[#818cf8]/10"
                  >
                    View All Income
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {upcomingIncome.map((income) => (
                    <div
                      key={income.id}
                      className="p-4 bg-[#0f172a]/50 rounded-xl border border-[#4b5563]/50"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <p className="font-medium text-[#f8fafc] text-sm">
                          {income.description}
                        </p>
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${income.is_monthly ? "bg-amber-500/20 text-amber-400" : "bg-gray-500/20 text-gray-400"}`}
                        >
                          {income.is_monthly ? "Monthly" : "One-time"}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <p className="text-xs text-[#94a3b8]">
                          Expected: {new Date(income.date).toLocaleDateString()}
                        </p>
                        <p className="text-sm font-bold text-blue-400">
                          {formatCurrency(income.amount)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 pt-4 border-t border-[#4b5563]">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-[#94a3b8]">
                      Total Expected This Month
                    </span>
                    <span className="text-lg font-bold text-blue-400">
                      {formatCurrency(totalUpcomingIncome)}
                    </span>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Main Grid - Recent Transactions & Budget Progress - Proper responsive columns */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 md:gap-6 w-full max-w-full">
              {/* Recent Transactions - Takes 2/3 of space on large screens */}
              <motion.div
                custom={6}
                variants={fadeInVariants}
                initial="hidden"
                animate="visible"
                className="xl:col-span-2 bg-[#1e293b] backdrop-blur-lg rounded-2xl border border-[#4b5563] p-5 md:p-6 shadow-xl hover:shadow-2xl transition-shadow duration-300"
              >
                <div className="flex items-center justify-between mb-5 md:mb-6">
                  <h3 className="text-base md:text-lg font-semibold text-[#f8fafc]">
                    Recent Transactions
                  </h3>
                  <button
                    onClick={() => navigate("/transactions")}
                    className="text-xs md:text-sm text-[#818cf8] hover:text-[#818cf8]/80 font-semibold transition-colors px-3 py-1.5 rounded-lg hover:bg-[#818cf8]/10"
                  >
                    View All
                  </button>
                </div>
                <div className="space-y-3">
                  {recentTransactions.length === 0 ? (
                    <div className="text-center py-8 text-[#94a3b8]">
                      <Receipt className="w-10 h-10 mx-auto mb-3 opacity-40" />
                      <p className="text-sm">
                        No transactions yet.{" "}
                        <button
                          onClick={() => navigate("/transactions")}
                          className="text-[#818cf8] hover:underline"
                        >
                          Add one
                        </button>
                      </p>
                    </div>
                  ) : (
                    recentTransactions.map((transaction) => (
                      <div
                        key={transaction.id}
                        className="flex items-center justify-between p-3 md:p-4 bg-[#0f172a]/50 rounded-xl hover:bg-[#0f172a]/70 transition-all duration-200 border border-transparent hover:border-[#4b5563]/50"
                      >
                        <div className="flex items-center gap-3 md:gap-4 min-w-0">
                          <div
                            className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0
                          ${transaction.amount > 0 ? "bg-[#22c55e]/20" : "bg-[#ef4444]/20"}`}
                          >
                            <Receipt
                              className={`w-4.5 h-4.5 ${transaction.amount > 0 ? "text-[#22c55e]" : "text-[#ef4444]"}`}
                            />
                          </div>
                          <div className="min-w-0">
                            <p className="font-medium text-[#f8fafc] truncate text-sm md:text-base">
                              {transaction.description}
                            </p>
                            <p className="text-xs md:text-sm text-[#94a3b8] mt-0.5">
                              {transaction.category} • {transaction.date}
                            </p>
                          </div>
                        </div>
                        <p
                          className={`font-bold text-sm md:text-base whitespace-nowrap ml-4 ${transaction.amount > 0 ? "text-[#22c55e]" : "text-[#ef4444]"}`}
                        >
                          {transaction.amount > 0 ? "+" : ""}
                          {formatCurrency(transaction.amount)}
                        </p>
                      </div>
                    ))
                  )}
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
                  <h3 className="text-base md:text-lg font-semibold text-[#f8fafc]">
                    Budget Progress
                  </h3>
                  <button
                    onClick={() => navigate("/budgets")}
                    className="text-xs md:text-sm text-[#818cf8] hover:text-[#818cf8]/80 font-semibold transition-colors px-3 py-1.5 rounded-lg hover:bg-[#818cf8]/10"
                  >
                    Edit
                  </button>
                </div>
                <div className="space-y-5 md:space-y-6">
                  {categoryStats.length === 0 ? (
                    <p className="text-sm text-[#94a3b8] text-center py-4">
                      No budget categories set.{" "}
                      <button
                        onClick={() => navigate("/budgets")}
                        className="text-[#818cf8] hover:underline"
                      >
                        Add budgets
                      </button>
                    </p>
                  ) : (
                    categoryStats.map((category) => {
                      const percentage = Math.min(
                        (category.spent / category.budget) * 100,
                        100,
                      );
                      const isOverBudget = percentage > 90;
                      return (
                        <div key={category.name}>
                          <div className="flex items-center justify-between mb-2.5">
                            <span className="text-sm font-medium text-[#f8fafc]">
                              {category.name}
                            </span>
                            <span
                              className={`text-xs font-medium ${isOverBudget ? "text-[#ef4444]" : "text-[#94a3b8]"}`}
                            >
                              {formatCurrency(category.spent)} /{" "}
                              {formatCurrency(category.budget)}
                            </span>
                          </div>
                          <div className="w-full h-2.5 bg-[#0f172a] rounded-full overflow-hidden">
                            <div
                              className="h-full rounded-full transition-all duration-700 ease-out"
                              style={{
                                width: `${percentage}%`,
                                backgroundColor: isOverBudget
                                  ? "#ef4444"
                                  : category.color,
                              }}
                            />
                          </div>
                          <p className="text-right text-xs mt-1 text-[#64748b]">
                            {percentage.toFixed(0)}% used
                          </p>
                        </div>
                      );
                    })
                  )}
                </div>
              </motion.div>
            </div>
          </div>
        </main>
      </div>
    </AppLayout>
  );
}