Google Login and Security Checklist for Smart Expenses

This implementation uses Supabase Auth’s signInWithOAuth({ provider: "google" }) flow. Supabase requires the Google provider to be configured in the Supabase dashboard, and the OAuth redirect URL used by the application must be on Supabase’s allow list.  

1. Configure Google OAuth

In Google Cloud, create a Web application OAuth client. Add the exact production origin under Authorized JavaScript origins, and add the Supabase callback URL shown on the Supabase Google provider page under Authorized redirect URIs. Do not use a wildcard production origin. 

In Supabase Dashboard, open Authentication → Providers → Google, enable Google, and paste the Google client ID and client secret. Keep the client secret only in Supabase’s server-side provider configuration; never put it in Vite environment variables, browser JavaScript, Git, or this repository.

2. Configure exact redirect URLs

The revised context redirects only to:

Plain Text


${window.location.origin}/dashboard



Add the exact URLs for each environment in Authentication → URL Configuration, for example:

Plain Text


http://localhost:5173/dashboard
https://your-production-domain.example/dashboard



Replace the examples with the actual development and production URLs. Supabase documents that the redirectTo value must match the configured redirect allow list, and recommends exact production paths rather than broad wildcards. 

3. Verify the Supabase client uses PKCE

For a browser-only Vite application, verify src/lib/supabase.ts uses the current publishable key and a client configuration compatible with PKCE:

Plain Text


import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl || !supabaseKey ) {
  throw new Error("Missing Supabase public configuration.");
}

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    flowType: "pkce",
    detectSessionInUrl: true,
    persistSession: true,
    autoRefreshToken: true,
  },
});



Supabase describes PKCE as a one-time authorization-code exchange and notes that the code is short-lived and can only be exchanged once.  If the application uses server-side rendering or cookies, use Supabase’s SSR client rather than copying this browser configuration.

4. Protect every database table with RLS

Google login authenticates a user, but it does not authorize access to another user’s expenses. Every exposed table containing personal data must have Row Level Security enabled, and policies must compare the row owner to auth.uid(). Supabase also warns that policies do not remove broad table grants automatically. 

For an expenses table with a user_id uuid owner column, the policy pattern is:

SQL


alter table public.expenses enable row level security;

revoke all on table public.expenses from anon, authenticated;
grant select, insert, update, delete on table public.expenses to authenticated;

create policy "Users can view their own expenses"
on public.expenses for select
to authenticated
using ((select auth.uid()) = user_id);

create policy "Users can create their own expenses"
on public.expenses for insert
to authenticated
with check ((select auth.uid()) = user_id);

create policy "Users can update their own expenses"
on public.expenses for update
to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

create policy "Users can delete their own expenses"
on public.expenses for delete
to authenticated
using ((select auth.uid()) = user_id);



Apply the same principle to budgets, profiles, receipts, and any other private table. Keep the service_role key on a trusted server only because it bypasses RLS. 

5. Production hardening

Use HTTPS in production, keep the Supabase publishable key public but never expose the service-role key, and do not place Google client secrets in the frontend bundle. Enable email confirmation if password accounts are allowed, configure password reset links to exact approved URLs, and enable MFA for administrators or other high-value accounts.

Do not display raw Supabase errors to users. The revised login page uses generic failure messages, which avoids exposing provider or database details and makes account-enumeration attacks less useful. Add server-side rate limiting or Supabase Auth protection appropriate to your plan, and monitor authentication logs for repeated failures, unusual locations, and OAuth errors.

The frontend changes are a security improvement, not a substitute for authorization. The decisive controls are correct Supabase configuration, HTTPS, RLS policies, secret management, and testing both allowed and denied database access.

References

[1] Supabase: Login with Google
[2] Supabase: Redirect URLs
[3] Supabase: PKCE flow
[4] Supabase: Row Level Security
