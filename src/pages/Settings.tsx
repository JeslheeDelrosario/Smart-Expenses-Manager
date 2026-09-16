// src/pages/Settings.tsx
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Menu,
  Settings,
  LayoutDashboard,
  Wallet,
  PieChart,
  Receipt,
  LogOut,
  Bell,
  Shield,
  Download,
  Trash2,
  Globe,
  Moon,
  Lock,
  Smartphone,
  AlertTriangle,
  ArrowUpRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { updatePassword } from "../services/auth";
import { useToast } from "../components/useToast";

// Toggle switch component - moved outside to fix "created during render" error
const Toggle = ({ enabled, onChange }: { enabled: boolean; onChange: () => void }) => (
  <button
    onClick={onChange}
    className={`relative w-12 h-6 rounded-full transition-colors duration-200 ${enabled ? "bg-[#818cf8]" : "bg-[#4b5563]"}`}
  >
    <span
      className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform duration-200 ${enabled ? "translate-x-7" : "translate-x-1"}`}
    />
  </button>
);

export default function SettingsPage() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeNav, setActiveNav] = useState("settings");
  const [activeTab, setActiveTab] = useState("preferences");
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(false);
  const [weeklySummary, setWeeklySummary] = useState(true);
  const [expenseReminders, setExpenseReminders] = useState(true);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [selectedCurrency, setSelectedCurrency] = useState("PHP");

  // Change password state
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const { toast } = useToast();

  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
    { id: "transactions", label: "Transactions", icon: Receipt, path: "/transactions" },
    { id: "budgets", label: "Budgets", icon: PieChart, path: "/budgets" },
    { id: "income", label: "Income", icon: ArrowUpRight, path: "/income" },
    { id: "account", label: "Account", icon: Wallet, path: "/account" },
    { id: "settings", label: "Settings", icon: Settings, path: "/settings" },
  ];

  const tabs = [
    { id: "preferences", label: "Preferences" },
    { id: "notifications", label: "Notifications" },
    { id: "security", label: "Security" },
    { id: "danger", label: "Danger Zone" },
  ];

  const currencies = [
    { code: "PHP", name: "Philippine Peso (₱)" },
    { code: "USD", name: "US Dollar ($)" },
    { code: "EUR", name: "Euro (€)" },
    { code: "GBP", name: "British Pound (£)" },
    { code: "JPY", name: "Japanese Yen (¥)" },
  ];



  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate("/login");
      }
    };
    checkAuth();
  }, [navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 8) {
      toast("New password must be at least 8 characters.", "warning");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast("New passwords don't match.", "warning");
      return;
    }
    setIsChangingPassword(true);
    try {
      await updatePassword(newPassword);
      toast("Password updated successfully.", "success");
      setShowChangePassword(false);
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: unknown) {
      toast(
        err instanceof Error ? err.message : "Failed to update password.",
        "error",
      );
    } finally {
      setIsChangingPassword(false);
    }
  };

  const handleExportData = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    
    // Export all data as JSON
    const { data: expenses } = await supabase.from("expenses").select("*").eq("user_id", user.id);
    const { data: categories } = await supabase.from("categories").select("*").eq("user_id", user.id);
    
    const exportData = { expenses, categories, exportedAt: new Date().toISOString() };
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `expense-data-${new Date().toISOString().split("T")[0]}.json`;
    a.click();
  };

  const handleDeleteAccount = async () => {
    if (confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
      // Note: Deleting users requires backend function, this is a placeholder
      alert("Account deletion would be implemented with a Supabase Edge Function");
    }
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
              <h1 className="text-2xl font-bold text-white">Settings</h1>
            </div>
          </div>
        </header>

        <div className="p-6">
          {/* Tabs */}
          <div className="flex flex-wrap gap-2 mb-6 border-b border-[#4b5563] pb-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${activeTab === tab.id
                    ? "bg-[#0f172a] text-[#818cf8] border border-[#4b5563] border-b-[#0f172a]"
                    : "text-gray-400 hover:text-white"
                  }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Preferences Tab */}
          {activeTab === "preferences" && (
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeInVariants}
              custom={0}
              className="max-w-2xl space-y-6"
            >
              <div className="bg-[#1e293b] rounded-xl border border-[#4b5563] p-6">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <Globe className="w-5 h-5 text-[#818cf8]" />
                  Regional Settings
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between py-3 border-b border-[#4b5563]">
                    <div>
                      <p className="text-white font-medium">Currency</p>
                      <p className="text-sm text-gray-400">Select your primary currency</p>
                    </div>
                    <select
                      value={selectedCurrency}
                      onChange={(e) => setSelectedCurrency(e.target.value)}
                      className="px-4 py-2 bg-[#0f172a] border border-[#4b5563] rounded-lg text-white focus:outline-none focus:border-[#818cf8]"
                    >
                      {currencies.map((c) => (
                        <option key={c.code} value={c.code}>{c.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="flex items-center justify-between py-3">
                    <div>
                      <p className="text-white font-medium">Dark Mode</p>
                      <p className="text-sm text-gray-400">Use dark theme across the app</p>
                    </div>
                    <Toggle enabled={darkMode} onChange={() => setDarkMode(!darkMode)} />
                  </div>
                </div>
              </div>

              <div className="bg-[#1e293b] rounded-xl border border-[#4b5563] p-6">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <Moon className="w-5 h-5 text-[#818cf8]" />
                  Appearance
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between py-3 border-b border-[#4b5563]">
                    <div>
                      <p className="text-white font-medium">Animations</p>
                      <p className="text-sm text-gray-400">Enable smooth animations</p>
                    </div>
                    <Toggle enabled={true} onChange={() => {}} />
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Notifications Tab */}
          {activeTab === "notifications" && (
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeInVariants}
              custom={0}
              className="max-w-2xl space-y-6"
            >
              <div className="bg-[#1e293b] rounded-xl border border-[#4b5563] p-6">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <Bell className="w-5 h-5 text-[#818cf8]" />
                  Email Notifications
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between py-3 border-b border-[#4b5563]">
                    <div>
                      <p className="text-white font-medium">Enable Email Notifications</p>
                      <p className="text-sm text-gray-400">Receive important updates via email</p>
                    </div>
                    <Toggle enabled={emailNotifications} onChange={() => setEmailNotifications(!emailNotifications)} />
                  </div>
                  <div className="flex items-center justify-between py-3 border-b border-[#4b5563]">
                    <div>
                      <p className="text-white font-medium">Weekly Summary</p>
                      <p className="text-sm text-gray-400">Get a weekly spending report</p>
                    </div>
                    <Toggle enabled={weeklySummary} onChange={() => setWeeklySummary(!weeklySummary)} />
                  </div>
                  <div className="flex items-center justify-between py-3">
                    <div>
                      <p className="text-white font-medium">Expense Logging Reminders</p>
                      <p className="text-sm text-gray-400">Remind you to log your expenses</p>
                    </div>
                    <Toggle enabled={expenseReminders} onChange={() => setExpenseReminders(!expenseReminders)} />
                  </div>
                </div>
              </div>

              <div className="bg-[#1e293b] rounded-xl border border-[#4b5563] p-6">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <Smartphone className="w-5 h-5 text-[#818cf8]" />
                  Push Notifications
                </h3>
                <div className="flex items-center justify-between py-3">
                  <div>
                    <p className="text-white font-medium">Enable Push Notifications</p>
                    <p className="text-sm text-gray-400">Receive browser push notifications</p>
                  </div>
                  <Toggle enabled={pushNotifications} onChange={() => setPushNotifications(!pushNotifications)} />
                </div>
              </div>
            </motion.div>
          )}

          {/* Security Tab */}
          {activeTab === "security" && (
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeInVariants}
              custom={0}
              className="max-w-2xl space-y-6"
            >
              <div className="bg-[#1e293b] rounded-xl border border-[#4b5563] p-6">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <Shield className="w-5 h-5 text-[#818cf8]" />
                  Authentication
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between py-3 border-b border-[#4b5563]">
                    <div>
                      <p className="text-white font-medium">Two-Factor Authentication</p>
                      <p className="text-sm text-gray-400">Add an extra layer of security</p>
                    </div>
                    <Toggle enabled={twoFactorEnabled} onChange={() => setTwoFactorEnabled(!twoFactorEnabled)} />
                  </div>
                  <div className="flex items-center justify-between py-3">
                    <div>
                      <p className="text-white font-medium">Change Password</p>
                      <p className="text-sm text-gray-400">Update your account password</p>
                    </div>
                    <button
                      onClick={() => setShowChangePassword(!showChangePassword)}
                      className="px-4 py-2 bg-[#334155] text-white rounded-lg hover:bg-[#475569] transition-colors"
                    >
                      <Lock className="w-4 h-4 inline mr-2" />
                      {showChangePassword ? "Cancel" : "Change"}
                    </button>
                  </div>

                  {/* Inline change-password form */}
                  {showChangePassword && (
                    <motion.form
                      onSubmit={handleChangePassword}
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.25 }}
                      className="mt-2 space-y-4 pt-4 border-t border-[#4b5563]"
                    >
                      {/* New password */}
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">New Password</label>
                        <div className="relative">
                          <input
                            type={showNewPassword ? "text" : "password"}
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            placeholder="At least 8 characters"
                            autoComplete="new-password"
                            disabled={isChangingPassword}
                            className="w-full px-4 py-3 pr-11 bg-[#0f172a] border border-[#4b5563] rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#818cf8]"
                          />
                          <button
                            type="button"
                            onClick={() => setShowNewPassword(!showNewPassword)}
                            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                            aria-label={showNewPassword ? "Hide password" : "Show password"}
                          >
                            {showNewPassword
                              ? <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
                              : <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                            }
                          </button>
                        </div>
                        {/* Strength indicator */}
                        {newPassword && (
                          <div className="mt-2 flex gap-1">
                            {[8, 12, 16].map((threshold, i) => (
                              <div
                                key={i}
                                className={`h-1 flex-1 rounded-full transition-colors ${
                                  newPassword.length >= threshold
                                    ? i === 0 ? "bg-red-400" : i === 1 ? "bg-amber-400" : "bg-green-400"
                                    : "bg-[#334155]"
                                }`}
                              />
                            ))}
                            <span className="text-xs text-gray-400 ml-1">
                              {newPassword.length < 8 ? "Too short" : newPassword.length < 12 ? "Weak" : newPassword.length < 16 ? "Good" : "Strong"}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Confirm new password */}
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Confirm New Password</label>
                        <div className="relative">
                          <input
                            type={showConfirmPassword ? "text" : "password"}
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="Repeat new password"
                            autoComplete="new-password"
                            disabled={isChangingPassword}
                            className={`w-full px-4 py-3 pr-11 bg-[#0f172a] border rounded-lg text-white placeholder-gray-400 focus:outline-none transition-colors ${
                              confirmPassword && confirmPassword !== newPassword
                                ? "border-red-400/60 focus:border-red-400"
                                : "border-[#4b5563] focus:border-[#818cf8]"
                            }`}
                          />
                          <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                            aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
                          >
                            {showConfirmPassword
                              ? <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
                              : <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                            }
                          </button>
                        </div>
                        {confirmPassword && confirmPassword !== newPassword && (
                          <p className="mt-1 text-xs text-red-400">Passwords don't match</p>
                        )}
                      </div>

                      <div className="flex gap-3 pt-2">
                        <button
                          type="button"
                          onClick={() => { setShowChangePassword(false); setNewPassword(""); setConfirmPassword(""); }}
                          className="flex-1 px-4 py-2.5 border border-[#4b5563] text-gray-300 rounded-lg hover:bg-[#334155] transition-colors text-sm"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          disabled={isChangingPassword}
                          className="flex-1 px-4 py-2.5 bg-[#818cf8] text-white rounded-lg hover:bg-[#6366f1] transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                          {isChangingPassword ? (
                            <>
                              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938V17.29z" /></svg>
                              Updating...
                            </>
                          ) : "Update Password"}
                        </button>
                      </div>
                    </motion.form>
                  )}
                </div>
              </div>

              <div className="bg-[#1e293b] rounded-xl border border-[#4b5563] p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Active Sessions</h3>
                <div className="space-y-4">
                  <div className="p-4 bg-[#0f172a] rounded-xl border border-[#4b5563]">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-white font-medium">Current Browser</p>
                        <p className="text-sm text-gray-400">Windows • Chrome • 127.0.0.1</p>
                      </div>
                      <span className="px-2 py-1 bg-green-400/20 text-green-400 text-xs font-medium rounded-full">
                        Active Now
                      </span>
                    </div>
                  </div>
                  <button className="w-full px-4 py-3 border border-[#4b5563] text-red-400 rounded-lg hover:bg-red-400/10 transition-colors">
                    Logout from all other devices
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* Danger Zone Tab */}
          {activeTab === "danger" && (
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeInVariants}
              custom={0}
              className="max-w-2xl space-y-6"
            >
              <div className="bg-[#1e293b] rounded-xl border border-red-500/50 p-6">
                <h3 className="text-lg font-semibold text-red-400 mb-4 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5" />
                  Danger Zone
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between py-3 border-b border-[#4b5563]">
                    <div>
                      <p className="text-white font-medium">Export All Data</p>
                      <p className="text-sm text-gray-400">Download all your data as JSON</p>
                    </div>
                    <button
                      onClick={handleExportData}
                      className="flex items-center gap-2 px-4 py-2 bg-[#334155] text-white rounded-lg hover:bg-[#475569] transition-colors"
                    >
                      <Download className="w-4 h-4" />
                      Export
                    </button>
                  </div>
                  <div className="flex items-center justify-between py-3">
                    <div>
                      <p className="text-white font-medium">Delete Account</p>
                      <p className="text-sm text-gray-400">Permanently delete your account and all data</p>
                    </div>
                    <button
                      onClick={handleDeleteAccount}
                      className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </main>
    </div>
  );
}