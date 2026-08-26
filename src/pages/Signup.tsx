// src/pages/Signup.tsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, Lock, User, ArrowRight, Eye, EyeOff } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { colors as c } from "../lib/theme";

export default function SignupPage() {
  const navigate = useNavigate();
  const { user, signUp } = useAuth();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (
      !formData.fullName ||
      !formData.email ||
      !formData.password ||
      !formData.confirmPassword
    ) {
      setError("Please complete all fields.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(formData.email)) {
      setError("Please enter a valid email address.");
      return;
    }

    // Enforce strong password requirements
    const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    if (!strongPasswordRegex.test(formData.password)) {
      setError("Password must be at least 8 characters with at least one uppercase letter, one lowercase letter, and one number.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords don't match.");
      return;
    }

    setIsLoading(true);

    try {
      await signUp(formData.email, formData.password, formData.fullName);

      setSuccess("Account created. Check your email to verify your account.");

      setFormData({
        fullName: "",
        email: "",
        password: "",
        confirmPassword: "",
      });

      setTimeout(() => {
        navigate("/login");
      }, 2500);
    } catch (err: unknown) {
      console.error("Signup error:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Unable to create your account. Please try again.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const inputStyle = {
    background: `${c.bg}90`,
    borderColor: c.border,
    color: c.text,
  };

  return (
    <main
      className="relative min-h-screen overflow-hidden flex items-center justify-center px-5 py-10"
      style={{ background: c.bg }}
    >
      {/* Ambient glow */}
      <div
        className="pointer-events-none absolute -top-40 left-1/2 h-137.5 w-187.5 -translate-x-1/2 rounded-full blur-[140px] opacity-[0.08]"
        style={{ background: c.primary }}
      />

      {/* Grid */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage: `
            linear-gradient(${c.text} 1px, transparent 1px),
            linear-gradient(90deg, ${c.text} 1px, transparent 1px)
          `,
          backgroundSize: "48px 48px",
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.5,
          ease: [0.22, 1, 0.36, 1],
        }}
        className="relative z-10 w-full max-w-110"
      >
        {/* Brand */}
        {/* <div className="mb-7 text-center">
          <button
            onClick={() => navigate("/")}
            className="inline-flex items-center gap-2.5"
          >
            <span
              className="flex h-9 w-9 items-center justify-center rounded-xl border"
              style={{
                background: `${c.primary}10`,
                borderColor: `${c.primary}25`,
                color: c.primary,
              }}
            >
              <span className="text-sm font-bold">◈</span>
            </span>

            <span
              className="text-base font-semibold tracking-tight"
              style={{ color: c.text }}
            >
              Smart Expenses
            </span>
          </button>
        </div> */}

        {/* Card */}
        <div
          className="rounded-3xl border p-7 sm:p-8 backdrop-blur-2xl"
          style={{
            background: `${c.card}cc`,
            borderColor: c.border,
            boxShadow: `0 30px 80px ${c.bg}80`,
          }}
        >
          <div className="mb-7">
            <h1
              className="text-2xl font-semibold tracking-tight"
              style={{ color: c.text }}
            >
              Create your account
            </h1>

            <p
              className="mt-2 text-sm leading-relaxed"
              style={{ color: c.textMuted }}
            >
              Start building a clearer picture of your finances.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4.5">
            {/* Full Name */}
            <div>
              <label
                htmlFor="fullName"
                className="mb-2 block text-sm font-medium"
                style={{ color: c.text }}
              >
                Full name
              </label>

              <div className="relative">
                <User
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4"
                  style={{ color: c.textFaint }}
                />

                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  autoComplete="name"
                  disabled={isLoading}
                  className="w-full rounded-xl border py-3 pl-10 pr-4 text-sm outline-none transition-all"
                  style={inputStyle}
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-medium"
                style={{ color: c.text }}
              >
                Email
              </label>

              <div className="relative">
                <Mail
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4"
                  style={{ color: c.textFaint }}
                />

                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  autoComplete="email"
                  disabled={isLoading}
                  className="w-full rounded-xl border py-3 pl-10 pr-4 text-sm outline-none transition-all"
                  style={inputStyle}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-sm font-medium"
                style={{ color: c.text }}
              >
                Password
              </label>

              <div className="relative">
                <Lock
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4"
                  style={{ color: c.textFaint }}
                />

                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Create a password"
                  autoComplete="new-password"
                  disabled={isLoading}
                  className="w-full rounded-xl border py-3 pl-10 pr-11 text-sm outline-none transition-all"
                  style={inputStyle}
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2"
                  style={{ color: c.textFaint }}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>

              <p className="mt-1.5 text-xs" style={{ color: c.textFaint }}>
                Use at least 8 characters.
              </p>
            </div>

            {/* Confirm Password */}
            <div>
              <label
                htmlFor="confirmPassword"
                className="mb-2 block text-sm font-medium"
                style={{ color: c.text }}
              >
                Confirm password
              </label>

              <div className="relative">
                <Lock
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4"
                  style={{ color: c.textFaint }}
                />

                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Repeat your password"
                  autoComplete="new-password"
                  disabled={isLoading}
                  className="w-full rounded-xl border py-3 pl-10 pr-11 text-sm outline-none transition-all"
                  style={inputStyle}
                />

                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2"
                  style={{ color: c.textFaint }}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-xl border px-4 py-3 text-sm"
                style={{
                  background: `${c.danger}0d`,
                  borderColor: `${c.danger}25`,
                  color: c.danger,
                }}
              >
                {error}
              </motion.div>
            )}

            {/* Success */}
            {success && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-xl border px-4 py-3 text-sm"
                style={{
                  background: `${c.success}0d`,
                  borderColor: `${c.success}25`,
                  color: c.success,
                }}
              >
                {success}
              </motion.div>
            )}

            {/* Submit */}
            <motion.button
              type="submit"
              disabled={isLoading}
              whileHover={!isLoading ? { y: -1 } : undefined}
              whileTap={!isLoading ? { scale: 0.99 } : undefined}
              className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold transition-all disabled:cursor-not-allowed disabled:opacity-60"
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
                    style={{
                      borderColor: `${c.bg}40`,
                      borderTopColor: c.bg,
                    }}
                  />
                  Creating account...
                </>
              ) : (
                <>
                  Create account
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </motion.button>
          </form>

          {/* Login */}
          <div className="mt-7 text-center">
            <p className="text-sm" style={{ color: c.textMuted }}>
              Already have an account?{" "}
              <button
                type="button"
                onClick={() => navigate("/login")}
                className="font-medium transition-colors"
                style={{ color: c.primary }}
              >
                Sign in
              </button>
            </p>
          </div>
        </div>

        {/* Terms */}
        <p
          className="mx-auto mt-5 max-w-sm text-center text-xs leading-relaxed"
          style={{ color: c.textFaint }}
        >
          By creating an account, you agree to our{" "}
          <button
            type="button"
            className="underline underline-offset-2"
            style={{ color: c.textMuted }}
          >
            Terms of Service
          </button>{" "}
          and{" "}
          <button
            type="button"
            className="underline underline-offset-2"
            style={{ color: c.textMuted }}
          >
            Privacy Policy
          </button>
          .
        </p>
      </motion.div>
    </main>
  );
}