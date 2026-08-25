// src/components/HowItWorks.tsx
import { motion } from "framer-motion";
import { colors as c } from "../lib/theme";

const STEPS = [
  {
    n: "01",
    title: "Track",
    desc: "Record your income and expenses in seconds.",
  },
  {
    n: "02",
    title: "Understand",
    desc: "See patterns through visual analytics.",
  },
  { n: "03", title: "Improve", desc: "Set budgets and reach your goals." },
];

function HowItWorks() {
  return (
    <section id="how-it-works" className="py-28" style={{ background: c.bg }}>
      <div className="container mx-auto px-6">
        <h2
          className="text-center text-3xl md:text-4xl font-semibold mb-16"
          style={{ color: c.text, letterSpacing: "-0.02em" }}
        >
          From spending to smarter decisions
        </h2>

        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {STEPS.map((step, i) => (
            <motion.div
              key={step.n}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.15 }}
              className="relative text-center"
            >
              <span
                className="text-5xl font-semibold block mb-4"
                style={{ color: c.border, fontFamily: "monospace" }}
              >
                {step.n}
              </span>
              <h3
                className="text-lg font-semibold mb-2"
                style={{ color: c.text }}
              >
                {step.title}
              </h3>
              <p className="text-sm" style={{ color: c.textMuted }}>
                {step.desc}
              </p>
              {i < STEPS.length - 1 && (
                <div
                  className="hidden md:block absolute top-6 left-[calc(100%+0.5rem)] w-[calc(100%-3rem)] h-px"
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
