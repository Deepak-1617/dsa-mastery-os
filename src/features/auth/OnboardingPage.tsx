import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import type { ExperienceLevel, GoalType, StudyPace } from "../../types/models";
import { completeOnboarding } from "../../store/api";
import { useAuth } from "./AuthProvider";

const GOALS: { id: GoalType; label: string }[] = [
  { id: "college_exam", label: "College exams" },
  { id: "crt", label: "CRT" },
  { id: "pat", label: "PAT" },
  { id: "placements", label: "Placements" },
  { id: "interviews", label: "Interviews" },
  { id: "certification", label: "Certification" },
  { id: "personal", label: "Personal learning" },
];

export function OnboardingPage() {
  const { profile } = useAuth();
  const navigate = useNavigate();
  const [displayName, setDisplayName] = useState(profile?.displayName ?? "");
  const [language, setLanguage] = useState(profile?.preferredLanguage ?? "Java");
  const [experience, setExperience] = useState<ExperienceLevel>("beginner");
  const [pace, setPace] = useState<StudyPace>("steady");
  const [group, setGroup] = useState(false);
  const [goals, setGoals] = useState<GoalType[]>(["placements"]);

  function toggleGoal(id: GoalType) {
    setGoals((current) => (current.includes(id) ? current.filter((g) => g !== id) : [...current, id]));
  }

  function submit(event: FormEvent) {
    event.preventDefault();
    completeOnboarding({
      displayName,
      preferredLanguage: language,
      experienceLevel: experience,
      studyPace: pace,
      prefersGroupLearning: group,
      goals,
    });
    navigate("/dashboard");
  }

  return (
    <main className="auth-page">
      <section className="auth-panel" style={{ width: "min(560px, 100%)" }}>
        <p className="eyebrow">ONBOARDING</p>
        <h1>Set your defaults.</h1>
        <p className="muted">Optional questions. You can skip goals and change everything later in Profile.</p>
        <form className="form-stack onboard" onSubmit={submit}>
          <label>
            Preferred name
            <input value={displayName} onChange={(e) => setDisplayName(e.target.value)} />
          </label>
          <label>
            Primary language
            <select value={language} onChange={(e) => setLanguage(e.target.value)}>
              <option>Java</option>
              <option>Python</option>
            </select>
          </label>
          <div>
            <p className="eyebrow">EXPERIENCE</p>
            <div className="choice-grid">
              {(["beginner", "intermediate", "advanced"] as ExperienceLevel[]).map((item) => (
                <button type="button" key={item} className={`choice ${experience === item ? "on" : ""}`} onClick={() => setExperience(item)}>
                  {item}
                </button>
              ))}
            </div>
          </div>
          <div>
            <p className="eyebrow">PACE</p>
            <div className="choice-grid">
              {(["light", "steady", "intense"] as StudyPace[]).map((item) => (
                <button type="button" key={item} className={`choice ${pace === item ? "on" : ""}`} onClick={() => setPace(item)}>
                  {item}
                </button>
              ))}
            </div>
          </div>
          <div>
            <p className="eyebrow">GOALS</p>
            <div className="choice-grid">
              {GOALS.map((goal) => (
                <button type="button" key={goal.id} className={`choice ${goals.includes(goal.id) ? "on" : ""}`} onClick={() => toggleGoal(goal.id)}>
                  {goal.label}
                </button>
              ))}
            </div>
          </div>
          <label style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <input type="checkbox" checked={group} onChange={(e) => setGroup(e.target.checked)} style={{ width: "auto" }} />
            I may prepare with friends
          </label>
          <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
            <button type="button" className="button button-secondary" onClick={() => {
              completeOnboarding({
                displayName: displayName || profile?.displayName || "Student",
                preferredLanguage: "Java",
                experienceLevel: "beginner",
                studyPace: "steady",
                prefersGroupLearning: false,
                goals: ["personal"],
              });
              navigate("/dashboard");
            }}>
              Skip
            </button>
            <button className="button button-primary">Save and continue</button>
          </div>
        </form>
      </section>
    </main>
  );
}
