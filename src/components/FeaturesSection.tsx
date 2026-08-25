// src/components/FeaturesSection.tsx

import type { ReactNode } from "react";
import { motion } from "framer-motion";
import {
  Coffee,
  ShoppingBag,
  Home,
  Sparkles,
  Target,
  TrendingDown,
  Receipt,
  Wallet,
  LineChart,
  ShieldCheck,
  ArrowUpRight,
} from "lucide-react";
import { colors as c } from "@/lib/theme";

const CAPABILITIES = [
  {
    icon: Receipt,
    label: "Expense Tracking",
  },
  {
    icon: Wallet,
    label: "Smart Budgets",
  },
  {
    icon: LineChart,
    label: "Financial Insights",
  },
  {
    icon: Target,
    label: "Goal Tracking",
  },
  {
    icon: ShieldCheck,
    label: "Secure & Private",
  },
];

const TRANSACTIONS = [
  {
    icon: Coffee,
    label: "Coffee & snacks",
    category: "Food",
    amount: -186,
  },
  {
    icon: ShoppingBag,
    label: "Groceries",
    category: "Food",
    amount: -1240,
  },
  {
    icon: Home,
    label: "Rent",
    category: "Housing",
    amount: -12000,
  },
];

function Card({
  className = "",
  children,
  delay = 0,
}: {
  className?: string;
  children: ReactNode;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 30,
      }}
      whileInView={{
        opacity: 1,
        y: 0,
      }}
      viewport={{
        once: true,
        margin: "-80px",
      }}
      transition={{
        duration: 0.65,
        delay,
        ease: [0.22, 1, 0.36, 1],
      }}
      whileHover={{
        y: -4,
        transition: {
          duration: 0.2,
        },
      }}
      className={`
        group
        relative
        overflow-hidden
        rounded-3xl
        border
        backdrop-blur-xl
        ${className}
      `}
      style={{
        background: `${c.card}cc`,
        borderColor: c.border,
        boxShadow: `0 20px 60px ${c.bg}50`,
      }}
    >
      {/* Hover glow */}
      <div
        className="
          pointer-events-none
          absolute
          -right-20
          -top-20
          h-40
          w-40
          rounded-full
          blur-3xl
          opacity-0
          transition-opacity
          duration-500
          group-hover:opacity-20
        "
        style={{
          background: c.primary,
        }}
      />

      {children}
    </motion.div>
  );
}

function CardLabel({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="relative mb-7">
      <p
        className="text-sm font-semibold tracking-tight"
        style={{
          color: c.text,
        }}
      >
        {title}
      </p>

      <p
        className="mt-1.5 text-sm leading-relaxed"
        style={{
          color: c.textMuted,
        }}
      >
        {description}
      </p>
    </div>
  );
}

function FeaturesSection() {
  return (
    <section
      id="features"
      className="relative overflow-hidden py-28 md:py-36"
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
          top-0
          h-150
          w-225
          -translate-x-1/2
          rounded-full
          blur-[140px]
          opacity-[0.07]
        "
        style={{
          background: c.primary,
        }}
      />

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

      <div className="relative container mx-auto px-6">
        {/* ================================================== */}
        {/* HEADER */}
        {/* ================================================== */}

        <motion.div
          initial={{
            opacity: 0,
            y: 20,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{
            once: true,
            amount: 0.3,
          }}
          transition={{
            duration: 0.6,
          }}
          className="mx-auto mb-10 max-w-2xl text-center"
        >
          {/* Eyebrow */}

          <div
            className="
              mb-5
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
            <span
              className="h-1.5 w-1.5 rounded-full"
              style={{
                background: c.primary,
                boxShadow: `0 0 10px ${c.primary}`,
              }}
            />

            <span className="text-xs font-semibold tracking-wide">
              BUILT FOR BETTER FINANCIAL HABITS
            </span>
          </div>

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
            Everything you need to
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
                  ${c.text},
                  ${c.primary}
                )`,
              }}
            >
              manage money smarter.
            </span>
          </h2>

          <p
            className="
              mx-auto
              mt-5
              max-w-xl
              text-base
              leading-relaxed
            "
            style={{
              color: c.textMuted,
            }}
          >
            Track your spending, build better budgets, understand your habits,
            and turn your financial goals into progress.
          </p>
        </motion.div>

        {/* ================================================== */}
        {/* CAPABILITIES */}
        {/* ================================================== */}

        <motion.div
          initial={{
            opacity: 0,
            y: 15,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{
            once: true,
          }}
          transition={{
            duration: 0.6,
            delay: 0.15,
          }}
          className="
            mx-auto
            mb-16
            flex
            max-w-5xl
            flex-wrap
            items-center
            justify-center
            gap-2
          "
        >
          {CAPABILITIES.map(({ icon: Icon, label }) => (
            <div
              key={label}
              className="
                flex
                items-center
                gap-2
                rounded-full
                border
                px-4
                py-2
                backdrop-blur-xl
              "
              style={{
                background: `${c.card}70`,
                borderColor: c.border,
                color: c.textMuted,
              }}
            >
              <Icon
                className="h-3.5 w-3.5"
                style={{
                  color: c.primary,
                }}
              />

              <span className="text-xs font-medium">{label}</span>
            </div>
          ))}
        </motion.div>

        {/* ================================================== */}
        {/* BENTO */}
        {/* ================================================== */}

        <div
          className="
            mx-auto
            grid
            max-w-6xl
            grid-cols-1
            gap-5
            md:grid-cols-2
            lg:grid-cols-3
          "
        >
          {/* ================================================== */}
          {/* EXPENSE TRACKING */}
          {/* ================================================== */}

          <Card delay={0.05} className="p-6 md:col-span-2 lg:col-span-2">
            <CardLabel
              title="Expense Tracking"
              description="Know exactly where your money goes."
            />

            <div className="space-y-2">
              {TRANSACTIONS.map((tx, index) => {
                const Icon = tx.icon;

                return (
                  <motion.div
                    key={tx.label}
                    initial={{
                      opacity: 0,
                      x: -10,
                    }}
                    whileInView={{
                      opacity: 1,
                      x: 0,
                    }}
                    viewport={{
                      once: true,
                    }}
                    transition={{
                      delay: 0.2 + index * 0.08,
                    }}
                    className="
                      flex
                      items-center
                      justify-between
                      rounded-xl
                      border
                      px-3
                      py-3
                    "
                    style={{
                      background: `${c.bg}70`,
                      borderColor: `${c.border}80`,
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="
                          flex
                          h-9
                          w-9
                          items-center
                          justify-center
                          rounded-xl
                        "
                        style={{
                          background: `${c.primary}0d`,
                          color: c.primary,
                        }}
                      >
                        <Icon className="h-4 w-4" />
                      </div>

                      <div>
                        <p
                          className="text-sm font-medium"
                          style={{
                            color: c.text,
                          }}
                        >
                          {tx.label}
                        </p>

                        <p
                          className="text-[11px]"
                          style={{
                            color: c.textFaint,
                          }}
                        >
                          {tx.category}
                        </p>
                      </div>
                    </div>

                    <span
                      className="
                        text-sm
                        font-medium
                        tabular-nums
                      "
                      style={{
                        color: c.danger,
                      }}
                    >
                      -₱{Math.abs(tx.amount).toLocaleString()}
                    </span>
                  </motion.div>
                );
              })}
            </div>

            <div
              className="
                mt-5
                flex
                items-center
                justify-between
                border-t
                pt-4
              "
              style={{
                borderColor: c.border,
              }}
            >
              <span
                className="text-xs"
                style={{
                  color: c.textFaint,
                }}
              >
                3 recent transactions
              </span>

              <span
                className="
                  flex
                  items-center
                  gap-1
                  text-xs
                  font-medium
                "
                style={{
                  color: c.primary,
                }}
              >
                View all
                <ArrowUpRight className="h-3 w-3" />
              </span>
            </div>
          </Card>

          {/* ================================================== */}
          {/* SMART BUDGET */}
          {/* ================================================== */}

          <Card delay={0.1} className="p-6">
            <CardLabel
              title="Smart Budgets"
              description="Set limits and stay on track."
            />

            <div className="mb-2 flex items-center justify-between">
              <span
                className="text-sm font-medium"
                style={{
                  color: c.text,
                }}
              >
                Food
              </span>

              <span
                className="text-xs tabular-nums"
                style={{
                  color: c.textMuted,
                }}
              >
                ₱4,250 / ₱6,000
              </span>
            </div>

            <div
              className="h-2 w-full overflow-hidden rounded-full"
              style={{
                background: c.bgElevated,
              }}
            >
              <motion.div
                initial={{
                  width: 0,
                }}
                whileInView={{
                  width: "71%",
                }}
                viewport={{
                  once: true,
                }}
                transition={{
                  duration: 1,
                  delay: 0.3,
                }}
                className="h-full rounded-full"
                style={{
                  background: c.primary,
                }}
              />
            </div>

            <div className="mt-3 flex justify-between">
              <span
                className="text-xs"
                style={{
                  color: c.textFaint,
                }}
              >
                71% used
              </span>

              <span
                className="text-xs font-medium"
                style={{
                  color: c.primary,
                }}
              >
                ₱1,750 left
              </span>
            </div>
          </Card>

          {/* ================================================== */}
          {/* ANALYTICS */}
          {/* ================================================== */}

          <Card delay={0.15} className="p-6 md:col-span-1 lg:col-span-2">
            <CardLabel
              title="Spending Analytics"
              description="See trends across every category."
            />

            <div className="relative h-40">
              <div
                className="absolute inset-0 opacity-30"
                style={{
                  backgroundImage: `
                    linear-gradient(
                      ${c.border} 1px,
                      transparent 1px
                    )
                  `,
                  backgroundSize: "100% 33.33%",
                }}
              />

              <svg
                viewBox="0 0 500 150"
                preserveAspectRatio="none"
                className="relative h-full w-full"
              >
                <defs>
                  <linearGradient
                    id="chartGradient"
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

                    <stop offset="100%" stopColor={c.primary} stopOpacity="0" />
                  </linearGradient>
                </defs>

                <path
                  d="
                    M0 110
                    C45 100, 60 105, 95 80
                    S150 95, 185 70
                    S235 45, 270 65
                    S325 75, 355 40
                    S420 55, 500 20
                    L500 150
                    L0 150
                    Z
                  "
                  fill="url(#chartGradient)"
                />

                <path
                  d="
                    M0 110
                    C45 100, 60 105, 95 80
                    S150 95, 185 70
                    S235 45, 270 65
                    S325 75, 355 40
                    S420 55, 500 20
                  "
                  fill="none"
                  stroke={c.primary}
                  strokeWidth="3"
                  strokeLinecap="round"
                />
              </svg>
            </div>
          </Card>

          {/* ================================================== */}
          {/* SMART INSIGHT */}
          {/* ================================================== */}

          <Card delay={0.2} className="p-6">
            <div className="flex items-center gap-2">
              <div
                className="
                  flex
                  h-9
                  w-9
                  items-center
                  justify-center
                  rounded-xl
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
                <p
                  className="text-sm font-semibold"
                  style={{
                    color: c.text,
                  }}
                >
                  Smart Insight
                </p>

                <p
                  className="text-[11px]"
                  style={{
                    color: c.textFaint,
                  }}
                >
                  This month
                </p>
              </div>
            </div>

            <p
              className="
                mt-6
                text-sm
                leading-relaxed
              "
              style={{
                color: c.textMuted,
              }}
            >
              You're spending{" "}
              <span
                className="font-semibold"
                style={{
                  color: c.success,
                }}
              >
                12% less
              </span>{" "}
              on dining this month.
            </p>

            <div
              className="
                mt-4
                flex
                items-center
                gap-2
                rounded-xl
                border
                px-3
                py-2.5
              "
              style={{
                background: `${c.success}08`,
                borderColor: `${c.success}20`,
              }}
            >
              <TrendingDown
                className="h-4 w-4"
                style={{
                  color: c.success,
                }}
              />

              <span
                className="text-xs font-medium"
                style={{
                  color: c.success,
                }}
              >
                ₱1,240 saved
              </span>
            </div>
          </Card>

          {/* ================================================== */}
          {/* GOAL */}
          {/* ================================================== */}

          <Card delay={0.25} className="p-6 md:col-span-2 lg:col-span-3">
            <div
              className="
                flex
                flex-col
                gap-6
                sm:flex-row
                sm:items-center
                sm:justify-between
              "
            >
              <div className="flex items-center gap-3">
                <div
                  className="
                    flex
                    h-11
                    w-11
                    items-center
                    justify-center
                    rounded-xl
                  "
                  style={{
                    background: `${c.success}10`,
                  }}
                >
                  <Target
                    className="h-5 w-5"
                    style={{
                      color: c.success,
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
                    Emergency Fund
                  </p>

                  <p
                    className="text-xs"
                    style={{
                      color: c.textFaint,
                    }}
                  >
                    Build your financial safety net.
                  </p>
                </div>
              </div>

              <div className="min-w-0 sm:w-90">
                <div className="mb-2 flex items-center justify-between">
                  <span
                    className="
                      text-sm
                      font-medium
                      tabular-nums
                    "
                    style={{
                      color: c.text,
                    }}
                  >
                    ₱32,500 / ₱50,000
                  </span>

                  <span
                    className="text-xs font-semibold"
                    style={{
                      color: c.success,
                    }}
                  >
                    65%
                  </span>
                </div>

                <div
                  className="
                    h-2.5
                    overflow-hidden
                    rounded-full
                  "
                  style={{
                    background: c.bgElevated,
                  }}
                >
                  <motion.div
                    initial={{
                      width: 0,
                    }}
                    whileInView={{
                      width: "65%",
                    }}
                    viewport={{
                      once: true,
                    }}
                    transition={{
                      duration: 1.2,
                      delay: 0.4,
                    }}
                    className="h-full rounded-full"
                    style={{
                      background: c.success,
                    }}
                  />
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* ================================================== */}
        {/* TRUST LINE */}
        {/* ================================================== */}

        <motion.div
          initial={{
            opacity: 0,
          }}
          whileInView={{
            opacity: 1,
          }}
          viewport={{
            once: true,
          }}
          transition={{
            delay: 0.5,
            duration: 0.6,
          }}
          className="
            mt-12
            flex
            flex-wrap
            items-center
            justify-center
            gap-x-8
            gap-y-3
          "
        >
          {[
            "Simple to use",
            "Built for everyday spending",
            "Designed for clarity",
          ].map((item) => (
            <div
              key={item}
              className="
                flex
                items-center
                gap-2
                text-xs
              "
              style={{
                color: c.textFaint,
              }}
            >
              <span
                className="h-1 w-1 rounded-full"
                style={{
                  background: c.primary,
                }}
              />

              {item}
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

export { FeaturesSection };
