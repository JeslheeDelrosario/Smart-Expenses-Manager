// src/pages/Transactions.tsx
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Menu,
  Receipt,
  Plus,
  Search,
  X,
  Edit,
  Trash2,
  LayoutDashboard,
  Wallet,
  PieChart,
  Settings,
  LogOut,
  Calendar,
  ArrowDownRight,
  ArrowUpRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

// Types
interface Transaction {
  id: string;
  user_id: string;
  description: string;
  amount: number;
  category: string;
  category_color: string;
  date: string;
  created_at: string;
}

interface Category {
  id: string;
  name: string;
  color: string;
}

export default function TransactionsPage() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeNav, setActiveNav] = useState("transactions");
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    description: "",
    amount: "",
    category_id: "",
    date: new Date().toISOString().split("T")[0],
    is_income: false,
  });

  // Handle amount input with automatic thousand separators
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Remove all non-numeric characters except decimal point
    const value = e.target.value.replace(/[^\d.]/g, '');
    // Only allow one decimal point
    const parts = value.split('.');
    if (parts.length > 2) return;
    
    // Format number with commas
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

  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
    { id: "transactions", label: "Transactions", icon: Receipt, path: "/transactions" },
    { id: "budgets", label: "Budgets", icon: PieChart, path: "/budgets" },
    { id: "income", label: "Income", icon: ArrowUpRight, path: "/income" },
    { id: "account", label: "Account", icon: Wallet, path: "/account" },
    { id: "settings", label: "Settings", icon: Settings, path: "/settings" },
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-PH", {
      style: "currency",
      currency: "PHP",
    }).format(amount);
  };

  // Fetch transactions and categories
  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        console.log("Current user:", user);
        console.log("Auth error:", authError);
        
        if (!user) {
          console.log("No user found, redirecting to login");
          navigate("/login");
          return;
        }

        // Fetch categories
        const { data: cats, error: catsError } = await supabase
          .from("categories")
          .select("id, name, color")
          .eq("user_id", user.id);
          
        if (catsError) throw catsError;
        setCategories(cats || []);

        // Fetch transactions
        const { data: trans, error: transError } = await supabase
          .from("expenses")
          .select("*")
          .eq("user_id", user.id)
          .order("date", { ascending: false });
          
        if (transError) throw transError;
        setTransactions(trans || []);
      } catch (error) {
        console.error("Error fetching data:", error);
        alert("Failed to load data. Check console for details.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  // Calculate current balance
  const currentBalance = transactions.reduce((sum, t) => sum + t.amount, 0);

  // Filter transactions
  const filteredTransactions = transactions.filter((t) =>
    t.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handle submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      navigate("/login");
      return;
    }

    const selectedCategory = categories.find(c => c.id === formData.category_id);
    if (!selectedCategory) {
      alert("Please select a category");
      return;
    }

    const amount = getRawAmount(formData.amount);
       if (isNaN(amount) || amount <= 0) {
         alert("Please enter a valid amount");
         return;
       }
       const finalAmount = formData.is_income ? amount : -amount;

    try {
      if (editingTransaction) {
        // Update existing transaction
        const { error: updateError } = await supabase
          .from("expenses")
          .update({
            description: formData.description,
            amount: finalAmount,
            category: selectedCategory.name,
            category_color: selectedCategory.color,
            date: formData.date,
          })
          .eq("id", editingTransaction.id)
          .eq("user_id", user.id);
          
        if (updateError) throw updateError;
      } else {
        // Add new transaction
        const { error: insertError } = await supabase.from("expenses").insert({
          user_id: user.id,
          description: formData.description,
          amount: finalAmount,
          category: selectedCategory.name,
          category_color: selectedCategory.color,
          date: formData.date,
        });
        
        if (insertError) throw insertError;
      }

      // Refresh data
      const { data: trans, error: fetchError } = await supabase
        .from("expenses")
        .select("*")
        .eq("user_id", user.id)
        .order("date", { ascending: false });
        
      if (fetchError) throw fetchError;
      setTransactions(trans || []);

      // Reset form
      resetForm();
      setShowAddModal(false);
      setEditingTransaction(null);
    } catch (error) {
      console.error("Error saving transaction:", error);
      alert("Failed to save transaction. Check console for details.");
    }
  };

  const resetForm = () => {
    setFormData({
      description: "",
      amount: "",
      category_id: "",
      date: new Date().toISOString().split("T")[0],
      is_income: false,
    });
  };

  // Edit transaction
  const handleEdit = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    setFormData({
      description: transaction.description,
      amount: Math.abs(transaction.amount).toString(),
      category_id: categories.find(c => c.name === transaction.category)?.id || "",
      date: transaction.date,
      is_income: transaction.amount > 0,
    });
    setShowAddModal(true);
  };

  // Delete transaction
  const handleDelete = async (id: string) => {
    await supabase.from("expenses").delete().eq("id", id);
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data: trans } = await supabase
        .from("expenses")
        .select("*")
        .eq("user_id", user.id)
        .order("date", { ascending: false });
      setTransactions(trans || []);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
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
      <main className="flex-1 min-w-0">
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
                <h1 className="text-2xl font-bold text-white">Transactions</h1>
                <p className="text-gray-400 mt-1">Current Balance: <span className={`font-semibold ${currentBalance >= 0 ? 'text-green-400' : 'text-red-400'}`}>{formatCurrency(currentBalance)}</span></p>
              </div>
            </div>
            <button
              onClick={() => { setShowAddModal(true); setEditingTransaction(null); resetForm(); }}
              className="flex items-center gap-2 px-4 py-2 bg-[#818cf8] text-white rounded-lg hover:bg-[#6366f1] transition-colors"
            >
              <Plus className="w-5 h-5" />
              Add Transaction
            </button>
          </div>
        </header>

        {/* Search bar */}
        <div className="px-6 py-4">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search transactions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-[#1e293b] border border-[#4b5563] rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#818cf8]"
            />
          </div>
        </div>

        {/* Transactions List */}
        <div className="px-6 pb-6">
          {loading ? (
            <div className="text-center py-12 text-gray-400">Loading transactions...</div>
          ) : filteredTransactions.length === 0 ? (
            <motion.div
              custom={0}
              initial="hidden"
              animate="visible"
              variants={fadeInVariants}
              className="text-center py-12 bg-[#1e293b] rounded-xl border border-[#4b5563]"
            >
              <Receipt className="w-12 h-12 mx-auto text-gray-500 mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">No transactions yet</h3>
              <p className="text-gray-400 mb-4">Add your first transaction to start tracking your expenses</p>
              <button
                onClick={() => { setShowAddModal(true); resetForm(); }}
                className="inline-flex items-center gap-2 px-4 py-2 bg-[#818cf8] text-white rounded-lg hover:bg-[#6366f1]"
              >
                <Plus className="w-5 h-5" />
                Add First Transaction
              </button>
            </motion.div>
          ) : (
            <div className="bg-[#1e293b] rounded-xl border border-[#4b5563] overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-[#334155]">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Date</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Description</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Category</th>
                      <th className="px-6 py-4 text-right text-sm font-semibold text-gray-300">Amount</th>
                      <th className="px-6 py-4 text-center text-sm font-semibold text-gray-300">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#4b5563]">
                    {filteredTransactions.map((transaction, index) => (
                      <motion.tr
                        key={transaction.id}
                        custom={index}
                        initial="hidden"
                        animate="visible"
                        variants={fadeInVariants}
                        className="hover:bg-[#334155]/50"
                      >
                        <td className="px-6 py-4 text-sm text-gray-300">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-gray-500" />
                            {new Date(transaction.date).toLocaleDateString()}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm font-medium text-white">{transaction.description}</td>
                        <td className="px-6 py-4">
                          <span
                            className="inline-flex px-3 py-1 rounded-full text-xs font-medium text-white"
                            style={{ backgroundColor: transaction.category_color }}
                          >
                            {transaction.category}
                          </span>
                        </td>
                        <td className={`px-6 py-4 text-sm font-semibold text-right ${transaction.amount > 0 ? "text-green-400" : "text-red-400"}`}>
                          <div className="flex items-center justify-end gap-1">
                            {transaction.amount > 0 ? (
                              <ArrowUpRight className="w-4 h-4" />
                            ) : (
                              <ArrowDownRight className="w-4 h-4" />
                            )}
                            {formatCurrency(transaction.amount)}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => handleEdit(transaction)}
                              className="p-2 text-gray-400 hover:text-blue-400 hover:bg-blue-400/10 rounded-lg transition-colors"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(transaction.id)}
                              className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Add/Edit Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md bg-[#1e293b] rounded-xl border border-[#4b5563] shadow-2xl"
          >
            <div className="flex items-center justify-between p-6 border-b border-[#4b5563]">
              <h2 className="text-xl font-bold text-white">
                {editingTransaction ? "Edit Transaction" : "Add New Transaction"}
              </h2>
              <button
                onClick={() => { setShowAddModal(false); setEditingTransaction(null); resetForm(); }}
                className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-[#334155]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
                <input
                  type="text"
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-3 bg-[#0f172a] border border-[#4b5563] rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#818cf8]"
                  placeholder="Grocery shopping"
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
                  placeholder="1,500.00"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Category</label>
                <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1">
                  {categories.length === 0 ? (
                    <p className="col-span-2 text-sm text-gray-400 py-2">No categories found. <button type="button" onClick={() => { setShowAddModal(false); navigate("/budgets"); }} className="text-[#818cf8] hover:underline">Add categories</button></p>
                  ) : categories.map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setFormData({ ...formData, category_id: cat.id })}
                      className={`flex items-center gap-2 px-3 py-2.5 rounded-lg border text-sm font-medium transition-all ${
                        formData.category_id === cat.id
                          ? "border-[#818cf8] bg-[#818cf8]/10 text-white"
                          : "border-[#4b5563] bg-[#0f172a] text-gray-300 hover:border-[#818cf8]/50"
                      }`}
                    >
                      <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: cat.color }} />
                      <span className="truncate">{cat.name}</span>
                    </button>
                  ))}
                </div>
                {!formData.category_id && <input type="text" required className="sr-only" tabIndex={-1} />}
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
                  id="is_income"
                  checked={formData.is_income}
                  onChange={(e) => setFormData({ ...formData, is_income: e.target.checked })}
                  className="w-4 h-4 rounded border-[#4b5563] bg-[#0f172a] text-[#818cf8] focus:ring-[#818cf8]"
                />
                <label htmlFor="is_income" className="text-sm font-medium text-gray-300">This is income (salary, etc.)</label>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => { setShowAddModal(false); setEditingTransaction(null); resetForm(); }}
                  className="flex-1 px-4 py-3 border border-[#4b5563] text-gray-300 rounded-lg hover:bg-[#334155] transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-3 bg-[#818cf8] text-white rounded-lg hover:bg-[#6366f1] transition-colors"
                >
                  {editingTransaction ? "Update" : "Add"} Transaction
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}