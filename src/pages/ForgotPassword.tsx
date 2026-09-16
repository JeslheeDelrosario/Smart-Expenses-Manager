// src/pages/ForgotPassword.tsx

import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, ArrowLeft, KeyRound, CheckCircle2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { resetPassword } from "../services/auth";
import { colors as c } from "../lib/theme";

export default function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      setError("Please enter your email address.");
      return;
    }
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    setIsLoading(true);
    try {
      await resetPassword(email);
      setSent(true);
    } catch (err: unknown) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to send reset email. Please try again.",
      );
    } finally {
      setIsLoading(false);
    }
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
        {/* Back to login */}
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

            {sent ? (
              /* ── Confirmation state ── */
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
                <h1
                  className="text-2xl font-semibold tracking-[-0.035em] mb-3"
                  style={{ color: c.text }}
                >
                  Check your inbox
                </h1>
                <p className="text-sm leading-relaxed mb-6" style={{ color: c.textMuted }}>
                  We sent a password reset link to{" "}
                  <span style={{ color: c.text }} className="font-medium">{email}</span>.
                  {" "}The link expires in 1 hour.
                </p>
                <p className="text-xs mb-6" style={{ color: c.textFaint }}>
                  Didn't receive it? Check your spam folder or{" "}
                  <button
                    onClick={() => setSent(false)}
                    className="underline underline-offset-2 transition-colors"
                    style={{ color: c.primary }}
                  >
                    try again
                  </button>
                  .
                </p>
                <button
                  onClick={() => navigate("/login")}
                  className="w-full rounded-xl border py-3 text-sm font-medium transition-all duration-200 hover:bg-white/5"
                  style={{ borderColor: c.border, color: c.text }}
                >
                  Back to sign in
                </button>
              </motion.div>
            ) : (
              /* ── Request form ── */
              <>
                <div className="mb-7">
                  <div
                    className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl border"
                    style={{ background: `${c.primary}10`, borderColor: `${c.primary}25` }}
                  >
                    <KeyRound className="h-5 w-5" style={{ color: c.primary }} />
                  </div>
                  <h1
                    className="text-3xl font-semibold tracking-[-0.035em] sm:text-4xl"
                    style={{ color: c.text }}
                  >
                    Forgot password?
                  </h1>
                  <p className="mt-2 text-sm leading-relaxed" style={{ color: c.textMuted }}>
                    No worries. Enter your email and we'll send you a reset link.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Email */}
                  <div>
                    <label
                      htmlFor="forgot-email"
                      className="mb-2 block text-xs font-medium"
                      style={{ color: c.text }}
                    >
                      Email
                    </label>
                    <div className="relative">
                      <Mail
                        className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2"
                        style={{ color: c.textFaint }}
                      />
                      <input
                        id="forgot-email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        autoComplete="email"
                        autoFocus
                        disabled={isLoading}
                        className="w-full rounded-xl border py-3 pl-10 pr-4 text-sm outline-none transition-all duration-200"
                        style={{ background: `${c.bg}90`, borderColor: c.border, color: c.text }}
                        onFocus={(e) => {
                          e.currentTarget.style.borderColor = `${c.primary}70`;
                          e.currentTarget.style.boxShadow = `0 0 0 3px ${c.primary}10`;
                        }}
                        onBlur={(e) => {
                          e.currentTarget.style.borderColor = c.border;
                          e.currentTarget.style.boxShadow = "none";
                        }}
                      />
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
                    disabled={isLoading}
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
                        Sending...
                      </>
                    ) : (
                      "Send reset link"
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => navigate("/login")}
                    className="w-full rounded-xl border py-3 text-sm font-medium transition-all duration-200 hover:bg-white/5"
                    style={{ borderColor: c.border, color: c.text }}
                  >
                    Back to sign in
                  </button>
                </form>
              </>
            )}
          </div>
        </motion.div>
      </div>
    </main>
  );
}
