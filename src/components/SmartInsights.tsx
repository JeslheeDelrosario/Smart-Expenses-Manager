// src/components/SmartInsights.tsx

import { motion } from "framer-motion";
import {
  Sparkles,
  TrendingUp,
  TrendingDown,
  Lightbulb,
  ArrowUpRight,
  ArrowDownRight,
  Brain,
} from "lucide-react";
import { colors as c } from "../lib/theme";

const insightCards = [
  {
    label: "Food & Dining",
    value: "₱4,820",
    change: "+8.4%",
    positive: false,
  },
  {
    label: "Transportation",
    value: "₱2,140",
    change: "-12.2%",
    positive: true,
  },
  {
    label: "Shopping",
    value: "₱3,250",
    change: "-5.7%",
    positive: true,
  },
];

function SmartInsights() {
  return (
    <section
      id="insights"
      className="relative overflow-hidden py-28 md:py-36"
      style={{
        background: c.bgElevated,
        borderTop: `1px solid ${c.border}`,
        borderBottom: `1px solid ${c.border}`,
      }}
    >
      {/* Background glow */}

      <div
        className="
          pointer-events-none
          absolute
          right-0
          top-1/2
          h-125
          w-125
          -translate-y-1/2
          rounded-full
          blur-[140px]
          opacity-[0.08]
        "
        style={{
          background: c.primary,
        }}
      />

      {/* Subtle grid */}

      <div
        className="pointer-events-none absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `
            linear-gradient(${c.text} 1px, transparent 1px),
            linear-gradient(90deg, ${c.text} 1px, transparent 1px)
          `,
          backgroundSize: "56px 56px",
        }}
      />

      <div className="relative container mx-auto px-6">
        <div className="mx-auto grid max-w-6xl items-center gap-16 lg:grid-cols-2">
          {/* ================================================== */}
          {/* LEFT CONTENT */}
          {/* ================================================== */}

          <motion.div
            initial={{
              opacity: 0,
              x: -30,
            }}
            whileInView={{
              opacity: 1,
              x: 0,
            }}
            viewport={{
              once: true,
              amount: 0.3,
            }}
            transition={{
              duration: 0.7,
            }}
          >
            {/* Eyebrow */}

            <div
              className="
                mb-6
                inline-flex
                items-center
                gap-2
                rounded-full
                border
                px-3.5
                py-1.5
              "
              style={{
                background: `${c.primary}08`,
                borderColor: `${c.primary}25`,
                color: c.primary,
              }}
            >
              <Sparkles className="h-3.5 w-3.5" />

              <span className="text-xs font-semibold tracking-wide">
                SMART FINANCIAL INTELLIGENCE
              </span>
            </div>

            {/* Heading */}

            <h2
              className="
                text-3xl
                font-semibold
                tracking-[-0.035em]
                sm:text-4xl
                md:text-5xl
              "
              style={{
                color: c.text,
              }}
            >
              Your finances shouldn't
              <span
                className="
                  block
                  bg-clip-text
                  text-transparent
                "
                style={{
                  backgroundImage: `linear-gradient(
                    90deg,
                    ${c.primary},
                    ${c.text}
                  )`,
                }}
              >
                just be tracked.
              </span>
              They should be understood.
            </h2>

            {/* Description */}

            <p
              className="
                mt-6
                max-w-xl
                text-base
                leading-relaxed
              "
              style={{
                color: c.textMuted,
              }}
            >
              Smart Expenses turns your spending activity into clear, actionable
              insights — helping you understand what changed, where your money
              is going, and what you can do next.
            </p>

            {/* Benefits */}

            <div className="mt-8 space-y-4">
              {[
                {
                  icon: Brain,
                  title: "Understand your spending",
                  description:
                    "See the patterns behind your everyday transactions.",
                },
                {
                  icon: Lightbulb,
                  title: "Get actionable suggestions",
                  description: "Turn financial data into practical next steps.",
                },
                {
                  icon: TrendingDown,
                  title: "Build better habits",
                  description:
                    "Identify opportunities to save and stay on track.",
                },
              ].map(({ icon: Icon, title, description }, index) => (
                <motion.div
                  key={title}
                  initial={{
                    opacity: 0,
                    y: 10,
                  }}
                  whileInView={{
                    opacity: 1,
                    y: 0,
                  }}
                  viewport={{
                    once: true,
                  }}
                  transition={{
                    delay: 0.2 + index * 0.1,
                  }}
                  className="flex items-start gap-3"
                >
                  <div
                    className="
                        mt-0.5
                        flex
                        h-9
                        w-9
                        shrink-0
                        items-center
                        justify-center
                        rounded-xl
                        border
                      "
                    style={{
                      background: `${c.primary}08`,
                      borderColor: `${c.primary}20`,
                    }}
                  >
                    <Icon
                      className="h-4 w-4"
                      style={{
                        color: c.primary,
                      }}
                    />
                  </div>

                  <div>
                    <p
                      className="text-sm font-semibold"
                      style={{
                        color: c.text,
                      }}
                    >
                      {title}
                    </p>

                    <p
                      className="mt-1 text-xs leading-relaxed"
                      style={{
                        color: c.textFaint,
                      }}
                    >
                      {description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* ================================================== */}
          {/* RIGHT PRODUCT PREVIEW */}
          {/* ================================================== */}

          <motion.div
            initial={{
              opacity: 0,
              x: 30,
              y: 20,
            }}
            whileInView={{
              opacity: 1,
              x: 0,
              y: 0,
            }}
            viewport={{
              once: true,
              amount: 0.2,
            }}
            transition={{
              duration: 0.8,
            }}
            className="relative"
          >
            {/* Main dashboard */}

            <div
              className="
                relative
                overflow-hidden
                rounded-3xl
                border
                p-5
                backdrop-blur-xl
              "
              style={{
                background: `${c.card}dd`,
                borderColor: c.border,
                boxShadow: `0 30px 80px ${c.bg}70`,
              }}
            >
              {/* Dashboard Header */}

              <div className="mb-6 flex items-center justify-between">
                <div>
                  <p
                    className="text-xs"
                    style={{
                      color: c.textFaint,
                    }}
                  >
                    Financial overview
                  </p>

                  <p
                    className="mt-1 text-lg font-semibold"
                    style={{
                      color: c.text,
                    }}
                  >
                    August 2026
                  </p>
                </div>

                <div
                  className="
                    flex
                    items-center
                    gap-2
                    rounded-full
                    border
                    px-3
                    py-1.5
                  "
                  style={{
                    background: `${c.primary}08`,
                    borderColor: `${c.primary}20`,
                  }}
                >
                  <span
                    className="h-1.5 w-1.5 rounded-full"
                    style={{
                      background: c.primary,
                      boxShadow: `0 0 8px ${c.primary}`,
                    }}
                  />

                  <span
                    className="text-[11px] font-medium"
                    style={{
                      color: c.primary,
                    }}
                  >
                    Analyzing
                  </span>
                </div>
              </div>

              {/* Main Metric */}

              <div
                className="
                  rounded-2xl
                  border
                  p-5
                "
                style={{
                  background: `${c.bg}80`,
                  borderColor: `${c.border}80`,
                }}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p
                      className="text-xs"
                      style={{
                        color: c.textFaint,
                      }}
                    >
                      Total spending
                    </p>

                    <p
                      className="
                        mt-2
                        text-3xl
                        font-semibold
                        tracking-tight
                      "
                      style={{
                        color: c.text,
                      }}
                    >
                      ₱18,420
                    </p>
                  </div>

                  <div
                    className="
                      flex
                      items-center
                      gap-1
                      rounded-full
                      px-2.5
                      py-1
                    "
                    style={{
                      background: `${c.success}10`,
                      color: c.success,
                    }}
                  >
                    <ArrowDownRight className="h-3 w-3" />

                    <span className="text-[11px] font-semibold">6.2%</span>
                  </div>
                </div>

                {/* Mini chart */}

                <div className="mt-6 h-24">
                  <svg
                    viewBox="0 0 500 100"
                    preserveAspectRatio="none"
                    className="h-full w-full"
                  >
                    <defs>
                      <linearGradient
                        id="insightGradient"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="0%"
                          stopColor={c.primary}
                          stopOpacity="0.25"
                        />

                        <stop
                          offset="100%"
                          stopColor={c.primary}
                          stopOpacity="0"
                        />
                      </linearGradient>
                    </defs>

                    <path
                      d="
                        M0 75
                        C50 70 65 55 110 60
                        S170 75 210 50
                        S270 30 310 45
                        S365 65 405 30
                        S455 25 500 15
                        L500 100
                        L0 100
                        Z
                      "
                      fill="url(#insightGradient)"
                    />

                    <path
                      d="
                        M0 75
                        C50 70 65 55 110 60
                        S170 75 210 50
                        S270 30 310 45
                        S365 65 405 30
                        S455 25 500 15
                      "
                      fill="none"
                      stroke={c.primary}
                      strokeWidth="3"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>
              </div>

              {/* Category Insights */}

              <div className="mt-4 grid grid-cols-3 gap-3">
                {insightCards.map((item) => (
                  <div
                    key={item.label}
                    className="
                      rounded-2xl
                      border
                      p-3
                    "
                    style={{
                      background: `${c.bg}60`,
                      borderColor: `${c.border}80`,
                    }}
                  >
                    <p
                      className="truncate text-[10px]"
                      style={{
                        color: c.textFaint,
                      }}
                    >
                      {item.label}
                    </p>

                    <p
                      className="mt-1 text-sm font-semibold"
                      style={{
                        color: c.text,
                      }}
                    >
                      {item.value}
                    </p>

                    <div
                      className="mt-1 flex items-center gap-1 text-[10px] font-medium"
                      style={{
                        color: item.positive ? c.success : c.danger,
                      }}
                    >
                      {item.positive ? (
                        <TrendingDown className="h-3 w-3" />
                      ) : (
                        <TrendingUp className="h-3 w-3" />
                      )}

                      {item.change}
                    </div>
                  </div>
                ))}
              </div>

              {/* AI Insight */}

              <motion.div
                initial={{
                  opacity: 0,
                  y: 10,
                }}
                whileInView={{
                  opacity: 1,
                  y: 0,
                }}
                viewport={{
                  once: true,
                }}
                transition={{
                  delay: 0.5,
                }}
                className="
                  mt-4
                  rounded-2xl
                  border
                  p-4
                "
                style={{
                  background: `${c.primary}06`,
                  borderColor: `${c.primary}20`,
                }}
              >
                <div className="flex items-start gap-3">
                  <div
                    className="
                      flex
                      h-8
                      w-8
                      shrink-0
                      items-center
                      justify-center
                      rounded-lg
                    "
                    style={{
                      background: `${c.warning}12`,
                    }}
                  >
                    <Sparkles
                      className="h-4 w-4"
                      style={{
                        color: c.warning,
                      }}
                    />
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <p
                        className="text-xs font-semibold"
                        style={{
                          color: c.text,
                        }}
                      >
                        Smart Insight
                      </p>

                      <span
                        className="text-[10px]"
                        style={{
                          color: c.textFaint,
                        }}
                      >
                        Just now
                      </span>
                    </div>

                    <p
                      className="
                        mt-1.5
                        text-xs
                        leading-relaxed
                      "
                      style={{
                        color: c.textMuted,
                      }}
                    >
                      Your dining expenses increased{" "}
                      <strong
                        style={{
                          color: c.danger,
                        }}
                      >
                        8.4%
                      </strong>{" "}
                      this month. Consider setting a{" "}
                      <strong
                        style={{
                          color: c.text,
                        }}
                      >
                        ₱5,000
                      </strong>{" "}
                      monthly dining budget.
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Bottom action */}

              <div className="mt-5 flex items-center justify-between">
                <span
                  className="text-[11px]"
                  style={{
                    color: c.textFaint,
                  }}
                >
                  Based on your recent activity
                </span>

                <button
                  className="
                    flex
                    items-center
                    gap-1
                    text-xs
                    font-semibold
                  "
                  style={{
                    color: c.primary,
                  }}
                >
                  View insights
                  <ArrowUpRight className="h-3 w-3" />
                </button>
              </div>
            </div>

            {/* Floating badge */}

            <motion.div
              initial={{
                opacity: 0,
                scale: 0.9,
              }}
              whileInView={{
                opacity: 1,
                scale: 1,
              }}
              viewport={{
                once: true,
              }}
              transition={{
                delay: 0.8,
              }}
              className="
                absolute
                -bottom-5
                -left-5
                hidden
                rounded-2xl
                border
                px-4
                py-3
                shadow-xl
                backdrop-blur-xl
                sm:block
              "
              style={{
                background: `${c.card}ee`,
                borderColor: c.border,
              }}
            >
              <div className="flex items-center gap-2">
                <div
                  className="
                    flex
                    h-7
                    w-7
                    items-center
                    justify-center
                    rounded-lg
                  "
                  style={{
                    background: `${c.success}10`,
                  }}
                >
                  <TrendingDown
                    className="h-3.5 w-3.5"
                    style={{
                      color: c.success,
                    }}
                  />
                </div>

                <div>
                  <p
                    className="text-[10px]"
                    style={{
                      color: c.textFaint,
                    }}
                  >
                    Monthly savings
                  </p>

                  <p
                    className="text-xs font-semibold"
                    style={{
                      color: c.success,
                    }}
                  >
                    +₱2,340
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export { SmartInsights };
