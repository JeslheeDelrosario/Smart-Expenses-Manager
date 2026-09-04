import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

export default function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    const finishLogin = async () => {
      const { data, error } = await supabase.auth.getSession();

      if (error || !data.session) {
        navigate("/login", { replace: true });
      } else {
        navigate("/dashboard", { replace: true });
      }
    };

    void finishLogin();
  }, [navigate]);

  return <p>Signing you in…</p>;
}
