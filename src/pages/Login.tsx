// src/pages/Login.tsx

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Mail,
  Lock,
  LogIn,
  Eye,
  EyeOff,
  ArrowLeft,
  ShieldCheck,
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { colors as c } from "../lib/theme";

function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, signIn, signInWithGoogle } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [error, setError] = useState("");
  // Success message passed via navigate state (e.g., after a password reset)
  const successMessage = (location.state as { message?: string } | null)?.message ?? "";

  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setError("");

    if (!email || !password) {
      setError("Enter your email and password to continue.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    setIsLoading(true);

    try {
      await signIn(email, password);

      setEmail("");
      setPassword("");

      navigate("/dashboard");
    } catch (err: unknown) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to sign in. Please check your credentials and try again.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError("");
    setIsGoogleLoading(true);
    try {
      await signInWithGoogle();
    } catch (err: unknown) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to sign in with Google. Please try again.",
      );
    } finally {
      setIsGoogleLoading(false);
    }
  };

  return (
    <main
      className="relative min-h-screen overflow-hidden flex items-center justify-center px-5 py-10"
      style={{
        background: c.bg,
      }}
    >
      {/* ================================================== */}
      {/* BACKGROUND */}
      {/* ================================================== */}

      <div
        className="
          pointer-events-none
          absolute
          left-1/2
          top-1/2
          h-150
          w-200
          -translate-x-1/2
          -translate-y-1/2
          rounded-full
          blur-[140px]
        "
        style={{
          background: c.primary,
          opacity: 0.06,
        }}
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

      {/* Decorative shape */}

      <motion.div
        initial={{
          opacity: 0,
          rotate: -12,
          x: -80,
        }}
        animate={{
          opacity: 1,
          rotate: -8,
          x: 0,
        }}
        transition={{
          duration: 1.2,
          ease: [0.23, 0.86, 0.39, 0.96],
        }}
        className="
          pointer-events-none
          absolute
          -left-40
          top-[18%]
          hidden
          h-32
          w-125
          rounded-full
          border
          lg:block
        "
        style={{
          background: `linear-gradient(
            90deg,
            ${c.primary}12,
            transparent
          )`,
          borderColor: `${c.text}10`,
          boxShadow: `0 8px 40px ${c.primary}08`,
        }}
      />

      <motion.div
        initial={{
          opacity: 0,
          rotate: 12,
          x: 80,
        }}
        animate={{
          opacity: 1,
          rotate: 8,
          x: 0,
        }}
        transition={{
          duration: 1.2,
          delay: 0.15,
          ease: [0.23, 0.86, 0.39, 0.96],
        }}
        className="
          pointer-events-none
          absolute
          -right-40
          bottom-[18%]
          hidden
          h-28
          w-112.5
          rounded-full
          border
          lg:block
        "
        style={{
          background: `linear-gradient(
            90deg,
            transparent,
            ${c.primary}10
          )`,
          borderColor: `${c.text}10`,
        }}
      />

      {/* ================================================== */}
      {/* CONTENT */}
      {/* ================================================== */}

      <div className="relative z-10 w-full max-w-md">
        {/* Back to landing page */}

        <motion.button
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          onClick={() => navigate("/")}
          className="
            mb-7
            flex
            items-center
            gap-2
            text-sm
            transition-colors
          "
          style={{
            color: c.textMuted,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = c.text;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = c.textMuted;
          }}
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Smart Expenses
        </motion.button>

        {/* ================================================== */}
        {/* LOGIN CARD */}
        {/* ================================================== */}

        <motion.div
          initial={{
            opacity: 0,
            y: 20,
            scale: 0.98,
          }}
          animate={{
            opacity: 1,
            y: 0,
            scale: 1,
          }}
          transition={{
            duration: 0.7,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="
            relative
            overflow-hidden
            rounded-3xl
            border
            p-7
            sm:p-9
            backdrop-blur-2xl
          "
          style={{
            background: `${c.card}cc`,
            borderColor: c.border,
            boxShadow: `
              0 30px 80px ${c.bg}80,
              0 0 60px ${c.primary}06
            `,
          }}
        >
          {/* Card glow */}

          <div
            className="
              pointer-events-none
              absolute
              left-1/2
              top-0
              h-40
              w-72
              -translate-x-1/2
              -translate-y-1/2
              rounded-full
              blur-[80px]
            "
            style={{
              background: c.primary,
              opacity: 0.08,
            }}
          />

          <div className="relative">
            {/* ================================================== */}
            {/* BRAND */}
            {/* ================================================== */}

            <div className="mb-8 flex items-center gap-3">
              <div
                className="
                  flex
                  h-10
                  w-10
                  items-center
                  justify-center
                  rounded-xl
                  border
                "
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
                <p
                  className="text-sm font-semibold"
                  style={{
                    color: c.text,
                  }}
                >
                  Smart Expenses
                </p>

                <p
                  className="text-[11px]"
                  style={{
                    color: c.textFaint,
                  }}
                >
                  Personal finance, simplified.
                </p>
              </div>
            </div>

            {/* ================================================== */}
            {/* HEADER */}
            {/* ================================================== */}

            <div className="mb-7">
              <h1
                className="
                  text-3xl
                  font-semibold
                  tracking-[-0.035em]
                  sm:text-4xl
                "
                style={{
                  color: c.text,
                }}
              >
                Welcome back.
              </h1>

              <p
                className="mt-2 text-sm leading-relaxed"
                style={{
                  color: c.textMuted,
                }}
              >
                Sign in to pick up where you left off.
              </p>
            </div>

            {/* ================================================== */}
            {/* FORM */}
            {/* ================================================== */}

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email */}

              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-xs font-medium"
                  style={{
                    color: c.text,
                  }}
                >
                  Email
                </label>

                <div className="relative">
                  <Mail
                    className="
                      pointer-events-none
                      absolute
                      left-3.5
                      top-1/2
                      h-4
                      w-4
                      -translate-y-1/2
                    "
                    style={{
                      color: c.textFaint,
                    }}
                  />

                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    autoComplete="email"
                    disabled={isLoading}
                    className="
                      w-full
                      rounded-xl
                      border
                      py-3
                      pl-10
                      pr-4
                      text-sm
                      outline-none
                      transition-all
                      duration-200
                    "
                    style={{
                      background: `${c.bg}90`,
                      borderColor: c.border,
                      color: c.text,
                    }}
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

              {/* Password */}

              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label
                    htmlFor="password"
                    className="text-xs font-medium"
                    style={{
                      color: c.text,
                    }}
                  >
                    Password
                  </label>

                  <button
                    type="button"
                    onClick={() => navigate("/forgot-password")}
                    className="text-xs transition-colors"
                    style={{
                      color: c.primary,
                    }}
                  >
                    Forgot password?
                  </button>
                </div>

                <div className="relative">
                  <Lock
                    className="
                      pointer-events-none
                      absolute
                      left-3.5
                      top-1/2
                      h-4
                      w-4
                      -translate-y-1/2
                    "
                    style={{
                      color: c.textFaint,
                    }}
                  />

                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    disabled={isLoading}
                    className="
                      w-full
                      rounded-xl
                      border
                      py-3
                      pl-10
                      pr-11
                      text-sm
                      outline-none
                      transition-all
                      duration-200
                    "
                    style={{
                      background: `${c.bg}90`,
                      borderColor: c.border,
                      color: c.text,
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = `${c.primary}70`;
                      e.currentTarget.style.boxShadow = `0 0 0 3px ${c.primary}10`;
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = c.border;
                      e.currentTarget.style.boxShadow = "none";
                    }}
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="
                      absolute
                      right-3.5
                      top-1/2
                      -translate-y-1/2
                    "
                    style={{
                      color: c.textFaint,
                    }}
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Success banner (e.g. after password reset) */}
              {successMessage && (
                <motion.div
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-xl border px-4 py-3 text-xs"
                  style={{
                    background: `${c.success}08`,
                    borderColor: `${c.success}20`,
                    color: c.success,
                  }}
                >
                  {successMessage}
                </motion.div>
              )}

              {/* Error */}
              {error && (
                <motion.div
                  initial={{
                    opacity: 0,
                    y: -5,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  className="
                    rounded-xl
                    border
                    px-4
                    py-3
                    text-xs
                  "
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
                className="
                  flex
                  w-full
                  items-center
                  justify-center
                  gap-2
                  rounded-xl
                  py-3.5
                  text-sm
                  font-semibold
                  transition-all
                  duration-200
                  hover:scale-[1.01]
                  disabled:cursor-not-allowed
                  disabled:opacity-50
                "
                style={{
                  background: c.primary,
                  color: c.bg,
                  boxShadow: `0 10px 30px ${c.primary}25`,
                }}
              >
                {isLoading ? (
                  <>
                    <span
                      className="
                        h-4
                        w-4
                        animate-spin
                        rounded-full
                        border-2
                      "
                      style={{
                        borderColor: `${c.bg}40`,
                        borderTopColor: c.bg,
                      }}
                    />
                    Signing in...
                  </>
                ) : (
                  <>
                    <LogIn className="h-4 w-4" />
                    Sign in
                  </>
                )}
              </button>
            </form>

            {/* Divider */}

            <div className="my-6 flex items-center gap-3">
              <div
                className="h-px flex-1"
                style={{
                  background: c.border,
                }}
              />

              <span
                className="text-[10px] uppercase tracking-wider"
                style={{
                  color: c.textFaint,
                }}
              >
                Or continue with
              </span>

              <div
                className="h-px flex-1"
                style={{
                  background: c.border,
                }}
              />
            </div>

            {/* Google Sign In */}

            <button
              onClick={handleGoogleSignIn}
              disabled={isGoogleLoading}
              className="
                w-full
                rounded-xl
                border
                py-3
                text-sm
                font-medium
                transition-all
                duration-200
                hover:bg-white/5
                disabled:cursor-not-allowed
                disabled:opacity-50
              "
              style={{
                borderColor: c.border,
                color: c.text,
              }}
            >
              {isGoogleLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <span
                    className="
                      h-4
                      w-4
                      animate-spin
                      rounded-full
                      border-2
                    "
                    style={{
                      borderColor: `${c.text}40`,
                      borderTopColor: c.text,
                    }}
                  />
                  Connecting...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.78 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66-2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Sign in with Google
                </span>
              )}
            </button>

            {/* ================================================== */}
            {/* SECURITY */}
            {/* ================================================== */}

            <div
              className="
                mt-6
                flex
                items-center
                justify-center
                gap-2
                text-center
              "
              style={{
                color: c.textFaint,
              }}
            >
              <ShieldCheck className="h-3.5 w-3.5" />

              <span className="text-[11px]">
                Your account information stays private.
              </span>
            </div>

            {/* Divider */}

            <div className="my-7 flex items-center gap-3">
              <div
                className="h-px flex-1"
                style={{
                  background: c.border,
                }}
              />

              <span
                className="text-[10px] uppercase tracking-wider"
                style={{
                  color: c.textFaint,
                }}
              >
                New here?
              </span>

              <div
                className="h-px flex-1"
                style={{
                  background: c.border,
                }}
              />
            </div>

            {/* Signup */}

            <button
              type="button"
              onClick={() => navigate("/signup")}
              className="
                w-full
                rounded-xl
                border
                py-3
                text-sm
                font-medium
                transition-all
                duration-200
                hover:bg-white/5
              "
              style={{
                borderColor: c.border,
                color: c.text,
              }}
            >
              Create an account
            </button>
          </div>
        </motion.div>

        {/* Bottom */}

        <motion.p
          initial={{
            opacity: 0,
          }}
          animate={{
            opacity: 1,
          }}
          transition={{
            delay: 0.8,
            duration: 0.5,
          }}
          className="mt-6 text-center text-[11px]"
          style={{
            color: c.textFaint,
          }}
        >
          Smart Expenses · Manage your money with clarity.
        </motion.p>
      </div>
    </main>
  );
}

export default LoginPage;