// src/components/FinalCTA.tsx

import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Check,
  Sparkles,
  TrendingDown,
  Target,
} from "lucide-react";
import { colors as c } from "../lib/theme";

function FinalCTA() {
  const navigate = useNavigate();

  return (
    <section
      className="relative overflow-hidden py-28 md:py-36"
      style={{
        background: c.bg,
        borderTop: `1px solid ${c.border}`,
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
          w-225
          -translate-x-1/2
          -translate-y-1/2
          rounded-full
          blur-[140px]
        "
        style={{
          background: c.primary,
          opacity: 0.07,
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

      {/* ================================================== */}
      {/* DECORATIVE FLOATING ELEMENTS */}
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
        }}
        transition={{
          duration: 0.8,
          delay: 0.2,
        }}
        className="
          pointer-events-none
          absolute
          left-[8%]
          top-[28%]
          hidden
          rounded-2xl
          border
          p-4
          backdrop-blur-xl
          lg:block
        "
        style={{
          background: `${c.card}80`,
          borderColor: c.border,
          boxShadow: `0 20px 50px ${c.bg}60`,
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
              background: `${c.success}10`,
            }}
          >
            <TrendingDown
              className="h-4 w-4"
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
              Monthly spending
            </p>

            <p
              className="text-sm font-semibold"
              style={{
                color: c.text,
              }}
            >
              -12.4%
            </p>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{
          opacity: 0,
          x: 30,
        }}
        whileInView={{
          opacity: 1,
          x: 0,
        }}
        viewport={{
          once: true,
        }}
        transition={{
          duration: 0.8,
          delay: 0.35,
        }}
        className="
          pointer-events-none
          absolute
          right-[8%]
          bottom-[28%]
          hidden
          rounded-2xl
          border
          p-4
          backdrop-blur-xl
          lg:block
        "
        style={{
          background: `${c.card}80`,
          borderColor: c.border,
          boxShadow: `0 20px 50px ${c.bg}60`,
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
              background: `${c.primary}10`,
            }}
          >
            <Target
              className="h-4 w-4"
              style={{
                color: c.primary,
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
              Emergency Fund
            </p>

            <p
              className="text-sm font-semibold"
              style={{
                color: c.text,
              }}
            >
              65% complete
            </p>
          </div>
        </div>
      </motion.div>

      {/* ================================================== */}
      {/* MAIN CTA */}
      {/* ================================================== */}

      <div className="relative z-10 container mx-auto px-6">
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
            amount: 0.3,
          }}
          transition={{
            duration: 0.8,
          }}
          className="
            relative
            mx-auto
            max-w-4xl
            overflow-hidden
            rounded-[2rem]
            border
            px-6
            py-14
            text-center
            sm:px-10
            md:px-16
            md:py-20
          "
          style={{
            background: `${c.card}b8`,
            borderColor: `${c.primary}25`,
            boxShadow: `
              0 30px 100px ${c.bg}80,
              0 0 80px ${c.primary}08
            `,
            backdropFilter: "blur(24px)",
          }}
        >
          {/* Inner glow */}

          <div
            className="
              pointer-events-none
              absolute
              left-1/2
              top-0
              h-64
              w-125
              -translate-x-1/2
              -translate-y-1/2
              rounded-full
              blur-[100px]
            "
            style={{
              background: c.primary,
              opacity: 0.1,
            }}
          />

          {/* Content */}

          <div className="relative z-10">
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
                START YOUR FINANCIAL JOURNEY
              </span>
            </div>

            {/* Heading */}

            <h2
              className="
                mx-auto
                max-w-2xl
                text-4xl
                font-semibold
                tracking-[-0.04em]
                sm:text-5xl
                md:text-6xl
              "
              style={{
                color: c.text,
                lineHeight: 1.05,
              }}
            >
              Take control of your
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
                financial future.
              </span>
            </h2>

            {/* Description */}

            <p
              className="
                mx-auto
                mt-6
                max-w-xl
                text-base
                leading-relaxed
                md:text-lg
              "
              style={{
                color: c.textMuted,
              }}
            >
              Track your spending, understand your habits, and make smarter
              financial decisions — all in one place.
            </p>

            {/* Buttons */}

            <div
              className="
                mt-9
                flex
                flex-col
                items-center
                justify-center
                gap-3
                sm:flex-row
              "
            >
              <button
                onClick={() => navigate("/signup")}
                className="
                  group
                  flex
                  items-center
                  justify-center
                  gap-2
                  rounded-full
                  px-7
                  py-3.5
                  text-sm
                  font-semibold
                  transition-all
                  duration-200
                  hover:scale-[1.03]
                "
                style={{
                  background: c.primary,
                  color: c.bg,
                  boxShadow: `0 10px 35px ${c.primary}35`,
                }}
              >
                Get Started 
                <ArrowRight
                  className="
                    h-4
                    w-4
                    transition-transform
                    duration-200
                    group-hover:translate-x-1
                  "
                />
              </button>

              <button
                onClick={() => navigate("/dashboard")}
                className="
                  flex
                  items-center
                  justify-center
                  gap-2
                  rounded-full
                  border
                  px-7
                  py-3.5
                  text-sm
                  font-semibold
                  transition-all
                  duration-200
                  hover:bg-white/5
                "
                style={{
                  background: "transparent",
                  borderColor: c.border,
                  color: c.text,
                }}
              >
                Explore Dashboard
              </button>
            </div>

            {/* Trust indicators */}

            <div
              className="
                mt-8
                flex
                flex-wrap
                items-center
                justify-center
                gap-x-6
                gap-y-3
              "
            >
              {[
                "Simple to use",
                "Built for everyday spending",
                "Secure & private",
              ].map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-1.5"
                  style={{
                    color: c.textFaint,
                  }}
                >
                  <Check
                    className="h-3.5 w-3.5"
                    style={{
                      color: c.success,
                    }}
                  />

                  <span className="text-xs">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export { FinalCTA };
