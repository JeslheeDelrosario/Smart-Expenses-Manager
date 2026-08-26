import {
  createContext,
  useContext,
  useEffect,
  useState,
  useRef,
  useCallback,
  type ReactNode,
} from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "../lib/supabase";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signUp: (email: string, password: string, fullName: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

// 30 minutes of inactivity
const INACTIVE_TIMEOUT = 30 * 60 * 1000;

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Use a ref so the timeout ID is stable across renders
  const timeoutIdRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ---------- Session loading ----------
  useEffect(() => {
    let isMounted = true;

    const loadSession = async () => {
      const {
        data: { session: currentSession },
        error,
      } = await supabase.auth.getSession();

      if (!isMounted) return;

      if (error) {
        setSession(null);
        setUser(null);
      } else if (currentSession) {
        const expiresAt = currentSession.expires_at ?? 0;
        const now = Math.floor(Date.now() / 1000);

        if (expiresAt < now) {
          await supabase.auth.signOut();
          setSession(null);
          setUser(null);
        } else {
          setSession(currentSession);
          setUser(currentSession.user ?? null);
        }
      } else {
        setSession(null);
        setUser(null);
      }

      setIsLoading(false);
    };

    void loadSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      if (!isMounted) return;

      if (nextSession) {
        const expiresAt = nextSession.expires_at ?? 0;
        const now = Math.floor(Date.now() / 1000);

        if (expiresAt < now) {
          void supabase.auth.signOut();
          setSession(null);
          setUser(null);
        } else {
          setSession(nextSession);
          setUser(nextSession.user ?? null);
        }
      } else {
        setSession(null);
        setUser(null);
      }

      setIsLoading(false);
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  // ---------- Auth methods ----------
  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email: normalizeEmail(email),
      password,
    });
    if (error) throw error;
  };

  const signInWithGoogle = async () => {
    // Fixed redirect — never take this from user input
    const redirectTo = `${window.location.origin}/dashboard`;

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo,
        queryParams: {
          prompt: "select_account",
        },
      },
    });

    if (error) throw error;
  };

  const signUp = async (email: string, password: string, fullName: string) => {
    const { error } = await supabase.auth.signUp({
      email: normalizeEmail(email),
      password,
      options: {
        data: {
          full_name: fullName.trim().slice(0, 120),
        },
      },
    });
    if (error) throw error;
  };

  const signOut = useCallback(async () => {
    if (timeoutIdRef.current) {
      clearTimeout(timeoutIdRef.current);
      timeoutIdRef.current = null;
    }
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  }, []);

  // ---------- Inactivity timeout ----------
  const resetInactivityTimer = useCallback(() => {
    if (timeoutIdRef.current) {
      clearTimeout(timeoutIdRef.current);
    }

    if (user) {
      timeoutIdRef.current = setTimeout(() => {
        void signOut().then(() => {
          window.location.href = "/login";
        });
      }, INACTIVE_TIMEOUT);
    }
  }, [user, signOut]);

  useEffect(() => {
    if (!user) return;

    const events = [
      "mousedown",
      "mousemove",
      "keypress",
      "scroll",
      "click",
      "touchstart",
    ];

    events.forEach((event) => {
      document.addEventListener(event, resetInactivityTimer, { passive: true });
    });

    // Start the timer immediately
    resetInactivityTimer();

    return () => {
      if (timeoutIdRef.current) {
        clearTimeout(timeoutIdRef.current);
        timeoutIdRef.current = null;
      }
      events.forEach((event) => {
        document.removeEventListener(event, resetInactivityTimer);
      });
    };
  }, [user, resetInactivityTimer]);

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        isLoading,
        signIn,
        signInWithGoogle,
        signUp,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}
