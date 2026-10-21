import { useState, type FormEvent } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { errorMessage } from "../../lib/errors";
import { env } from "../../lib/env";
import { listLocalEmails, login } from "../../store/api";
import { storageStatus } from "../../store/db";
import { pullCloudWorkspace } from "../../store/cloudSync";
import { useAuth } from "./AuthProvider";

export function LoginPage() {
  const { userId, profile } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const savedEmails = listLocalEmails();
  const storage = storageStatus();

  if (userId) {
    return <Navigate to={profile?.onboardingCompleted ? "/dashboard" : "/onboarding"} replace />;
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      const next = await login(email, password);
      // Pull cloud workspace after successful login (cloud-first storage)
      await pullCloudWorkspace();
      navigate(next.onboardingCompleted ? "/dashboard" : "/onboarding");
    } catch (err) {
      setError(errorMessage(err, "Unable to sign in."));
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="auth-page">
      <section className="auth-panel">
        <p className="eyebrow">DSA MASTERY OS</p>
        <h1>Continue learning.</h1>
        <p className="muted">
          {env.persistence === "local"
            ? "Local workspace: accounts live in this browser only. Restarting the preview on a new URL wipes them. To keep the same login across devices, paste VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY into dsa-mastery-os/.env.local and restart Vite."
            : "Cloud storage is on. Your progress syncs across all devices automatically."}
        </p>
        {!storage.persisted && (
          <p className="form-error" role="status">
            Saving is blocked in this window, so new accounts will not survive a refresh. Open the preview in a new browser tab if login keeps failing.
          </p>
        )}
        {env.persistence === "local" && savedEmails.length > 0 && (
          <p className="auth-saved">
            Saved on this device: {savedEmails.join(", ")}
          </p>
        )}
        <form onSubmit={handleSubmit} className="form-stack">
          <label>
            Email
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" />
          </label>
          <label>
            Password
            <input type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" />
          </label>
          {error && <p className="form-error" role="alert">{error}</p>}
          <button className="button button-primary" disabled={loading}>
            {loading ? "Signing in…" : "Sign in"}
          </button>
        </form>
        <p className="auth-footer">
          New here? <Link to="/register">Create an account</Link>
        </p>
      </section>
    </main>
  );
}
