import { useState, type FormEvent } from "react";
import { useAppStore } from "../../store/useAppStore";
import type { GoalType } from "../../types/models";
import { deletePlan, listPlans, savePlan, updateProfile } from "../../store/api";
import { useAuth } from "../auth/AuthProvider";
import { env } from "../../lib/env";
import { topics } from "../../data/topics";
import { Link, useNavigate } from "react-router-dom";

const GOALS: GoalType[] = ["college_exam", "crt", "pat", "placements", "interviews", "certification", "personal"];

export function ProfilePage() {
  useAppStore();
  const { profile, signOut } = useAuth();
  const navigate = useNavigate();
  const [displayName, setDisplayName] = useState(profile?.displayName ?? "");
  const [language, setLanguage] = useState(profile?.preferredLanguage ?? "Java");
  const [planName, setPlanName] = useState("CRT sprint");
  const [goalType, setGoalType] = useState<GoalType>("crt");
  const [saved, setSaved] = useState("");
  const plans = listPlans();

  function onSave(event: FormEvent) {
    event.preventDefault();
    updateProfile({ displayName, preferredLanguage: language });
    setSaved("Profile saved.");
  }

  return (
    <section className="page">
      <p className="eyebrow">PROFILE</p>
      <h1>Account and preparation plans.</h1>
      <p className="muted">Persistence: {env.persistence === "local" ? "this browser (local workspace)" : "Supabase"}. One learning engine for every goal type.</p>

      <form className="panel form-stack" style={{ marginTop: 24, maxWidth: 520 }} onSubmit={onSave}>
        <label>Display name<input value={displayName} onChange={(e) => setDisplayName(e.target.value)} /></label>
        <label>
          Language
          <select value={language} onChange={(e) => setLanguage(e.target.value)}>
            <option>Java</option>
            <option>Python</option>
          </select>
        </label>
        <p className="muted">Email: {profile?.email}</p>
        {saved && <p className="form-success">{saved}</p>}
        <div style={{ display: "flex", gap: 12 }}>
          <button className="button button-primary">Save profile</button>
          <button
            type="button"
            className="button button-danger"
            onClick={() => {
              signOut();
              navigate("/login");
            }}
          >
            Sign out
          </button>
        </div>
      </form>

      <div className="panel" style={{ marginTop: 24 }}>
        <h2>Preparation plans</h2>
        <p className="muted">Plans reference the same topics and problems. They do not duplicate the curriculum.</p>
        <form
          className="form-stack"
          style={{ maxWidth: 520, margin: "16px 0" }}
          onSubmit={(e) => {
            e.preventDefault();
            savePlan({
              name: planName,
              goalType,
              targetDate: null,
              priority: 3,
              notes: "",
              topicIds: topics.slice(0, 8).map((t) => t.id),
              problemIds: [],
            });
          }}
        >
          <label>Plan name<input value={planName} onChange={(e) => setPlanName(e.target.value)} /></label>
          <label>
            Goal type
            <select value={goalType} onChange={(e) => setGoalType(e.target.value as GoalType)}>
              {GOALS.map((g) => <option key={g} value={g}>{g.replaceAll("_", " ")}</option>)}
            </select>
          </label>
          <button className="button button-secondary">Create plan from first 8 topics</button>
        </form>
        <div className="stack">
          {plans.length === 0 && <p className="muted">No plans yet.</p>}
          {plans.map((plan) => (
            <div key={plan.id} className="topic-row">
              <span className="topic-main">
                <strong>{plan.name}</strong>
                <span>{plan.goalType.replaceAll("_", " ")} · {plan.topicIds.length} topics</span>
              </span>
              <button className="button button-ghost" onClick={() => deletePlan(plan.id)}>Delete</button>
            </div>
          ))}
        </div>
      </div>

      <p style={{ marginTop: 24 }}>
        Optional Python track: <Link className="text-link" to="/python">eight sessions</Link>
      </p>
    </section>
  );
}
