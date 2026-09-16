import { useState, useCallback } from "react";

export type ToastType = "success" | "error" | "warning" | "loading";

export interface Toast {
  id: number;
  message: string;
  type: ToastType;
  duration?: number;
}

let _id = 0;

export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const dismiss = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = useCallback(
    (message: string, type: ToastType = "success", duration = 3500) => {
      const id = ++_id;
      setToasts((prev) => [...prev, { id, message, type, duration }]);
      if (type !== "loading") {
        setTimeout(() => dismiss(id), duration);
      }
      return id;
    },
    [dismiss],
  );

  const promiseToast = useCallback(
    async <T,>(
      promise: Promise<T>,
      messages: { loading: string; success: string; error: string },
    ): Promise<T> => {
      const id = ++_id;

      setToasts((prev) => [
        ...prev,
        { id, message: messages.loading, type: "loading" },
      ]);

      try {
        const result = await promise;

        setToasts((prev) =>
          prev.map((t) =>
            t.id === id
              ? { ...t, message: messages.success, type: "success", duration: 3500 }
              : t,
          ),
        );
        setTimeout(() => dismiss(id), 3500);

        return result;
      } catch (err) {
        setToasts((prev) =>
          prev.map((t) =>
            t.id === id
              ? { ...t, message: messages.error, type: "error", duration: 3500 }
              : t,
          ),
        );
        setTimeout(() => dismiss(id), 3500);

        throw err;
      }
    },
    [dismiss],
  );

  return { toasts, toast, promiseToast, dismiss };
}
