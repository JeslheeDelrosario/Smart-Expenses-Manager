// src/components/Navbar.tsx
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Menu, X, ArrowUpRight } from "lucide-react";
import { colors as c } from "../lib/theme";

const LINKS = [
  { label: "Features", href: "#features" },
  { label: "Insights", href: "#insights" },
  { label: "How It Works", href: "#how-it-works" },
];

function Navbar() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleNavigate = (path: string) => {
    setOpen(false);
    navigate(path);
  };

  const handleScroll = (href: string) => {
    setOpen(false);

    const element = document.querySelector(href);

    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="fixed top-0 left-0 right-0 z-50 px-4 pt-4 md:px-6 "
    >
      <nav
        className="
          relative mx-auto
          max-w-6xl
          h-16
          flex items-center justify-between
          px-4 md:px-5
          rounded-2xl
          border
          backdrop-blur-2xl
        "
        style={{
          background: `${c.bg}d9`,
          borderColor: `${c.border}cc`,
          boxShadow: `0 8px 40px ${c.bg}70`,
        }}
      >
        {/* Ambient glow */}
        <div
          className="absolute inset-0 -z-10 rounded-2xl opacity-30 blur-xl"
          style={{
            background: `linear-gradient(
              90deg,
              ${c.primary}20,
              transparent 40%,
              ${c.primary}10
            )`,
          }}
        />

        {/* Brand */}
        <button
          onClick={() => handleScroll("#home")}
          className="group flex items-center gap-2.5 shrink-0"
          aria-label="Smart Expenses home"
        >
          <motion.span
            whileHover={{ rotate: 90, scale: 1.05 }}
            transition={{ duration: 0.25 }}
            className="
              relative
              flex h-9 w-9
              items-center justify-center
              rounded-xl
              text-sm font-bold
            "
            style={{
              background: c.primarySoft,
              color: c.primary,
              boxShadow: `0 0 24px ${c.primary}20`,
            }}
          >
            ◈
          </motion.span>

          <span
            className="hidden sm:block text-sm font-semibold tracking-tight"
            style={{ color: c.text }}
          >
            Smart Expenses
          </span>
        </button>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center">
          <div
            className="
              flex items-center gap-1
              rounded-xl
              px-1.5 py-1.5
            "
          >
            {LINKS.map((link) => (
              <button
                key={link.label}
                onClick={() => handleScroll(link.href)}
                className="
                  relative
                  px-3.5 py-2
                  rounded-lg
                  text-sm
                  font-medium
                  transition-colors
                  duration-200
                "
                style={{
                  color: c.textMuted,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = c.text;
                  e.currentTarget.style.background = `${c.text}08`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = c.textMuted;
                  e.currentTarget.style.background = "transparent";
                }}
              >
                {link.label}
              </button>
            ))}
          </div>
        </div>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-2">
          <button
            onClick={() => handleNavigate("/login")}
            className="
              px-3.5 py-2
              rounded-lg
              text-sm
              font-medium
              transition-all
              duration-200
            "
            style={{
              color: c.textMuted,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = c.text;
              e.currentTarget.style.background = `${c.text}08`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = c.textMuted;
              e.currentTarget.style.background = "transparent";
            }}
          >
            Log in
          </button>

          <motion.button
            whileHover={{
              scale: 1.03,
              boxShadow: `0 8px 30px ${c.primary}35`,
            }}
            whileTap={{ scale: 0.97 }}
            onClick={() => handleNavigate("/signup")}
            className="
              group
              flex items-center gap-1.5
              px-4 py-2.5
              rounded-xl
              text-sm
              font-semibold
            "
            style={{
              background: c.primary,
              color: c.bg,
              boxShadow: `0 4px 20px ${c.primary}25`,
            }}
          >
            Get Started
            <ArrowUpRight
              className="
                w-3.5 h-3.5
                transition-transform
                duration-200
                group-hover:-translate-y-0.5
                group-hover:translate-x-0.5
              "
            />
          </motion.button>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="
            md:hidden
            flex h-10 w-10
            items-center justify-center
            rounded-xl
            transition-colors
          "
          style={{
            color: c.text,
            background: `${c.text}08`,
          }}
          onClick={() => setOpen(!open)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
        >
          <AnimatePresence mode="wait" initial={false}>
            {open ? (
              <motion.div
                key="close"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
              >
                <X className="w-5 h-5" />
              </motion.div>
            ) : (
              <motion.div
                key="menu"
                initial={{ rotate: 90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: -90, opacity: 0 }}
              >
                <Menu className="w-5 h-5" />
              </motion.div>
            )}
          </AnimatePresence>
        </button>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.98 }}
            transition={{
              duration: 0.2,
              ease: "easeOut",
            }}
            className="
              md:hidden
              mx-auto mt-2
              max-w-6xl
              rounded-2xl
              border
              overflow-hidden
              backdrop-blur-2xl
            "
            style={{
              background: `${c.bg}f2`,
              borderColor: `${c.border}cc`,
              boxShadow: `0 20px 50px ${c.bg}80`,
            }}
          >
            <div className="p-3">
              {/* Mobile Links */}
              <div className="space-y-1">
                {LINKS.map((link, index) => (
                  <motion.button
                    key={link.label}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{
                      delay: index * 0.05,
                    }}
                    onClick={() => handleScroll(link.href)}
                    className="
                      w-full
                      flex items-center
                      px-4 py-3
                      rounded-xl
                      text-left
                      text-sm
                      font-medium
                      transition-colors
                    "
                    style={{
                      color: c.textMuted,
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = c.text;
                      e.currentTarget.style.background = `${c.text}08`;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = c.textMuted;
                      e.currentTarget.style.background = "transparent";
                    }}
                  >
                    {link.label}
                  </motion.button>
                ))}
              </div>

              {/* Divider */}
              <div
                className="my-3 h-px"
                style={{
                  background: c.border,
                }}
              />

              {/* Mobile Actions */}
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => handleNavigate("/login")}
                  className="
                    px-4 py-3
                    rounded-xl
                    text-sm
                    font-medium
                    transition-colors
                  "
                  style={{
                    color: c.textMuted,
                    background: `${c.text}06`,
                  }}
                >
                  Log in
                </button>

                <button
                  onClick={() => handleNavigate("/signup")}
                  className="
                    px-4 py-3
                    rounded-xl
                    text-sm
                    font-semibold
                  "
                  style={{
                    background: c.primary,
                    color: c.bg,
                  }}
                >
                  Get Started →
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}

export { Navbar };
