import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

if (!supabaseUrl || !supabaseKey) {
  throw new Error("Missing Supabase configuration. Check your environment variables.");
}

// Create a secure supabase client with PKCE flow and proper security settings
export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    flowType: "pkce", // Enable PKCE for enhanced OAuth security
    detectSessionInUrl: true,
    persistSession: true,
    autoRefreshToken: true,
    storage: {
      getItem: (key) => {
        const value = sessionStorage.getItem(key);
        return value ? JSON.parse(value) : null;
      },
      setItem: (key, value) => {
        sessionStorage.setItem(key, JSON.stringify(value));
      },
      removeItem: (key) => {
        sessionStorage.removeItem(key);
      },
    },
  },
});