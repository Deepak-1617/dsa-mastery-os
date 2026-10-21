import { useState, type FormEvent } from "react";
import { useAppStore } from "../../store/useAppStore";
import { topics } from "../../data/topics";
import { problems } from "../../data/problems";
import { errorMessage } from "../../lib/errors";
import {
  acceptInvitation,
  createChallenge,
  createGroup,
  createInvitation,
  createSharedRoadmap,
  currentProfile,
  groupMembers,
  leaveGroup,
  listChallenges,
  listGroups,
  listSharedRoadmaps,
  pendingInvitations,
  setShareProgress,
} from "../../store/api";

export function GroupsPage() {
  useAppStore();
  const profile = currentProfile();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [token, setToken] = useState("");
  const [error, setError] = useState("");
  const [selected, setSelected] = useState<string | null>(null);
  const groups = listGroups();
  const active = groups.find((g) => g.id === selected) ?? groups[0];

  function wrap(fn: () => void | Promise<void>) {
    try {
      setError("");
      const result = fn();
      if (result instanceof Promise) {
        result.catch((err) => setError(errorMessage(err)));
      }
    } catch (err) {
      setError(errorMessage(err));
    }
  }

  function onCreate(event: FormEvent) {
    event.preventDefault();
    wrap(() => {
      const group = createGroup(name, description);
      setName("");
      setDescription("");
      setSelected(group.id);
    });
  }

  const members = active ? groupMembers(active.id) : [];
  const me = members.find((m) => m.userId === profile?.id);
  const invites = active ? pendingInvitations(active.id) : [];
  const roadmaps = active ? listSharedRoadmaps(active.id) : [];
  const challenges = active ? listChallenges(active.id) : [];

  return (
    <section className="page">
      <p className="eyebrow">GROUPS</p>
      <h1>Prepare with friends, keep notes private.</h1>
      <p className="muted">
        Invitations use a single-use-style token stored locally in this workspace. Realtime multi-device sync requires Supabase.
        Personal notes, drafts, and AI chats are never shared.
      </p>
      {error && <p className="form-error" role="alert">{error}</p>}

      <div className="card-grid" style={{ marginTop: 28, gridTemplateColumns: "1fr 1fr" }}>
        <form className="panel form-stack" onSubmit={onCreate}>
          <h2>Create a group</h2>
          <label>Name<input value={name} onChange={(e) => setName(e.target.value)} required /></label>
          <label>Description<input value={description} onChange={(e) => setDescription(e.target.value)} /></label>
          <button className="button button-primary">Create</button>
        </form>
        <form className="panel form-stack" onSubmit={async (e) => { 
          e.preventDefault(); 
          wrap(async () => {
            const group = await acceptInvitation(token.trim());
            setToken("");
            setSelected(group.id);
          }); 
        }}>
          <h2>Join with a token</h2>
          <label>Invitation token<input value={token} onChange={(e) => setToken(e.target.value)} required /></label>
          <button className="button button-secondary">Join</button>
        </form>
      </div>

      <div className="topic-list" style={{ marginTop: 24 }}>
        {groups.length === 0 && <p className="muted">You have not joined a group yet.</p>}
        {groups.map((group) => (
          <button key={group.id} className="topic-row" onClick={() => setSelected(group.id)}>
            <span className="topic-main">
              <strong>{group.name}</strong>
              <span>{group.description || "No description"}</span>
            </span>
          </button>
        ))}
      </div>

      {active && (
        <div className="stack" style={{ marginTop: 28 }}>
          <div className="panel">
            <h2>{active.name}</h2>
            <p className="muted">Your role: {me?.role}. Progress sharing: {me?.shareProgress ? "on" : "off"}.</p>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              <button className="button button-secondary" onClick={() => wrap(() => setShareProgress(active.id, !me?.shareProgress))}>
                {me?.shareProgress ? "Stop sharing progress" : "Share topic progress"}
              </button>
              {(me?.role === "OWNER" || me?.role === "ADMIN") && (
                <button className="button button-secondary" onClick={() => wrap(async () => {
                  const inv = await createInvitation(active.id);
                  const tokenText = inv.token;
                  navigator.clipboard.writeText(tokenText).then(() => {
                    alert(`Invitation token copied to clipboard!\n\nToken: ${tokenText}\n\nShare this with someone to invite them to the group.`);
                  }).catch(() => {
                    window.prompt("Share this invitation token (copy it):", tokenText);
                  });
                })}>
                  Create invitation
                </button>
              )}
              {me?.role !== "OWNER" && (
                <button className="button button-danger" onClick={() => wrap(() => leaveGroup(active.id))}>Leave</button>
              )}
            </div>
            <h3>Members</h3>
            <ul>{members.map((m) => <li key={m.userId}>{m.userId === profile?.id ? "You" : m.userId.slice(0, 8)} — {m.role}</li>)}</ul>
            {invites.length > 0 && (
              <>
                <h3>Pending invitations</h3>
                <ul>{invites.map((inv) => (
                  <li key={inv.id} style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
                    <code style={{ 
                      background: "#f5f5f5", 
                      padding: "4px 8px", 
                      borderRadius: "4px",
                      fontFamily: "monospace",
                      fontSize: "14px",
                      letterSpacing: "1px"
                    }}>
                      {inv.token}
                    </code>
                    <button 
                      className="button button-secondary" 
                      style={{ padding: "4px 8px", fontSize: "12px" }}
                      onClick={() => {
                        navigator.clipboard.writeText(inv.token).then(() => {
                          alert("Token copied!");
                        }).catch(() => {
                          window.prompt("Copy this token:", inv.token);
                        });
                      }}
                    >
                      Copy
                    </button>
                    <span style={{ fontSize: "12px", color: "#666" }}>
                      expires {new Date(inv.expiresAt).toLocaleDateString()}
                    </span>
                  </li>
                ))}</ul>
              </>
            )}
          </div>

          {(me?.role === "OWNER" || me?.role === "ADMIN") && (
            <div className="panel">
              <h2>Shared roadmap</h2>
              <button className="button button-secondary" onClick={() => wrap(() => createSharedRoadmap(
                active.id,
                "Phase 1 core",
                "Shared foundations",
                topics.filter((t) => t.phase === 1).map((t) => t.id),
                problems.filter((p) => p.topicSlugs.includes("arrays")).slice(0, 5).map((p) => p.id),
              ))}>
                Share Phase 1 topics
              </button>
              <ul>{roadmaps.map((r) => <li key={r.id}>{r.title} · {r.topicIds.length} topics</li>)}</ul>
              <h2>Challenge</h2>
              <button className="button button-secondary" onClick={() => wrap(() => createChallenge({
                groupId: active.id,
                title: "Weekend five",
                description: "Five easy problems. Completion is recorded only from trusted judged passes when a runner exists.",
                startAt: new Date().toISOString(),
                endAt: new Date(Date.now() + 7 * 86400000).toISOString(),
                problemIds: problems.filter((p) => p.difficulty === "EASY").slice(0, 5).map((p) => p.id),
              }))}>
                Create a 5-problem challenge
              </button>
              <ul>{challenges.map((c) => <li key={c.id}>{c.title} · {c.problemIds.length} problems</li>)}</ul>
            </div>
          )}
        </div>
      )}
    </section>
  );
}
