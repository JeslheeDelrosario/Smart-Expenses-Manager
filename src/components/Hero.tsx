// src/components/Hero.tsx
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
// import { Sparkles } from "lucide-react";
import { colors as c } from "../lib/theme";
import { DashboardPreview } from "../components/DashboardPreview";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      delay: 0.15 * i,
      ease: [0.25, 0.4, 0.25, 1] as const,
    },
  }),
};

function Hero() {
  const navigate = useNavigate();

  return (
    <section
      className="relative overflow-hidden pt-30 pb-30"
      style={{ background: c.bg }}
    >
      {/* subtle grid, replaces the old blurred capsule shapes */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(${c.border} 1px, transparent 1px), linear-gradient(90deg, ${c.border} 1px, transparent 1px)`,
          backgroundSize: "64px 64px",
          opacity: 0.15,
          maskImage:
            "radial-gradient(ellipse 60% 50% at 50% 0%, black, transparent 80%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 60% 50% at 50% 0%, black, transparent 80%)",
        }}
      />

      <div className="relative z-10 container mx-auto px-6 text-center">
        <motion.div
          custom={0}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
        >
          {/* <div
            className="inline-flex items-center gap-2 px-4 py-1.5 mb-6 rounded-full border text-sm font-medium"
            style={{
              borderColor: c.border,
              background: c.primarySoft,
              color: c.primary,
            }}
          >
            <Sparkles className="w-3.5 h-3.5" />
            Smart Finance Management
          </div> */}

          <h1
            className="mx-auto max-w-3xl text-5xl sm:text-6xl md:text-7xl mb-6"
            style={{
              color: c.text,
              fontWeight: 600,
              letterSpacing: "-0.03em",
              lineHeight: 0.98,
            }}
          >
            Take control of your money.{" "}
            <span
              className="bg-clip-text text-transparent"
              style={{
                backgroundImage: `linear-gradient(90deg, ${c.primary}, ${c.secondary})`,
              }}
            >
              Spend smarter. Live better.
            </span>
          </h1>
        </motion.div>

        <motion.p
          custom={1}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="mx-auto max-w-xl text-base md:text-lg mb-10"
          style={{ color: c.textMuted }}
        >
          Track expenses, manage budgets, and understand your financial habits
          with a simple, intelligent finance workspace.
        </motion.p>

        <motion.div
          custom={2}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="flex flex-col sm:flex-row gap-4 justify-center mb-20"
        >
          <button
            onClick={() => navigate("/signup")}
            className="px-8 py-4 rounded-full font-semibold transition-transform hover:scale-105 shadow-lg"
            style={{
              background: c.primary,
              color: c.bg,
              boxShadow: `0 8px 30px ${c.primary}40`,
            }}
          >
            Start Managing Your Money →
          </button>
          <button
            onClick={() => navigate("/dashboard")}
            className="px-8 py-4 rounded-full font-semibold border transition-colors"
            style={{ borderColor: c.border, color: c.text }}
          >
            Explore Dashboard
          </button>
        </motion.div>

        <motion.div
          custom={3}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="max-w-3xl mx-auto"
        >
          <DashboardPreview />
        </motion.div>
      </div>
    </section>
  );
}

export { Hero };
