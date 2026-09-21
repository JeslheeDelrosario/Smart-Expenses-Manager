import { supabase } from "../lib/supabase";
import { defaultPreferences, type UserPreferences } from "../types/preferences";

export async function fetchUserPreferences(userId: string): Promise<UserPreferences> {
  const { data, error } = await supabase
    .from("user_preferences")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle();

  if (error && error.code !== "PGRST116" && error.code !== "PGRST205") {
    throw error;
  }

  return {
    ...defaultPreferences,
    ...(data ?? {}),
  };
}

export async function upsertUserPreferences(
  userId: string,
  preferences: Partial<UserPreferences>,
): Promise<UserPreferences> {
  const payload = {
    user_id: userId,
    ...defaultPreferences,
    ...preferences,
  };

  const { data, error } = await supabase
    .from("user_preferences")
    .upsert(payload, { onConflict: "user_id" })
    .select()
    .single();

  if (error) {
    throw error;
  }

  return {
    ...defaultPreferences,
    ...(data ?? {}),
  };
}
