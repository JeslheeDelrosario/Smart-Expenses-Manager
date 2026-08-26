// src/components/HowItWorks.tsx
import { motion } from "framer-motion";
import { colors as c } from "../lib/theme";

const STEPS = [
  {
    n: "01",
    title: "Track",
    desc: "Record your income and expenses effortlessly in seconds.",
  },
  {
    n: "02",
    title: "Understand",
    desc: "Uncover spending patterns through clear, visual analytics.",
  },
  {
    n: "03",
    title: "Improve",
    desc: "Set smart budgets and comfortably reach your financial goals.",
  },
] as const;

function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="py-24 md:py-32"
      style={{ background: c.bg }}
    >
      <div className="container mx-auto px-6 max-w-6xl">
        <header className="max-w-2xl mx-auto text-center mb-16 md:mb-20">
          <h2
            className="text-3xl sm:text-4xl font-bold tracking-tight mb-4"
            style={{ color: c.text }}
          >
            From spending to smarter decisions
          </h2>
          <p className="text-base sm:text-lg" style={{ color: c.textMuted }}>
            Take control of your money with a simple three-step habit.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 relative">
          {STEPS.map((step, i) => (
            <motion.div
              key={step.n}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: i * 0.12 }}
              className="group relative flex flex-col items-center text-center p-6 rounded-2xl transition-colors"
            >
              {/* Step Badge */}
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center font-mono text-xl font-bold mb-6 border transition-transform group-hover:-translate-y-1"
                style={{
                  color: c.text,
                  backgroundColor: c.bg,
                  borderColor: c.border,
                }}
              >
                {step.n}
              </div>

              {/* Text Content */}
              <h3
                className="text-xl font-semibold mb-2 tracking-tight"
                style={{ color: c.text }}
              >
                {step.title}
              </h3>
              <p
                className="text-sm leading-relaxed max-w-xs"
                style={{ color: c.textMuted }}
              >
                {step.desc}
              </p>

              {/* Connecting Line (Desktop) */}
              {i < STEPS.length - 1 && (
                <div
                  aria-hidden="true"
                  className="hidden md:block absolute top-13 left-[calc(50%+2rem)] w-[calc(100%-4rem)] h-[1px] -z-0"
                  style={{ background: c.border }}
                />
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export { HowItWorks };
