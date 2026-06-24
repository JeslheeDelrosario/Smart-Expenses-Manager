import { useState, useEffect } from "react";
import { Menu, Plus, ArrowUpRight, X, LayoutDashboard, Receipt, PieChart, Wallet, Settings, LogOut } from "lucide-react";
import { motion } from "framer-motion";
import { supabase } from "../lib/supabase";
import { useNavigate } from "react-router-dom";

// Interface for income entries (matches your expenses table structure)
interface Income {
  id: string;
  user_id: string;
  description: string;
  amount: number;
  date: string;
  category: string;
  category_color: string;
  is_monthly: boolean;
  is_pending: boolean;
}

export default function IncomePage() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeNav, setActiveNav] = useState("income");

  // State for our data
  const [receivedIncomes, setReceivedIncomes] = useState<Income[]>([]);
  const [pendingIncomes, setPendingIncomes] = useState<Income[]>([]);
  const [currentBalance, setCurrentBalance] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingIncome, setEditingIncome] = useState<Income | null>(null);

  // Logout function (matches all other pages)
  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };
  const [formData, setFormData] = useState({
    source: "",
    amount: "",
    date: new Date().toISOString().split("T")[0],
    is_monthly: false,
    is_pending: false,
  });

  // Currency formatter (matches all other pages)
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-PH", {
      style: "currency",
      currency: "PHP",
    }).format(amount);
  };

  // Navigation items (matches your sidebar on all other pages)
  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
    { id: "transactions", label: "Transactions", icon: Receipt, path: "/transactions" },
    { id: "budgets", label: "Budgets", icon: PieChart, path: "/budgets" },
    { id: "income", label: "Income", icon: ArrowUpRight, path: "/income" },
    { id: "account", label: "Account", icon: Wallet, path: "/account" },
    { id: "settings", label: "Settings", icon: Settings, path: "/settings" },
  ];

  // Reset form function
  const resetForm = () => {
    setFormData({
      source: "",
      amount: "",
      date: new Date().toISOString().split("T")[0],
      is_monthly: false,
      is_pending: false,
    });
  };

  // Handle amount input with automatic thousand separators
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^\d.]/g, '');
    const parts = value.split('.');
    if (parts.length > 2) return;
    if (parts[0]) {
      parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }
    const formattedValue = parts.join('.');
    setFormData(prev => ({ ...prev, amount: formattedValue }));
  };

  // Get raw numeric value from formatted amount
  const getRawAmount = (formattedAmount: string) => {
    return parseFloat(formattedAmount.replace(/,/g, ''));
  };

  // Fetch all income data from Supabase
  useEffect(() => {
    const fetchIncomeData = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          navigate("/login");
          return;
        }

        // Get all income entries (filtered by category = "Income")
        const { data: allIncome, error: incomeError } = await supabase
          .from("expenses")
          .select("*")
          .eq("user_id", user.id)
          .eq("category", "Income")
          .order("date", { ascending: false });

        if (incomeError) throw incomeError;
        
        // Separate pending and received income
        const pending = allIncome?.filter(item => item.is_pending === true) || [];
        const received = allIncome?.filter(item => item.is_pending === false) || [];
        
        setReceivedIncomes(received);
        setPendingIncomes(pending);

        // Calculate current balance from all transactions (only non-pending)
        const { data: allTransactions, error: balanceError } = await supabase
          .from("expenses")
          .select("amount, is_pending")
          .eq("user_id", user.id);

        if (balanceError) throw balanceError;
        const balance = allTransactions
          ?.filter(t => !t.is_pending) // Only include transactions you've actually received/paid
          .reduce((sum, t) => sum + t.amount, 0) || 0;
        setCurrentBalance(balance);

      } catch (error) {
        console.error("Error fetching income data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchIncomeData();
  }, [navigate]);

  // Mark pending income as received
  const markAsReceived = async (incomeId: string) => {
    try {
      const { error } = await supabase
        .from("expenses")
        .update({ is_pending: false })
        .eq("id", incomeId);

      if (error) throw error;
      window.location.reload();
    } catch (error) {
      console.error("Error marking income as received:", error);
      alert("Failed to update income status");
    }
  };

  // Handle edit income - populate form with existing data
  const handleEdit = (income: Income) => {
    setEditingIncome(income);
    setFormData({
      source: income.description,
      amount: income.amount.toLocaleString("en-PH", {
        minimumFractionDigits: 2,
      }),
      date: income.date,
      is_monthly: income.is_monthly || false,
      is_pending: income.is_pending || false,
    });
    setShowAddModal(true);
  };

  // Handle delete income
  const handleDelete = async (incomeId: string) => {
    if (!window.confirm("Are you sure you want to delete this income entry?")) {
      return;
    }
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate("/login");
        return;
      }

      const { error } = await supabase
        .from("expenses")
        .delete()
        .eq("id", incomeId)
        .eq("user_id", user.id);

      if (error) throw error;
      window.location.reload();
    } catch (error) {
      console.error("Error deleting income:", error);
      alert("Failed to delete income. Check console for details.");
    }
  };

  // Handle form submission for new or edited income
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate("/login");
        return;
      }

      // Validate form
      if (!formData.source.trim()) {
        alert("Please enter an income source");
        return;
      }
      const amount = getRawAmount(formData.amount);
      if (isNaN(amount) || amount <= 0) {
        alert("Please enter a valid amount");
        return;
      }

      if (editingIncome) {
          // Update existing income
          const { error } = await supabase
            .from("expenses")
            .update({
              description: formData.source,
              amount: amount,
              date: formData.date,
              is_monthly: formData.is_monthly,
              is_pending: formData.is_pending,
            })
            .eq("id", editingIncome.id)
            .eq("user_id", user.id);

          if (error) throw error;
        } else {
          // Insert new income
          const { error } = await supabase.from("expenses").insert({
            user_id: user.id,
            description: formData.source,
            amount: amount,
            category: "Income",
            category_color: "#22c55e",
            date: formData.date,
            is_monthly: formData.is_monthly,
            is_pending: formData.is_pending,
          });

          if (error) throw error;
        }

      // Close modal and reset
      setShowAddModal(false);
      setEditingIncome(null);
      resetForm();
      window.location.reload();
    } catch (error) {
      console.error("Error saving income:", error);
      alert("Failed to save income. Check console for details.");
    }
  };

  

  // Main page render
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
        <div className="p-6 border-b border-[#4b5563]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#818cf8] rounded-xl flex items-center justify-center shadow-lg shadow-[#818cf8]/25">
              <Wallet className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-white">ExpenseTracker</span>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveNav(item.id);
                navigate(item.path);
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${activeNav === item.id
                  ? "bg-[#818cf8] text-white shadow-lg shadow-[#818cf8]/25"
                  : "text-gray-400 hover:bg-[#334155] hover:text-white"
                }`}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-[#4b5563]">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-400 hover:bg-red-400/10 transition-all duration-200"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <main className="flex-1 overflow-y-auto overflow-x-hidden">
          {/* Mobile Header */}
          <div className="lg:hidden sticky top-0 z-40 bg-[#0f172a]/95 backdrop-blur-lg border-b border-[#4b5563] p-4 flex items-center justify-between">
            <h1 className="text-xl font-bold text-[#f8fafc]">ExpenseTracker</h1>
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
              <h1 className="text-2xl font-bold text-white">Income Tracker</h1>
              <p className="text-gray-400 mt-1">
                Current Balance: <span className={`font-semibold ${currentBalance >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {formatCurrency(currentBalance)}
                </span>
              </p>
            </div>
            <button
              onClick={() => { setShowAddModal(true); resetForm(); }}
              className="ml-auto flex items-center gap-2 px-4 py-2 bg-[#818cf8] text-white rounded-lg hover:bg-[#6366f1] transition-colors"
            >
              <Plus className="w-5 h-5" />
              Add Income
            </button>
          </div>

          <div className="p-6">

        <div className="p-6">
          {loading ? (
            <div className="text-center py-12 text-gray-400">Loading income data...</div>
          ) : (
            <>
              {/* Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="bg-[#1e293b] rounded-xl border border-[#4b5563] p-6">
                  <p className="text-sm text-gray-400 mb-2">Current Balance</p>
                  <p className={`text-2xl font-bold ${currentBalance >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {formatCurrency(currentBalance)}
                  </p>
                </div>
                <div className="bg-[#1e293b] rounded-xl border border-[#4b5563] p-6">
                  <p className="text-sm text-gray-400 mb-2">Total Received</p>
                  <p className="text-2xl font-bold text-green-400">
                    {formatCurrency(receivedIncomes.reduce((sum, i) => sum + i.amount, 0))}
                  </p>
                </div>
                <div className="bg-[#1e293b] rounded-xl border border-[#4b5563] p-6">
                  <p className="text-sm text-gray-400 mb-2">Incoming (Pending)</p>
                  <p className="text-2xl font-bold text-blue-400">
                    {formatCurrency(pendingIncomes.reduce((sum, i) => sum + i.amount, 0))}
                  </p>
                </div>
                <div className="bg-[#1e293b] rounded-xl border border-[#4b5563] p-6">
                  <p className="text-sm text-gray-400 mb-2">Monthly Income</p>
                  <p className="text-2xl font-bold text-amber-400">
                    {formatCurrency(receivedIncomes.filter(i => i.is_monthly).reduce((sum, i) => sum + i.amount, 0))}
                  </p>
                </div>
              </div>



              {/* Incoming/Pending Income Section */}
              {pendingIncomes.length > 0 && (
                <div className="mb-8">
                  <h2 className="text-xl font-bold text-white mb-4">📥 Incoming Income (Pending)</h2>
                  <div className="bg-[#1e293b] rounded-xl border border-[#4b5563] overflow-hidden">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-[#4b5563]">
                          <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Source</th>
                          <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Expected Date</th>
                          <th className="px-6 py-4 text-center text-sm font-semibold text-gray-300">Monthly?</th>
                          <th className="px-6 py-4 text-right text-sm font-semibold text-gray-300">Amount</th>
                          <th className="px-6 py-4 text-center text-sm font-semibold text-gray-300">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#4b5563]">
                        {pendingIncomes.map((income) => (
                          <tr key={income.id} className="hover:bg-[#334155]/50">
                            <td className="px-6 py-4 text-sm font-medium text-white">{income.description}</td>
                            <td className="px-6 py-4 text-sm text-gray-300">{new Date(income.date).toLocaleDateString()}</td>
                            <td className="px-6 py-4 text-center">
                              <span className={`px-2 py-1 rounded-full text-xs ${income.is_monthly ? 'bg-amber-500/20 text-amber-400' : 'bg-gray-500/20 text-gray-400'}`}>
                                {income.is_monthly ? 'Monthly' : 'One-time'}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-sm font-semibold text-right text-blue-400">{formatCurrency(income.amount)}</td>
                            <td className="px-6 py-4">
                              <div className="flex items-center justify-center gap-2">
                                <button
                                  onClick={() => markAsReceived(income.id)}
                                  className="p-2 text-green-400 hover:bg-green-400/10 rounded-lg transition-colors"
                                  title="Mark as received"
                                >
                                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                  </svg>
                                </button>
                                <button
                                  onClick={() => handleEdit(income)}
                                  className="p-2 text-blue-400 hover:bg-blue-400/10 rounded-lg transition-colors"
                                  title="Edit"
                                >
                                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                  </svg>
                                </button>
                                <button
                                  onClick={() => handleDelete(income.id)}
                                  className="p-2 text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
                                  title="Delete"
                                >
                                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                  </svg>
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Received Income Section */}
              <div>
                <h2 className="text-xl font-bold text-white mb-4">✅ Received Income</h2>
                <div className="bg-[#1e293b] rounded-xl border border-[#4b5563] overflow-hidden">
                  {receivedIncomes.length === 0 ? (
                    <p className="text-center py-12 text-gray-400">No income recorded yet. Add your first income!</p>
                  ) : (
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-[#4b5563]">
                          <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Source</th>
                          <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Date</th>
                          <th className="px-6 py-4 text-center text-sm font-semibold text-gray-300">Monthly?</th>
                          <th className="px-6 py-4 text-right text-sm font-semibold text-gray-300">Amount</th>
                          <th className="px-6 py-4 text-center text-sm font-semibold text-gray-300">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#4b5563]">
                        {receivedIncomes.map((income) => (
                          <tr key={income.id} className="hover:bg-[#334155]/50">
                            <td className="px-6 py-4 text-sm font-medium text-white">{income.description}</td>
                            <td className="px-6 py-4 text-sm text-gray-300">{new Date(income.date).toLocaleDateString()}</td>
                            <td className="px-6 py-4 text-center">
                              <span className={`px-2 py-1 rounded-full text-xs ${income.is_monthly ? 'bg-amber-500/20 text-amber-400' : 'bg-gray-500/20 text-gray-400'}`}>
                                {income.is_monthly ? 'Monthly' : 'One-time'}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-sm font-semibold text-right text-green-400">
                              <div className="flex items-center justify-end gap-1">
                                <ArrowUpRight className="w-4 h-4" />
                                {formatCurrency(income.amount)}
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center justify-center gap-2">
                                <button
                                  onClick={() => handleEdit(income)}
                                  className="p-2 text-blue-400 hover:bg-blue-400/10 rounded-lg transition-colors"
                                  title="Edit"
                                >
                                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                  </svg>
                                </button>
                                <button
                                  onClick={() => handleDelete(income.id)}
                                  className="p-2 text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
                                  title="Delete"
                                >
                                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                  </svg>
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Add Income Modal */}
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="w-full max-w-md bg-[#1e293b] rounded-xl border border-[#4b5563] shadow-2xl"
            >
              <div className="flex items-center justify-between p-6 border-b border-[#4b5563]">
                <h2 className="text-xl font-bold text-white">{editingIncome ? "Edit Income" : "Add New Income"}</h2>
                <button
                  onClick={() => { setShowAddModal(false); resetForm(); }}
                  className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-[#334155]"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Income Source</label>
                  <input
                    type="text"
                    required
                    value={formData.source}
                    onChange={(e) => setFormData({ ...formData, source: e.target.value })}
                    className="w-full px-4 py-3 bg-[#0f172a] border border-[#4b5563] rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#818cf8]"
                    placeholder="e.g., Salary, Freelance"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Amount (PHP)</label>
                  <input
                    type="text"
                    inputMode="numeric"
                    required
                    value={formData.amount}
                    onChange={handleAmountChange}
                    className="w-full px-4 py-3 bg-[#0f172a] border border-[#4b5563] rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#818cf8]"
                    placeholder="25,000.00"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Date</label>
                  <input
                    type="date"
                    required
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full px-4 py-3 bg-[#0f172a] border border-[#4b5563] rounded-lg text-white focus:outline-none focus:border-[#818cf8]"
                  />
                </div>

                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="is_pending"
                    checked={formData.is_pending}
                    onChange={(e) => setFormData({ ...formData, is_pending: e.target.checked })}
                    className="w-4 h-4 rounded border-[#4b5563] bg-[#0f172a] text-[#818cf8] focus:ring-[#818cf8]"
                  />
                  <label htmlFor="is_pending" className="text-sm font-medium text-gray-300">This is incoming (not yet received)</label>
                </div>

                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="is_monthly"
                    checked={formData.is_monthly}
                    onChange={(e) => setFormData({ ...formData, is_monthly: e.target.checked })}
                    className="w-4 h-4 rounded border-[#4b5563] bg-[#0f172a] text-[#818cf8] focus:ring-[#818cf8]"
                  />
                  <label htmlFor="is_monthly" className="text-sm font-medium text-gray-300">This is monthly income</label>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => { setShowAddModal(false); resetForm(); }}
                    className="flex-1 px-4 py-3 border border-[#4b5563] text-gray-300 rounded-lg hover:bg-[#334155] transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-3 bg-[#818cf8] text-white rounded-lg hover:bg-[#6366f1] transition-colors"
                  >
                    Add Income
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
          </div>
        </main>
      </div>
    </div>
  );
}