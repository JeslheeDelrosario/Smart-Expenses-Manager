// src/components/DashboardPreview.tsx
import { motion } from "framer-motion";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import { colors as c } from "../lib/theme";

function MiniChart() {
  return (
    <svg
      viewBox="0 0 300 100"
      className="w-full h-24"
      preserveAspectRatio="none"
    >
      <defs>
        <linearGradient id="chartFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={c.primary} stopOpacity="0.35" />
          <stop offset="100%" stopColor={c.primary} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path
        d="M0,70 L30,60 L60,65 L90,40 L120,48 L150,25 L180,35 L210,20 L240,30 L270,10 L300,18"
        fill="none"
        stroke={c.primary}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M0,70 L30,60 L60,65 L90,40 L120,48 L150,25 L180,35 L210,20 L240,30 L270,10 L300,18 L300,100 L0,100 Z"
        fill="url(#chartFill)"
        stroke="none"
      />
    </svg>
  );
}

function DashboardPreview() {
  return (
    <div className="relative">
      <div
        className="absolute -inset-8 rounded-[2rem] blur-3xl opacity-40 pointer-events-none"
        style={{
          background: `radial-gradient(circle, ${c.primary}, transparent 70%)`,
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.9, ease: [0.23, 0.86, 0.39, 0.96] }}
        className="relative rounded-2xl border backdrop-blur-xl shadow-2xl overflow-hidden"
        style={{ background: `${c.card}E6`, borderColor: c.border }}
      >
        <div
          className="flex items-center gap-1.5 px-4 py-3"
          style={{ borderBottom: `1px solid ${c.border}` }}
        >
          <span
            className="h-2.5 w-2.5 rounded-full"
            style={{ background: c.danger }}
          />
          <span
            className="h-2.5 w-2.5 rounded-full"
            style={{ background: c.warning }}
          />
          <span
            className="h-2.5 w-2.5 rounded-full"
            style={{ background: c.success }}
          />
          <span className="ml-3 text-xs" style={{ color: c.textFaint }}>
            app.simpan.com/dashboard
          </span>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div
              className="rounded-xl p-4"
              style={{
                background: c.bgElevated,
                border: `1px solid ${c.border}`,
              }}
            >
              <p className="text-xs mb-1" style={{ color: c.textMuted }}>
                Total balance
              </p>
              <p
                className="text-2xl font-semibold tabular-nums"
                style={{ color: c.text }}
              >
                ₱45,280
              </p>
              <span
                className="inline-flex items-center gap-1 text-xs mt-1"
                style={{ color: c.success }}
              >
                <ArrowUpRight className="w-3 h-3" /> 4.2% this month
              </span>
            </div>
            <div
              className="rounded-xl p-4"
              style={{
                background: c.bgElevated,
                border: `1px solid ${c.border}`,
              }}
            >
              <p className="text-xs mb-1" style={{ color: c.textMuted }}>
                Spent this month
              </p>
              <p
                className="text-2xl font-semibold tabular-nums"
                style={{ color: c.text }}
              >
                ₱18,420
              </p>
              <span
                className="inline-flex items-center gap-1 text-xs mt-1"
                style={{ color: c.danger }}
              >
                <ArrowDownRight className="w-3 h-3" /> 8.4% vs last month
              </span>
            </div>
          </div>

          <div
            className="rounded-xl p-4"
            style={{
              background: c.bgElevated,
              border: `1px solid ${c.border}`,
            }}
          >
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs" style={{ color: c.textMuted }}>
                Spending trend
              </p>
              <span className="text-xs" style={{ color: c.primary }}>
                Last 30 days
              </span>
            </div>
            <MiniChart />
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export { DashboardPreview };
