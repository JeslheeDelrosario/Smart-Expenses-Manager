import { useState, useEffect } from "react";
import { Menu, Plus, ArrowUpRight, Check, X, LayoutDashboard, Receipt, PieChart, Wallet, Settings, LogOut } from "lucide-react";
import { motion } from "framer-motion";
import { supabase } from "../lib/supabase";
import { useNavigate } from "react-router-dom";

// Interface for income entries (matches your expenses table structure)
interface Income {
  id: string;
  user_id: string;
  source: string;
  description: string;
  amount: number;
  date: string;
  is_pending: boolean;
  is_income: boolean;
}

export default function IncomePage() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeNav, setActiveNav] = useState("income"); // Add this!

  // State for our data
  const [receivedIncomes, setReceivedIncomes] = useState<Income[]>([]);
  const [pendingIncomes, setPendingIncomes] = useState<Income[]>([]);
  const [currentBalance, setCurrentBalance] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);

  // Logout function (matches all other pages)
  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };
  const [formData, setFormData] = useState({
    source: "",
    amount: "",
    date: new Date().toISOString().split("T")[0],
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

        // Get all received (completed) income
        const { data: received, error: receivedError } = await supabase
          .from("expenses")
          .select("*")
          .eq("user_id", user.id)
          .eq("is_income", true)
          .eq("is_pending", false)
          .order("date", { ascending: false });

        if (receivedError) throw receivedError;
        setReceivedIncomes(received || []);

        // Get all pending (incoming) income
        const { data: pending, error: pendingError } = await supabase
          .from("expenses")
          .select("*")
          .eq("user_id", user.id)
          .eq("is_income", true)
          .eq("is_pending", true)
          .order("date", { ascending: true });

        if (pendingError) throw pendingError;
        setPendingIncomes(pending || []);

        // Calculate current balance from all transactions
        const { data: allTransactions, error: balanceError } = await supabase
          .from("expenses")
          .select("amount")
          .eq("user_id", user.id);

        if (balanceError) throw balanceError;
        const balance = allTransactions?.reduce((sum, t) => sum + t.amount, 0) || 0;
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

  // Handle form submission for new income
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

      // Insert into Supabase
      const { error } = await supabase.from("expenses").insert({
        user_id: user.id,
        description: formData.source,
        amount: amount,
        category: "Income",
        date: formData.date,
        is_income: true,
        is_pending: formData.is_pending,
      });

      if (error) throw error;

      // Close modal and reset
      setShowAddModal(false);
      resetForm();
      window.location.reload();
    } catch (error) {
      console.error("Error saving income:", error);
      alert("Failed to save income. Check console for details.");
    }
  };

  

  // Main page render
  return (
    <div className="min-h-screen bg-[#0f172a]">
      {/* Sidebar overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Add activeNav state at the top of your component if missing, add this line with your other state variables: */}
      {/* const [activeNav, setActiveNav] = useState("income"); */}
      {/* Add handleLogout function: */}
      {/* const handleLogout = async () => { await supabase.auth.signOut(); navigate("/login"); }; */}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-[#1e293b] border-r border-[#4b5563] z-50 transform transition-transform duration-300 lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
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
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                activeNav === item.id
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
      <main className="lg:ml-64 min-h-screen">
        {/* Header */}
        <header className="bg-[#1e293b]/50 backdrop-blur-sm border-b border-[#4b5563] px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 text-gray-400 hover:text-white"
              >
                <Menu className="w-6 h-6" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-white">Income Tracker</h1>
                <p className="text-gray-400 mt-1">
                  Current Balance: <span className={`font-semibold ${currentBalance >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {formatCurrency(currentBalance)}
                  </span>
                </p>
              </div>
            </div>
            <button
              onClick={() => { setShowAddModal(true); resetForm(); }}
              className="flex items-center gap-2 px-4 py-2 bg-[#818cf8] text-white rounded-lg hover:bg-[#6366f1] transition-colors"
            >
              <Plus className="w-5 h-5" />
              Add Income
            </button>
          </div>
        </header>

        <div className="p-6">
          {loading ? (
            <div className="text-center py-12 text-gray-400">Loading income data...</div>
          ) : (
            <>
              {/* Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-[#1e293b] rounded-xl border border-[#4b5563] p-6">
                  <p className="text-sm text-gray-400 mb-2">Total Received Income</p>
                  <p className="text-2xl font-bold text-green-400">
                    {formatCurrency(receivedIncomes.reduce((sum, i) => sum + i.amount, 0))}
                  </p>
                </div>
                <div className="bg-[#1e293b] rounded-xl border border-[#4b5563] p-6">
                  <p className="text-sm text-gray-400 mb-2">Total Incoming (Pending)</p>
                  <p className="text-2xl font-bold text-blue-400">
                    {formatCurrency(pendingIncomes.reduce((sum, i) => sum + i.amount, 0))}
                  </p>
                </div>
                <div className="bg-[#1e293b] rounded-xl border border-[#4b5563] p-6">
                  <p className="text-sm text-gray-400 mb-2">Pending Payments</p>
                  <p className="text-2xl font-bold text-amber-400">{pendingIncomes.length}</p>
                </div>
              </div>

              {/* Incoming Income Section */}
              {pendingIncomes.length > 0 && (
                <div className="mb-8">
                  <h2 className="text-xl font-bold text-white mb-4">Incoming Income</h2>
                  <div className="bg-[#1e293b] rounded-xl border border-[#4b5563] overflow-hidden">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-[#4b5563]">
                          <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Source</th>
                          <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Expected Date</th>
                          <th className="px-6 py-4 text-right text-sm font-semibold text-gray-300">Amount</th>
                          <th className="px-6 py-4 text-center text-sm font-semibold text-gray-300">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#4b5563]">
                        {pendingIncomes.map((income) => (
                          <tr key={income.id} className="hover:bg-[#334155]/50">
                            <td className="px-6 py-4 text-sm font-medium text-white">{income.description}</td>
                            <td className="px-6 py-4 text-sm text-gray-300">{new Date(income.date).toLocaleDateString()}</td>
                            <td className="px-6 py-4 text-sm font-semibold text-right text-blue-400">{formatCurrency(income.amount)}</td>
                            <td className="px-6 py-4">
                              <button
                                onClick={() => markAsReceived(income.id)}
                                className="p-2 text-green-400 hover:bg-green-400/10 rounded-lg transition-colors"
                                title="Mark as received"
                              >
                                <Check className="w-4 h-4" />
                              </button>
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
                <h2 className="text-xl font-bold text-white mb-4">Received Income History</h2>
                <div className="bg-[#1e293b] rounded-xl border border-[#4b5563] overflow-hidden">
                  {receivedIncomes.length === 0 ? (
                    <p className="text-center py-12 text-gray-400">No income recorded yet. Add your first income!</p>
                  ) : (
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-[#4b5563]">
                          <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Source</th>
                          <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Date Received</th>
                          <th className="px-6 py-4 text-right text-sm font-semibold text-gray-300">Amount</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#4b5563]">
                        {receivedIncomes.map((income) => (
                          <tr key={income.id} className="hover:bg-[#334155]/50">
                            <td className="px-6 py-4 text-sm font-medium text-white">{income.description}</td>
                            <td className="px-6 py-4 text-sm text-gray-300">{new Date(income.date).toLocaleDateString()}</td>
                            <td className="px-6 py-4 text-sm font-semibold text-right text-green-400">
                              <div className="flex items-center justify-end gap-1">
                                <ArrowUpRight className="w-4 h-4" />
                                {formatCurrency(income.amount)}
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
                <h2 className="text-xl font-bold text-white">Add New Income</h2>
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
      </main>
    </div>
  );
}