import { useState, type FormEvent } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { errorMessage } from "../../lib/errors";
import { register } from "../../store/api";
import { storageStatus } from "../../store/db";
import { pullCloudWorkspace } from "../../store/cloudSync";
import { useAuth } from "./AuthProvider";

export function RegisterPage() {
  const { userId, profile } = useAuth();
  const navigate = useNavigate();
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const storage = storageStatus();

  if (userId) {
    return <Navigate to={profile?.onboardingCompleted ? "/dashboard" : "/onboarding"} replace />;
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      await register(email, password, displayName);
      // Pull cloud workspace after registration (cloud-first storage)
      await pullCloudWorkspace();
      navigate("/onboarding");
    } catch (err) {
      setError(errorMessage(err, "Unable to create the account."));
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="auth-page">
      <section className="auth-panel">
        <p className="eyebrow">DSA MASTERY OS</p>
        <h1>Build your learning system.</h1>
        <p className="muted">
          Create an account to save your progress in the cloud. After signup you are already signed in — your data syncs across all devices automatically.
        </p>
        {!storage.persisted && (
          <p className="form-error" role="status">
            This window cannot save accounts. If login fails after refresh, open the app in a full browser tab.
          </p>
        )}
        <form onSubmit={handleSubmit} className="form-stack">
          <label>
            Display name
            <input required value={displayName} onChange={(e) => setDisplayName(e.target.value)} />
          </label>
          <label>
            Email
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" />
          </label>
          <label>
            Password
            <input type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="new-password" />
          </label>
          {error && <p className="form-error" role="alert">{error}</p>}
          <button className="button button-primary" disabled={loading}>
            {loading ? "Creating account…" : "Create account"}
          </button>
        </form>
        <p className="auth-footer">
          Already registered? <Link to="/login">Sign in</Link>
        </p>
      </section>
    </main>
  );
}
