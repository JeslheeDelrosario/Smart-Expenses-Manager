// src/pages/ResetPassword.tsx

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Lock, Eye, EyeOff, ArrowLeft, CheckCircle2, ShieldCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { updatePassword } from "../services/auth";
import { colors as c } from "../lib/theme";

export default function ResetPasswordPage() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  // Supabase PKCE: the deep-link from the email lands here; we wait for the
  // session to be established via the PASSWORD_RECOVERY event before allowing
  // the password form to be used.
  const [sessionReady, setSessionReady] = useState(false);
  const [sessionError, setSessionError] = useState(false);

  useEffect(() => {
    // If a session is already active (token exchanged by Supabase client on load) use it.
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setSessionReady(true);
      }
    });

    // Also listen for the PASSWORD_RECOVERY event which Supabase fires when
    // the magic-link token has been consumed.
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") {
        setSessionReady(true);
      }
    });

    // If after 5 s we still have no session the link is likely expired/invalid.
    const timer = setTimeout(() => {
      if (!sessionReady) setSessionError(true);
    }, 5000);

    return () => {
      subscription.unsubscribe();
      clearTimeout(timer);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords don't match.");
      return;
    }

    setIsLoading(true);
    try {
      await updatePassword(password);
      setDone(true);
      // Brief pause so the success state is visible before redirect
      setTimeout(() => navigate("/login", { state: { message: "Password updated! Sign in with your new password." } }), 2500);
    } catch (err: unknown) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to update password. The link may have expired.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Shared input focus/blur style helpers
  const onFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    e.currentTarget.style.borderColor = `${c.primary}70`;
    e.currentTarget.style.boxShadow = `0 0 0 3px ${c.primary}10`;
  };
  const onBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    e.currentTarget.style.borderColor = c.border;
    e.currentTarget.style.boxShadow = "none";
  };

  return (
    <main
      className="relative min-h-screen overflow-hidden flex items-center justify-center px-5 py-10"
      style={{ background: c.bg }}
    >
      {/* Background glow */}
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 h-150 w-200 -translate-x-1/2 -translate-y-1/2 rounded-full blur-[140px]"
        style={{ background: c.primary, opacity: 0.06 }}
      />

      {/* Grid */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage: `
            linear-gradient(${c.text} 1px, transparent 1px),
            linear-gradient(90deg, ${c.text} 1px, transparent 1px)
          `,
          backgroundSize: "56px 56px",
        }}
      />

      <div className="relative z-10 w-full max-w-md">
        {/* Back link */}
        <motion.button
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          onClick={() => navigate("/login")}
          className="mb-7 flex items-center gap-2 text-sm transition-colors"
          style={{ color: c.textMuted }}
          onMouseEnter={(e) => { e.currentTarget.style.color = c.text; }}
          onMouseLeave={(e) => { e.currentTarget.style.color = c.textMuted; }}
        >
          <ArrowLeft className="h-4 w-4" />
          Back to sign in
        </motion.button>

        {/* Card */}
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="relative overflow-hidden rounded-3xl border p-7 sm:p-9 backdrop-blur-2xl"
          style={{
            background: `${c.card}cc`,
            borderColor: c.border,
            boxShadow: `0 30px 80px ${c.bg}80, 0 0 60px ${c.primary}06`,
          }}
        >
          {/* Card top glow */}
          <div
            className="pointer-events-none absolute left-1/2 top-0 h-40 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full blur-[80px]"
            style={{ background: c.primary, opacity: 0.08 }}
          />

          <div className="relative">
            {/* Brand */}
            <div className="mb-8 flex items-center gap-3">
              <div
                className="flex h-10 w-10 items-center justify-center rounded-xl border"
                style={{
                  background: `${c.primary}10`,
                  borderColor: `${c.primary}25`,
                  color: c.primary,
                  boxShadow: `0 0 20px ${c.primary}10`,
                }}
              >
                <span className="text-lg font-semibold">◈</span>
              </div>
              <div>
                <p className="text-sm font-semibold" style={{ color: c.text }}>Smart Expenses</p>
                <p className="text-[11px]" style={{ color: c.textFaint }}>Personal finance, simplified.</p>
              </div>
            </div>

            {/* ── Success state ── */}
            {done ? (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-center py-4"
              >
                <div
                  className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border"
                  style={{ background: `${c.success}10`, borderColor: `${c.success}25` }}
                >
                  <CheckCircle2 className="h-8 w-8" style={{ color: c.success }} />
                </div>
                <h1 className="text-2xl font-semibold tracking-[-0.035em] mb-3" style={{ color: c.text }}>
                  Password updated!
                </h1>
                <p className="text-sm leading-relaxed" style={{ color: c.textMuted }}>
                  Redirecting you to sign in…
                </p>
              </motion.div>

            /* ── Invalid / expired session ── */
            ) : sessionError && !sessionReady ? (
              <div className="text-center py-4">
                <h1 className="text-xl font-semibold mb-3" style={{ color: c.text }}>
                  Link expired or invalid
                </h1>
                <p className="text-sm mb-6" style={{ color: c.textMuted }}>
                  This reset link is no longer valid. Please request a new one.
                </p>
                <button
                  onClick={() => navigate("/forgot-password")}
                  className="w-full rounded-xl py-3.5 text-sm font-semibold transition-all duration-200 hover:scale-[1.01]"
                  style={{ background: c.primary, color: c.bg, boxShadow: `0 10px 30px ${c.primary}25` }}
                >
                  Request new link
                </button>
              </div>

            ) : (
              /* ── Password form ── */
              <>
                <div className="mb-7">
                  <div
                    className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl border"
                    style={{ background: `${c.primary}10`, borderColor: `${c.primary}25` }}
                  >
                    <Lock className="h-5 w-5" style={{ color: c.primary }} />
                  </div>
                  <h1
                    className="text-3xl font-semibold tracking-[-0.035em] sm:text-4xl"
                    style={{ color: c.text }}
                  >
                    Set new password
                  </h1>
                  <p className="mt-2 text-sm leading-relaxed" style={{ color: c.textMuted }}>
                    Choose a strong password you haven't used before.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* New password */}
                  <div>
                    <label
                      htmlFor="reset-password"
                      className="mb-2 block text-xs font-medium"
                      style={{ color: c.text }}
                    >
                      New password
                    </label>
                    <div className="relative">
                      <Lock
                        className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2"
                        style={{ color: c.textFaint }}
                      />
                      <input
                        id="reset-password"
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="At least 8 characters"
                        autoComplete="new-password"
                        autoFocus
                        disabled={isLoading || !sessionReady}
                        className="w-full rounded-xl border py-3 pl-10 pr-11 text-sm outline-none transition-all duration-200"
                        style={{ background: `${c.bg}90`, borderColor: c.border, color: c.text }}
                        onFocus={onFocus}
                        onBlur={onBlur}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2"
                        style={{ color: c.textFaint }}
                        aria-label={showPassword ? "Hide password" : "Show password"}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Confirm password */}
                  <div>
                    <label
                      htmlFor="reset-confirm"
                      className="mb-2 block text-xs font-medium"
                      style={{ color: c.text }}
                    >
                      Confirm password
                    </label>
                    <div className="relative">
                      <Lock
                        className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2"
                        style={{ color: c.textFaint }}
                      />
                      <input
                        id="reset-confirm"
                        type={showConfirmPassword ? "text" : "password"}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Repeat your password"
                        autoComplete="new-password"
                        disabled={isLoading || !sessionReady}
                        className="w-full rounded-xl border py-3 pl-10 pr-11 text-sm outline-none transition-all duration-200"
                        style={{ background: `${c.bg}90`, borderColor: c.border, color: c.text }}
                        onFocus={onFocus}
                        onBlur={onBlur}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2"
                        style={{ color: c.textFaint }}
                        aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
                      >
                        {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Error */}
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="rounded-xl border px-4 py-3 text-xs"
                      style={{
                        background: `${c.danger}08`,
                        borderColor: `${c.danger}20`,
                        color: c.danger,
                      }}
                    >
                      {error}
                    </motion.div>
                  )}

                  {/* Submit */}
                  <button
                    type="submit"
                    disabled={isLoading || !sessionReady}
                    className="flex w-full items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-semibold transition-all duration-200 hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-50"
                    style={{
                      background: c.primary,
                      color: c.bg,
                      boxShadow: `0 10px 30px ${c.primary}25`,
                    }}
                  >
                    {isLoading ? (
                      <>
                        <span
                          className="h-4 w-4 animate-spin rounded-full border-2"
                          style={{ borderColor: `${c.bg}40`, borderTopColor: c.bg }}
                        />
                        Updating…
                      </>
                    ) : !sessionReady ? (
                      "Verifying link…"
                    ) : (
                      "Update password"
                    )}
                  </button>
                </form>

                {/* Security note */}
                <div
                  className="mt-6 flex items-center justify-center gap-2 text-center"
                  style={{ color: c.textFaint }}
                >
                  <ShieldCheck className="h-3.5 w-3.5" />
                  <span className="text-[11px]">Your new password is encrypted and stored securely.</span>
                </div>
              </>
            )}
          </div>
        </motion.div>
      </div>
    </main>
  );
}
