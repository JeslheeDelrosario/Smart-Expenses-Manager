// src/components/ShapeLandingHero.tsx
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  Sun,
  Moon,
  Coffee,
  ShoppingBag,
  Car,
  PiggyBank,
  Check,
} from "lucide-react";

// ---- design tokens ---------------------------------------------------

const theme = {
  dark: {
    bg: "#14111C",
    paper: "#211B2B",
    paperTint: "#2A2336",
    text: "#F3EFE6",
    textMuted: "#A69C8D",
    border: "#3A3247",
  },
  light: {
    bg: "#FBF7EE",
    paper: "#FFFFFF",
    paperTint: "#F3ECDC",
    text: "#1F1A2B",
    textMuted: "#7A7263",
    border: "#E6DFCE",
  },
} as const;

const ACCENT = "#E7A33E"; // amber — CTA + highlight
const CORAL = "#E8654A"; // outgoing amounts
const SAGE = "#7FB69E"; // savings / positive framing

const FONT_DISPLAY = "'Fraunces', serif";
const FONT_BODY = "'Inter', sans-serif";
const FONT_MONO = "'IBM Plex Mono', monospace";

type Transaction = {
  icon: typeof Coffee;
  label: string;
  amount: number;
  tone: "spend" | "save";
};

const TRANSACTIONS: Transaction[] = [
  { icon: Coffee, label: "Coffee & snacks", amount: -186.0, tone: "spend" },
  { icon: ShoppingBag, label: "Groceries", amount: -1240.5, tone: "spend" },
  { icon: Car, label: "Ride to work", amount: -95.0, tone: "spend" },
  { icon: PiggyBank, label: "Moved to savings", amount: -500.0, tone: "save" },
];

const START_BALANCE = 5933.94;
const END_BALANCE =
  START_BALANCE + TRANSACTIONS.reduce((sum, t) => sum + t.amount, 0);

function formatAmount(n: number) {
  return n.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function useCountUp(
  from: number,
  to: number,
  durationMs: number,
  start: boolean,
) {
  const [value, setValue] = useState(from);
  useEffect(() => {
    if (!start) return;
    let raf: number;
    const startTime = performance.now();
    const tick = (now: number) => {
      const progress = Math.min((now - startTime) / durationMs, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(from + (to - from) * eased);
      if (progress < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [from, to, durationMs, start]);
  return value;
}

// ---- signature element: the ledger card -------------------------------

function LedgerCard({ isDark }: { isDark: boolean }) {
  const t = isDark ? theme.dark : theme.light;
  const balance = useCountUp(START_BALANCE, END_BALANCE, 1800, true);

  return (
    <div className="relative w-full max-w-sm mx-auto lg:mx-0">
      {/* peeking card behind: savings goal */}
      <motion.div
        initial={{ opacity: 0, y: 20, rotate: -2 }}
        animate={{ opacity: 1, y: 0, rotate: -6 }}
        transition={{
          duration: 0.9,
          delay: 0.5,
          ease: [0.23, 0.86, 0.39, 0.96],
        }}
        className="absolute -right-4 -top-6 w-[88%] rounded-2xl border p-5 shadow-xl"
        style={{ background: t.paperTint, borderColor: t.border }}
      >
        <p
          className="text-xs font-medium tracking-wide"
          style={{ color: t.textMuted, fontFamily: FONT_BODY }}
        >
          Savings goal · New laptop
        </p>
        <div
          className="mt-3 h-1.5 w-full rounded-full"
          style={{ background: t.border }}
        >
          <div
            className="h-1.5 rounded-full"
            style={{ width: "64%", background: SAGE }}
          />
        </div>
        <p
          className="mt-2 text-sm tabular-nums"
          style={{ fontFamily: FONT_MONO, color: t.text }}
        >
          ₱3,200 <span style={{ color: t.textMuted }}>/ ₱5,000</span>
        </p>
      </motion.div>

      {/* main ledger card */}
      <motion.div
        initial={{ opacity: 0, y: 30, rotate: 3 }}
        animate={{ opacity: 1, y: 0, rotate: 2 }}
        whileHover={{ rotate: 0, y: -4 }}
        transition={{ duration: 1, delay: 0.3, ease: [0.23, 0.86, 0.39, 0.96] }}
        className="relative rounded-2xl border p-6 shadow-2xl"
        style={{ background: t.paper, borderColor: t.border }}
      >
        <div className="flex items-center justify-between">
          <p
            className="text-xs font-medium tracking-wide uppercase"
            style={{ color: t.textMuted, fontFamily: FONT_BODY }}
          >
            This month
          </p>
          <span className="relative flex h-2 w-2">
            <span
              className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-60"
              style={{ background: ACCENT }}
            />
            <span
              className="relative inline-flex rounded-full h-2 w-2"
              style={{ background: ACCENT }}
            />
          </span>
        </div>

        <p
          className="mt-2 text-4xl tabular-nums"
          style={{ fontFamily: FONT_MONO, color: t.text }}
        >
          ₱{formatAmount(balance)}
        </p>

        <div className="mt-5 space-y-3">
          {TRANSACTIONS.map((tx, i) => (
            <motion.div
              key={tx.label}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.9 + i * 0.15 }}
              className="flex items-center justify-between border-t pt-3 first:border-t-0 first:pt-0"
              style={{ borderColor: t.border }}
            >
              <div className="flex items-center gap-2.5">
                <span
                  className="flex h-7 w-7 items-center justify-center rounded-full"
                  style={{ background: t.paperTint }}
                >
                  <tx.icon
                    className="h-3.5 w-3.5"
                    style={{ color: t.textMuted }}
                  />
                </span>
                <span
                  className="text-sm"
                  style={{ color: t.text, fontFamily: FONT_BODY }}
                >
                  {tx.label}
                </span>
              </div>
              <span
                className="text-sm tabular-nums"
                style={{
                  fontFamily: FONT_MONO,
                  color: tx.tone === "save" ? SAGE : CORAL,
                }}
              >
                {tx.amount < 0 ? "-" : "+"}₱{formatAmount(Math.abs(tx.amount))}
              </span>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

// ---- hero ---------------------------------------------------------------

function HeroGeometric({
  badge = "Free 14-day trial",
  title1 = "Every peso,",
  title2 = "accounted for.",
}: {
  badge?: string;
  title1?: string;
  title2?: string;
}) {
  const navigate = useNavigate();
  const [isDark, setIsDark] = useState(true);
  const t = isDark ? theme.dark : theme.light;

  const fadeUpVariants = {
    hidden: { opacity: 0, y: 24 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        delay: 0.2 + i * 0.15,
        ease: [0.25, 0.4, 0.25, 1] as const,
      },
    }),
  } as const;

  return (
    <div
      className="relative min-h-screen w-full overflow-hidden transition-colors duration-500"
      style={{ background: t.bg }}
    >
      {/* ledger-paper dot grid, replaces generic blurred blobs */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `radial-gradient(${t.border} 1px, transparent 1px)`,
          backgroundSize: "28px 28px",
          opacity: 0.5,
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(ellipse 70% 60% at 50% 15%, transparent 0%, ${t.bg} 85%)`,
        }}
      />

      <motion.button
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        onClick={() => setIsDark(!isDark)}
        className="absolute top-6 right-6 z-50 p-3 rounded-full border transition-all duration-200 hover:scale-110"
        style={{ background: t.paper, borderColor: t.border, color: t.text }}
        aria-label="Toggle theme"
      >
        {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
      </motion.button>

      <div className="relative z-10 container mx-auto px-6 md:px-10 min-h-screen flex items-center">
        <div className="grid lg:grid-cols-2 gap-16 items-center w-full max-w-6xl mx-auto py-24">
          {/* left: copy */}
          <div className="text-center lg:text-left">
            <motion.div
              custom={0}
              variants={fadeUpVariants}
              initial="hidden"
              animate="visible"
            >
              <div
                className="inline-flex items-center gap-2 px-4 py-1.5 mb-8 rounded-full border text-sm font-medium"
                style={{
                  borderColor: t.border,
                  background: t.paper,
                  color: ACCENT,
                  fontFamily: FONT_BODY,
                }}
              >
                <span className="relative flex h-2 w-2">
                  <span
                    className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-60"
                    style={{ background: ACCENT }}
                  />
                  <span
                    className="relative inline-flex rounded-full h-2 w-2"
                    style={{ background: ACCENT }}
                  />
                </span>
                {badge}
              </div>

              <h1
                className="text-5xl sm:text-6xl md:text-7xl mb-6 tracking-tight leading-[1.05]"
                style={{
                  fontFamily: FONT_DISPLAY,
                  color: t.text,
                  fontWeight: 600,
                }}
              >
                {title1}
                <br />
                <span
                  style={{
                    color: ACCENT,
                    fontStyle: "italic",
                    fontWeight: 500,
                  }}
                >
                  {title2}
                </span>
              </h1>
            </motion.div>

            <motion.p
              custom={1}
              variants={fadeUpVariants}
              initial="hidden"
              animate="visible"
              className="text-base md:text-lg mb-8 leading-relaxed max-w-md mx-auto lg:mx-0"
              style={{ color: t.textMuted, fontFamily: FONT_BODY }}
            >
              Connect your accounts and watch every transaction sort itself into
              a category — so you catch the leaks before payday does.
            </motion.p>

            <motion.div
              custom={2}
              variants={fadeUpVariants}
              initial="hidden"
              animate="visible"
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-8"
            >
              <button
                onClick={() => navigate("/login")}
                className="px-8 py-4 font-semibold rounded-full hover:scale-105 transition-transform duration-200 shadow-lg"
                style={{ background: ACCENT, color: t.bg }}
              >
                Get started free
              </button>
              <button
                onClick={() => navigate("/dashboard")}
                className="px-8 py-4 border font-semibold rounded-full transition-all duration-200"
                style={{ borderColor: t.border, color: t.text }}
              >
                See a live demo
              </button>
            </motion.div>

            <motion.div
              custom={3}
              variants={fadeUpVariants}
              initial="hidden"
              animate="visible"
              className="flex flex-wrap gap-x-6 gap-y-2 justify-center lg:justify-start"
            >
              {[
                "No card required",
                "Cancel anytime",
                "Bank-level encryption",
              ].map((item) => (
                <span
                  key={item}
                  className="flex items-center gap-1.5 text-sm"
                  style={{ color: t.textMuted, fontFamily: FONT_BODY }}
                >
                  <Check className="h-3.5 w-3.5" style={{ color: SAGE }} />
                  {item}
                </span>
              ))}
            </motion.div>
          </div>

          {/* right: signature ledger visual */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <LedgerCard isDark={isDark} />
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export { HeroGeometric };
 