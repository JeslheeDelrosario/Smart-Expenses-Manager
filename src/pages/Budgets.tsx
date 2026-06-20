// src/pages/Budgets.tsx
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Menu,
  PieChart,
  LayoutDashboard,
  Wallet,
  Receipt,
  Settings,
  LogOut,
  Plus,
  Edit,
  Trash2,
  AlertTriangle,
  ArrowUpRight,
  X,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

// Types
interface Category {
  id: string;
  user_id: string;
  name: string;
  color: string;
  budget: number;
  spent: number;
}

export default function BudgetsPage() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeNav, setActiveNav] = useState("budgets");
  const [showAddModal, setShowAddModal] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalBudget, setTotalBudget] = useState(0);
  const [totalSpent, setTotalSpent] = useState(0);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  
  // Form state
  const [formData, setFormData] = useState({
    name: "",
    color: "#f59e0b",
    budget: "",
  });

  // Handle budget input with automatic thousand separators
  const handleBudgetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
    setFormData(prev => ({ ...prev, budget: formattedValue }));
  };

  // Get raw numeric value from formatted budget
  const getRawBudget = (formattedBudget: string) => {
    return parseFloat(formattedBudget.replace(/,/g, ''));
  };

  const colors = [
    "#f59e0b", // amber - Food
    "#3b82f6", // blue - Transport
    "#8b5cf6", // purple - Entertainment
    "#ec4899", // pink - Shopping
    "#10b981", // green - Bills
    "#ef4444", // red - Healthcare
    "#6b7280", // gray - Other
    "#06b6d4", // cyan
    "#84cc16", // lime
    "#f97316", // orange
  ];

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

  // Calculate percentage spent
  const getPercentage = (spent: number, budget: number) => {
    if (!budget) return 0;
    return Math.min((Math.abs(spent) / budget) * 100, 100);
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        console.log("Current user in Budgets:", user);
        console.log("Auth error:", authError);
        
        if (!user) {
          navigate("/login");
          return;
        }

        // Get categories
        const { data: cats, error: catsError } = await supabase
          .from("categories")
          .select("*")
          .eq("user_id", user.id);
          
        if (catsError) throw catsError;
        console.log("Fetched categories:", cats);
      
        // Calculate spent for each category
        const { data: expenses, error: expensesError } = await supabase
          .from("expenses")
          .select("*")
          .eq("user_id", user.id)
          .lt("amount", 0); // only expenses (negative amounts)
          
        if (expensesError) throw expensesError;
        console.log("Fetched expenses:", expenses);

        const enhancedCategories = cats?.map(cat => {
          const categoryExpenses = expenses?.filter(e => e.category === cat.name) || [];
          const spent = categoryExpenses.reduce((sum, e) => sum + Math.abs(e.amount), 0);
          return {
            ...cat,
            spent,
            budget: cat.budget || 15000, // default budget if not set
          };
        }) || [];

        setCategories(enhancedCategories);
        
        // Calculate totals
        const totalBudg = enhancedCategories.reduce((sum, c) => sum + (c.budget || 0), 0);
        const totalSpentAmt = enhancedCategories.reduce((sum, c) => sum + c.spent, 0);
        setTotalBudget(totalBudg);
        setTotalSpent(totalSpentAmt);
      } catch (error) {
        console.error("Error fetching categories:", error);
        alert("Failed to load data. Check console for details.");
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, [navigate]);

  const refreshCategories = async (userId: string) => {
    const { data: cats } = await supabase.from("categories").select("*").eq("user_id", userId);
    const { data: expenses } = await supabase.from("expenses").select("*").eq("user_id", userId).lt("amount", 0);

    const enhanced = (cats || []).map(cat => {
      const spent = (expenses || []).filter(e => e.category === cat.name).reduce((sum, e) => sum + Math.abs(e.amount), 0);
      return { ...cat, spent, budget: cat.budget || 15000 };
    });

    setCategories(enhanced);
    setTotalBudget(enhanced.reduce((sum, c) => sum + c.budget, 0));
    setTotalSpent(enhanced.reduce((sum, c) => sum + c.spent, 0));
  };

  // Handle submit for new/edit category
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      console.log("User in handleSubmit:", user);
      console.log("Auth error:", authError);
      
      if (!user) {
        navigate("/login");
        return;
      }

      // Validate form data
      if (!formData.name.trim()) {
        alert("Please enter a category name");
        return;
      }
      const budgetNum = getRawBudget(formData.budget);
            if (isNaN(budgetNum) || budgetNum <= 0) {
              alert("Please enter a valid budget amount");
              return;
            }

      if (editingCategory) {
        // Update existing category
        const { error: updateError } = await supabase
          .from("categories")
          .update({ 
            name: formData.name, 
            color: formData.color, 
            budget: budgetNum 
          })
          .eq("id", editingCategory.id)
          .eq("user_id", user.id);
          
        if (updateError) throw updateError;
      } else {
        // Add new category
        const { error: insertError } = await supabase.from("categories").insert({
          user_id: user.id,
          name: formData.name,
          color: formData.color,
          budget: budgetNum,
        });
        
        if (insertError) throw insertError;
      }

      setShowAddModal(false);
      setEditingCategory(null);
      setFormData({ name: "", color: "#f59e0b", budget: "" });
      await refreshCategories(user.id);
    } catch (error) {
      console.error("Error saving category:", error);
      alert("Failed to save category. Check console for details.");
    }
  };

  // Delete category
  const handleDelete = async (id: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    await supabase.from("categories").delete().eq("id", id);
    await refreshCategories(user.id);
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
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 text-gray-400 hover:text-white"
              >
                <Menu className="w-6 h-6" />
              </button>
              <h1 className="text-2xl font-bold text-white">Budgets</h1>
            </div>
            <button
              onClick={() => { setShowAddModal(true); setEditingCategory(null); }}
              className="flex items-center gap-2 px-4 py-2 bg-[#818cf8] text-white rounded-lg hover:bg-[#6366f1] transition-colors"
            >
              <Plus className="w-5 h-5" />
              Add Category
            </button>
          </div>
        </header>

        {/* Overview Cards */}
        <div className="px-6 py-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <motion.div
              custom={0}
              initial="hidden"
              animate="visible"
              variants={fadeInVariants}
              className="bg-[#1e293b] rounded-xl border border-[#4b5563] p-6"
            >
              <p className="text-sm text-gray-400 mb-1">Total Budget</p>
              <p className="text-3xl font-bold text-white">{formatCurrency(totalBudget)}</p>
            </motion.div>
            <motion.div
              custom={1}
              initial="hidden"
              animate="visible"
              variants={fadeInVariants}
              className="bg-[#1e293b] rounded-xl border border-[#4b5563] p-6"
            >
              <p className="text-sm text-gray-400 mb-1">Total Spent</p>
              <p className="text-3xl font-bold text-red-400">{formatCurrency(totalSpent)}</p>
            </motion.div>
            <motion.div
              custom={2}
              initial="hidden"
              animate="visible"
              variants={fadeInVariants}
              className="bg-[#1e293b] rounded-xl border border-[#4b5563] p-6"
            >
              <p className="text-sm text-gray-400 mb-1">Remaining</p>
              <p className="text-3xl font-bold text-green-400">{formatCurrency(totalBudget - totalSpent)}</p>
            </motion.div>
          </div>

          {/* Overall Progress Bar */}
          <motion.div
            custom={3}
            initial="hidden"
            animate="visible"
            variants={fadeInVariants}
            className="bg-[#1e293b] rounded-xl border border-[#4b5563] p-6 mb-8"
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold text-white">Overall Budget Usage</h3>
              <span className="text-gray-400">{totalSpent > 0 ? Math.round((totalSpent / totalBudget) * 100) : 0}% used</span>
            </div>
            <div className="w-full h-4 bg-[#0f172a] rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-500 ${(totalSpent / totalBudget) > 0.8 ? "bg-red-500" : "bg-[#818cf8]"}`}
                style={{ width: `${Math.min((totalSpent / totalBudget) * 100, 100)}%` }}
              />
            </div>
            {(totalSpent / totalBudget) > 0.8 && (
              <div className="flex items-center gap-2 mt-3 text-yellow-400">
                <AlertTriangle className="w-4 h-4" />
                <span className="text-sm">You're approaching your total budget limit!</span>
              </div>
            )}
          </motion.div>

          {/* Category Budget Cards */}
          {loading ? (
            <div className="text-center py-12 text-gray-400">Loading budgets...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {categories.map((category, index) => {
                const percentage = getPercentage(category.spent, category.budget);
                const isOverBudget = percentage >= 80;
                return (
                  <motion.div
                    key={category.id}
                    custom={index + 4}
                    initial="hidden"
                    animate="visible"
                    variants={fadeInVariants}
                    className="bg-[#1e293b] rounded-xl border border-[#4b5563] p-6"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-4 h-4 rounded-full"
                          style={{ backgroundColor: category.color }}
                        />
                        <h3 className="text-lg font-semibold text-white">{category.name}</h3>
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => {
                            setEditingCategory(category);
                            // Format budget with commas when editing
                            const formattedBudget = category.budget?.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || "";
                            setFormData({
                              name: category.name,
                              color: category.color,
                              budget: formattedBudget,
                            });
                            setShowAddModal(true);
                          }}
                          className="p-2 text-gray-400 hover:text-blue-400 hover:bg-blue-400/10 rounded-lg transition-colors"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(category.id)}
                          className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-400">Spent</span>
                        <span className="text-sm font-medium text-white">
                          {formatCurrency(category.spent)} / {formatCurrency(category.budget || 0)}
                        </span>
                      </div>
                      <div className="w-full h-3 bg-[#0f172a] rounded-full overflow-hidden">
                        <div
                          className={`h-full transition-all duration-500 ${isOverBudget ? "bg-red-500" : ""}`}
                          style={{
                            width: `${percentage}%`,
                            backgroundColor: isOverBudget ? undefined : category.color,
                          }}
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-[#4b5563]">
                      <span className="text-sm text-gray-400">Remaining</span>
                      <span className={`text-sm font-semibold ${(category.budget || 0) - category.spent > 0 ? "text-green-400" : "text-red-400"}`}>
                        <ArrowUpRight className="w-4 h-4 inline mr-1" />
                        {formatCurrency((category.budget || 0) - category.spent)}
                      </span>
                    </div>

                    {isOverBudget && (
                      <div className="flex items-center gap-2 mt-4 p-2 bg-yellow-400/10 rounded-lg">
                        <AlertTriangle className="w-4 h-4 text-yellow-400" />
                        <span className="text-xs text-yellow-400">
                          {percentage >= 100 ? "Over budget!" : "Approaching limit"}
                        </span>
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </main>

      {/* Add/Edit Category Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md bg-[#1e293b] rounded-xl border border-[#4b5563] shadow-2xl"
          >
            <div className="flex items-center justify-between p-6 border-b border-[#4b5563]">
              <h2 className="text-xl font-bold text-white">
                {editingCategory ? "Edit Category" : "Add New Category"}
              </h2>
              <button
                onClick={() => { setShowAddModal(false); setEditingCategory(null); }}
                className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-[#334155]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Category Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 bg-[#0f172a] border border-[#4b5563] rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#818cf8]"
                  placeholder="e.g., Subscriptions"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Monthly Budget (PHP)</label>
                <input
                  type="text"
                  inputMode="numeric"
                  required
                  value={formData.budget}
                  onChange={handleBudgetChange}
                  className="w-full px-4 py-3 bg-[#0f172a] border border-[#4b5563] rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#818cf8]"
                  placeholder="10,000.00"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Color</label>
                <div className="flex flex-wrap gap-2">
                  {colors.map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setFormData({ ...formData, color })}
                      className={`w-8 h-8 rounded-full transition-transform ${formData.color === color ? "ring-2 ring-white ring-offset-2 ring-offset-[#1e293b] scale-110" : "hover:scale-110"}`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => { setShowAddModal(false); setEditingCategory(null); }}
                  className="flex-1 px-4 py-3 border border-[#4b5563] text-gray-300 rounded-lg hover:bg-[#334155] transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-3 bg-[#818cf8] text-white rounded-lg hover:bg-[#6366f1] transition-colors"
                >
                  {editingCategory ? "Update" : "Add"} Category
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}