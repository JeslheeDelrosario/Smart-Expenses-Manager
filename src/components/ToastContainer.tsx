import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, XCircle, AlertTriangle, X, Loader2 } from "lucide-react";
import type { Toast, ToastType } from "./useToast";

const icons: Record<ToastType, React.ReactNode> = {
  success: <CheckCircle className="w-5 h-5 text-green-400 shrink-0" />,
  error: <XCircle className="w-5 h-5 text-red-400 shrink-0" />,
  warning: <AlertTriangle className="w-5 h-5 text-yellow-400 shrink-0" />,
  loading: <Loader2 className="w-5 h-5 text-[#818cf8] shrink-0 animate-spin" />,
};

const bars: Record<ToastType, string> = {
  success: "bg-green-400",
  error: "bg-red-400",
  warning: "bg-yellow-400",
  loading: "bg-[#818cf8]",
};

interface ToastContainerProps {
  toasts: Toast[];
  dismiss: (id: number) => void;
}

export default function ToastContainer({ toasts, dismiss }: ToastContainerProps) {
  return (
    <div className="fixed top-6 right-6 z-[9999] flex flex-col gap-3 pointer-events-none">
      <AnimatePresence initial={false}>
        {toasts.map((t) => (
          <motion.div
            key={t.id}
            layout
            initial={{ opacity: 0, x: 40, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 40, scale: 0.95 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className="pointer-events-auto relative w-80 overflow-hidden rounded-xl bg-[#1e293b] border border-[#334155] shadow-2xl"
          >
            <div className="flex items-center gap-3 px-4 py-3.5">
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={t.type}
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.5 }}
                  transition={{ duration: 0.15 }}
                >
                  {icons[t.type]}
                </motion.span>
              </AnimatePresence>

              <AnimatePresence mode="wait" initial={false}>
                <motion.p
                  key={t.message}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.15 }}
                  className="flex-1 text-sm font-medium text-[#f1f5f9]"
                >
                  {t.message}
                </motion.p>
              </AnimatePresence>

              {t.type !== "loading" && (
                <button
                  onClick={() => dismiss(t.id)}
                  className="text-gray-500 hover:text-gray-300 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {t.type !== "loading" && t.duration && (
              <motion.div
                key={`${t.id}-${t.type}`}
                className={`absolute bottom-0 left-0 h-0.5 ${bars[t.type]}`}
                initial={{ width: "100%" }}
                animate={{ width: "0%" }}
                transition={{ duration: t.duration / 1000, ease: "linear" }}
              />
            )}

            {t.type === "loading" && (
              <motion.div className="absolute bottom-0 left-0 h-0.5 w-full bg-[#818cf8]/30">
                <motion.div
                  className="h-full bg-[#818cf8] rounded-full"
                  animate={{ x: ["0%", "150%", "0%"] }}
                  transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
                  style={{ width: "40%" }}
                />
              </motion.div>
            )}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
