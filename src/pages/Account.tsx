// src/pages/Account.tsx
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Menu,
  LayoutDashboard,
  Wallet,
  PieChart,
  Receipt,
  Settings,
  LogOut,
  Calendar,
  CreditCard,
  Edit,
  Link,
  Mail,
  BadgeCheck,
  TrendingUp,
  Trash2,
  ArrowUpRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

// Types
interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  created_at: string;
  last_sign_in: string;
}

export default function AccountPage() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeNav, setActiveNav] = useState("account");
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalTransactions: 0,
    totalSpent: 0,
    totalIncome: 0,
    categories: 0,
  });

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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-PH", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Calculate account age
  const getAccountAge = (createdAt: string) => {
    const created = new Date(createdAt);
    const now = new Date();
    const months = Math.floor((now.getTime() - created.getTime()) / (1000 * 60 * 60 * 24 * 30));
    if (months < 1) return "Less than a month";
    if (months === 1) return "1 month";
    return `${months} months`;
  };

  useEffect(() => {
    const fetchProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate("/login");
        return;
      }

      setProfile({
        id: user.id,
        email: user.email || "",
        full_name: user.user_metadata.full_name || "User",
        created_at: user.created_at,
        last_sign_in: user.last_sign_in_at || user.created_at,
      });

      // Calculate stats
      const { data: expenses } = await supabase
        .from("expenses")
        .select("amount")
        .eq("user_id", user.id);
      
      const { count: transactionCount } = await supabase
        .from("expenses")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user.id);

      const { count: categoryCount } = await supabase
        .from("categories")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user.id);

      const totalSpent = expenses?.filter(e => e.amount < 0).reduce((sum, e) => sum + Math.abs(e.amount), 0) || 0;
      const totalIncome = expenses?.filter(e => e.amount > 0).reduce((sum, e) => sum + e.amount, 0) || 0;

      setStats({
        totalTransactions: transactionCount || 0,
        totalSpent,
        totalIncome,
        categories: categoryCount || 0,
      });

      setLoading(false);
    };

    fetchProfile();
  }, [navigate]);

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
              <h1 className="text-2xl font-bold text-white">My Account</h1>
            </div>
          </div>
        </header>

        <div className="p-6 space-y-6">
          {loading ? (
            <div className="text-center py-12 text-gray-400">Loading profile...</div>
          ) : profile && (
            <>
              {/* Profile Header Card */}
              <motion.div
                custom={0}
                initial="hidden"
                animate="visible"
                variants={fadeInVariants}
                className="bg-[#1e293b] rounded-xl border border-[#4b5563] p-6"
              >
                <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                  <div className="w-24 h-24 bg-gradient-to-br from-[#818cf8] to-[#6366f1] rounded-2xl flex items-center justify-center shadow-lg shadow-[#818cf8]/25">
                    <span className="text-3xl font-bold text-white">
                      {profile.full_name.split(" ").map(n => n[0]).join("").toUpperCase()}
                    </span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h2 className="text-2xl font-bold text-white">{profile.full_name}</h2>
                      <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-400/20 text-green-400 text-xs font-medium rounded-full">
                        <BadgeCheck className="w-3 h-3" />
                        Verified
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-4 text-gray-400">
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        {profile.email}
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        Member for {getAccountAge(profile.created_at)}
                      </div>
                    </div>
                  </div>
                  <button className="flex items-center gap-2 px-4 py-2 bg-[#334155] text-white rounded-lg hover:bg-[#475569] transition-colors">
                    <Edit className="w-4 h-4" />
                    Edit Profile
                  </button>
                </div>
              </motion.div>

              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <motion.div
                  custom={1}
                  initial="hidden"
                  animate="visible"
                  variants={fadeInVariants}
                  className="bg-[#1e293b] rounded-xl border border-[#4b5563] p-6"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-400/20 rounded-xl flex items-center justify-center">
                      <Receipt className="w-6 h-6 text-blue-400" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Total Transactions</p>
                      <p className="text-2xl font-bold text-white">{stats.totalTransactions}</p>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  custom={2}
                  initial="hidden"
                  animate="visible"
                  variants={fadeInVariants}
                  className="bg-[#1e293b] rounded-xl border border-[#4b5563] p-6"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-red-400/20 rounded-xl flex items-center justify-center">
                      <Wallet className="w-6 h-6 text-red-400" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Total Spent</p>
                      <p className="text-2xl font-bold text-white">{formatCurrency(stats.totalSpent)}</p>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  custom={3}
                  initial="hidden"
                  animate="visible"
                  variants={fadeInVariants}
                  className="bg-[#1e293b] rounded-xl border border-[#4b5563] p-6"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-green-400/20 rounded-xl flex items-center justify-center">
                      <TrendingUp className="w-6 h-6 text-green-400" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Total Income</p>
                      <p className="text-2xl font-bold text-white">{formatCurrency(stats.totalIncome)}</p>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  custom={4}
                  initial="hidden"
                  animate="visible"
                  variants={fadeInVariants}
                  className="bg-[#1e293b] rounded-xl border border-[#4b5563] p-6"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-purple-400/20 rounded-xl flex items-center justify-center">
                      <PieChart className="w-6 h-6 text-purple-400" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Categories</p>
                      <p className="text-2xl font-bold text-white">{stats.categories}</p>
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Account Details Section */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <motion.div
                  custom={5}
                  initial="hidden"
                  animate="visible"
                  variants={fadeInVariants}
                  className="bg-[#1e293b] rounded-xl border border-[#4b5563] p-6"
                >
                  <h3 className="text-lg font-semibold text-white mb-4">Account Information</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between py-3 border-b border-[#4b5563]">
                      <span className="text-gray-400">User ID</span>
                      <span className="text-white font-mono text-sm">{profile.id.slice(0, 12)}...</span>
                    </div>
                    <div className="flex justify-between py-3 border-b border-[#4b5563]">
                      <span className="text-gray-400">Email Address</span>
                      <span className="text-white">{profile.email}</span>
                    </div>
                    <div className="flex justify-between py-3 border-b border-[#4b5563]">
                      <span className="text-gray-400">Account Created</span>
                      <span className="text-white">{formatDate(profile.created_at)}</span>
                    </div>
                    <div className="flex justify-between py-3">
                      <span className="text-gray-400">Last Sign In</span>
                      <span className="text-white">{formatDate(profile.last_sign_in)}</span>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  custom={6}
                  initial="hidden"
                  animate="visible"
                  variants={fadeInVariants}
                  className="bg-[#1e293b] rounded-xl border border-[#4b5563] p-6"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-white">Payment Methods</h3>
                    <button className="flex items-center gap-2 px-3 py-1.5 bg-[#818cf8] text-white text-sm rounded-lg hover:bg-[#6366f1] transition-colors">
                      <Link className="w-4 h-4" />
                      Add New
                    </button>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center gap-4 p-4 bg-[#0f172a] rounded-xl border border-[#4b5563]">
                      <div className="w-12 h-8 bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg flex items-center justify-center">
                        <CreditCard className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <p className="text-white font-medium">•••• •••• •••• 4242</p>
                        <p className="text-sm text-gray-400">Expires 12/25</p>
                      </div>
                      <button className="p-2 text-gray-400 hover:text-red-400">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <p className="text-center text-gray-500 text-sm py-4">No other payment methods added yet</p>
                  </div>
                </motion.div>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}