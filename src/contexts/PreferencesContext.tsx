import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useAuth } from "./AuthContext";
import { fetchUserPreferences, upsertUserPreferences } from "../services/preferences.service";
import { defaultPreferences, type UserPreferences } from "../types/preferences";
import { PreferencesContext, type PreferencesContextValue } from "./preferences-context";

export function PreferencesProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [preferences, setPreferences] = useState<UserPreferences>(defaultPreferences);
  const [isLoading, setIsLoading] = useState(true);

  const syncTheme = useCallback((darkMode: boolean) => {
    document.documentElement.classList.toggle("dark", darkMode);
    document.documentElement.style.colorScheme = darkMode ? "dark" : "light";
  }, []);

  const refreshPreferences = useCallback(async () => {
    if (!user) {
      setPreferences(defaultPreferences);
      syncTheme(defaultPreferences.dark_mode);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      const nextPreferences = await fetchUserPreferences(user.id);
      setPreferences(nextPreferences);
      syncTheme(nextPreferences.dark_mode);
    } catch (error) {
      console.error("Failed to load preferences:", error);
      setPreferences(defaultPreferences);
      syncTheme(defaultPreferences.dark_mode);
    } finally {
      setIsLoading(false);
    }
  }, [syncTheme, user]);

  useEffect(() => {
    void refreshPreferences();
  }, [refreshPreferences]);

  const updatePreference = useCallback(async <K extends keyof UserPreferences>(
    key: K,
    value: UserPreferences[K],
  ) => {
    const nextPreferences = { ...preferences, [key]: value };
    setPreferences(nextPreferences);
    syncTheme(nextPreferences.dark_mode);

    if (!user) {
      return;
    }

    try {
      const saved = await upsertUserPreferences(user.id, { [key]: value });
      setPreferences(saved);
      syncTheme(saved.dark_mode);
    } catch (error) {
      console.error("Failed to save preference:", error);
      setPreferences(preferences);
      syncTheme(preferences.dark_mode);
    }
  }, [preferences, syncTheme, user]);

  const updatePreferences = useCallback(async (patch: Partial<UserPreferences>) => {
    const nextPreferences = { ...preferences, ...patch };
    setPreferences(nextPreferences);
    syncTheme(nextPreferences.dark_mode);

    if (!user) {
      return;
    }

    try {
      const saved = await upsertUserPreferences(user.id, patch);
      setPreferences(saved);
      syncTheme(saved.dark_mode);
    } catch (error) {
      console.error("Failed to save preferences:", error);
      setPreferences(preferences);
      syncTheme(preferences.dark_mode);
    }
  }, [preferences, syncTheme, user]);

  const value = useMemo<PreferencesContextValue>(
    () => ({
      preferences,
      isLoading,
      updatePreference,
      updatePreferences,
      refreshPreferences,
    }),
    [preferences, isLoading, refreshPreferences, updatePreference, updatePreferences],
  );

  return (
    <PreferencesContext.Provider value={value}>{children}</PreferencesContext.Provider>
  );
}

