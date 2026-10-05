// src/pages/Settings.tsx
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Menu,
  Bell,
  Shield,
  Download,
  Trash2,
  Globe,
  Moon,
  Lock,
  Smartphone,
  AlertTriangle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { SUPPORTED_CURRENCIES } from "../lib/currency";
import { updatePassword } from "../services/auth";
import { requestPushPermission } from "../services/push.service";
import { useToast } from "../components/useToast";
import ToastContainer from "../components/ToastContainer";
import AppLayout, { MobileMenuButton } from "../components/AppLayout";
import { usePreferences } from "../hooks/usePreferences";

// Toggle switch component - moved outside to fix "created during render" error
const Toggle = ({ enabled, onChange, label }: { enabled: boolean; onChange: () => void; label: string }) => (
  <button
    type="button"
    onClick={onChange}
    role="switch"
    aria-checked={enabled}
    aria-label={label}
    className={`relative h-6 w-11 shrink-0 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#818cf8]/60 focus:ring-offset-2 focus:ring-offset-[#0f172a] ${enabled ? "bg-[#818cf8]" : "bg-[#334155]"}`}
  >
    <span
      className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform duration-200 ${enabled ? "translate-x-5" : "translate-x-0"}`}
    />
  </button>
);

export default function SettingsPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("preferences");
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const { preferences, updatePreference, isLoading: preferencesLoading } = usePreferences();

  // Change password state
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const { toasts, toast, dismiss } = useToast();

  const tabs = [
    { id: "preferences", label: "Preferences" },
    { id: "notifications", label: "Notifications" },
    { id: "security", label: "Security" },
    { id: "danger", label: "Danger Zone" },
  ];

  const currencies = SUPPORTED_CURRENCIES;

  const handleToggle = async (key: keyof typeof preferences, currentValue: boolean) => {
    await updatePreference(key, !currentValue);
  };

  const handleCurrencyChange = async (currencyCode: string) => {
    await updatePreference("currency", currencyCode);
    const currencyLabel = currencies.find((currency) => currency.code === currencyCode)?.label ?? currencyCode;
    toast(`Currency changed to ${currencyLabel}.`, "success");
  };

  const handlePushToggle = async () => {
    if (!preferences.push_notifications) {
      const permission = await requestPushPermission();
      if (permission === "denied") {
        toast("Browser push notifications are disabled. Please enable them in your browser settings.", "warning");
        return;
      }
    }

    await updatePreference("push_notifications", !preferences.push_notifications);
  };



  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate("/login");
      }
    };
    checkAuth();
  }, [navigate]);

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
    <AppLayout>

      {/* Main Content */}
      <main className="flex-1 min-w-0">
        {/* Header */}
        <header className="border-b border-[#334155] bg-[#1e293b]/70 px-4 py-4 backdrop-blur-sm sm:px-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <MobileMenuButton
                className="lg:hidden p-2 text-gray-400 hover:text-white"
              >
                <Menu className="w-6 h-6" />
              </MobileMenuButton>
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-white">Settings</h1>
                <p className="mt-0.5 text-sm text-gray-400">Personalize your workspace and notifications</p>
              </div>
            </div>
          </div>
        </header>

        <div className="p-4 sm:p-6">
          {/* Tabs */}
          <div className="mb-6 flex gap-1 overflow-x-auto border-b border-[#334155] pb-1" role="tablist" aria-label="Settings sections">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={activeTab === tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`whitespace-nowrap rounded-t-lg px-3 py-2.5 text-sm font-medium transition-colors sm:px-4 ${activeTab === tab.id
                    ? "border border-[#334155] border-b-[#0f172a] bg-[#0f172a] text-[#a5b4fc]"
                    : "text-gray-400 hover:bg-[#1e293b] hover:text-white"
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
              className="grid max-w-4xl grid-cols-1 gap-5 lg:grid-cols-2"
            >
              <div className="rounded-2xl border border-[#334155] bg-[#1e293b] p-5 shadow-xl shadow-black/10 sm:p-6">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <Globe className="w-5 h-5 text-[#818cf8]" />
                  Regional Settings
                </h3>
                <div className="space-y-0 divide-y divide-[#334155]">
                  <div className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-white font-medium">Currency</p>
                      <p className="text-sm text-gray-400">Select your primary currency</p>
                    </div>
                    <select
                      disabled={preferencesLoading}
                      value={preferences.currency}
                      onChange={(e) => void handleCurrencyChange(e.target.value)}
                      className="w-full sm:w-auto px-3 py-2 bg-[#0f172a] border border-[#4b5563] rounded-lg text-white text-sm focus:outline-none focus:border-[#818cf8] disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {currencies.map((c) => (
                        <option key={c.code} value={c.code}>{c.label}</option>
                      ))}
                    </select>
                  </div>
                  <div className="flex items-center justify-between gap-4 py-4">
                    <div>
                      <p className="text-white font-medium">Dark Mode</p>
                      <p className="text-sm text-gray-400">Use dark theme across the app</p>
                    </div>
                    <Toggle
                      label="Toggle dark mode"
                      enabled={preferences.dark_mode}
                      onChange={() => void handleToggle("dark_mode", preferences.dark_mode)}
                    />
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-[#334155] bg-[#1e293b] p-5 shadow-xl shadow-black/10 sm:p-6">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <Moon className="w-5 h-5 text-[#818cf8]" />
                  Appearance
                </h3>
                <div className="divide-y divide-[#334155]">
                  <div className="flex items-center justify-between gap-4 py-4">
                    <div>
                      <p className="text-white font-medium">Animations</p>
                      <p className="text-sm text-gray-400">Enable smooth animations</p>
                    </div>
                    <Toggle
                      label="Toggle animations"
                      enabled={preferences.animations_enabled}
                      onChange={() => void handleToggle("animations_enabled", preferences.animations_enabled)}
                    />
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
              className="max-w-3xl space-y-5"
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
                    <Toggle
                      label="Toggle email notifications"
                      enabled={preferences.email_notifications}
                      onChange={() => void handleToggle("email_notifications", preferences.email_notifications)}
                    />
                  </div>
                  <div className="flex items-center justify-between py-3 border-b border-[#4b5563]">
                    <div>
                      <p className="text-white font-medium">Weekly Summary</p>
                      <p className="text-sm text-gray-400">Get a weekly spending report</p>
                    </div>
                    <Toggle
                      label="Toggle weekly summaries"
                      enabled={preferences.weekly_summaries}
                      onChange={() => void handleToggle("weekly_summaries", preferences.weekly_summaries)}
                    />
                  </div>
                  <div className="flex items-center justify-between py-3">
                    <div>
                      <p className="text-white font-medium">Expense Logging Reminders</p>
                      <p className="text-sm text-gray-400">Remind you to log your expenses</p>
                    </div>
                    <Toggle
                      label="Toggle expense reminders"
                      enabled={preferences.expense_reminders}
                      onChange={() => void handleToggle("expense_reminders", preferences.expense_reminders)}
                    />
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
                  <Toggle
                    label="Toggle push notifications"
                    enabled={preferences.push_notifications}
                    onChange={() => void handlePushToggle()}
                  />
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
                    <Toggle
                      label="Toggle two-factor authentication"
                      enabled={twoFactorEnabled}
                      onChange={() => setTwoFactorEnabled(!twoFactorEnabled)}
                    />
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
        <ToastContainer toasts={toasts} dismiss={dismiss} />
      </main>
    </AppLayout>
  );
}