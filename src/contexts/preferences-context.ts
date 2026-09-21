import { createContext } from "react";
import { type UserPreferences } from "../types/preferences";

export interface PreferencesContextValue {
  preferences: UserPreferences;
  isLoading: boolean;
  updatePreference: <K extends keyof UserPreferences>(
    key: K,
    value: UserPreferences[K],
  ) => Promise<void>;
  updatePreferences: (patch: Partial<UserPreferences>) => Promise<void>;
  refreshPreferences: () => Promise<void>;
}

export const PreferencesContext = createContext<PreferencesContextValue | undefined>(undefined);