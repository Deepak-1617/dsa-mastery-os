import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  BookOpen,
  Brain,
  ClipboardCheck,
  Code2,
  FileCode,
  LayoutDashboard,
  TerminalSquare,
  LogOut,
  Map,
  Search,
  Settings,
  Users,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useAuth } from "../features/auth/AuthProvider";
import { env } from "../lib/env";
import { SearchModal } from "../features/search/SearchModal";

const navigation = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/roadmap", label: "Roadmap", icon: Map },
  { to: "/learn", label: "Learn", icon: BookOpen },
  { to: "/practice", label: "Practice", icon: Code2 },
  { to: "/playground", label: "Playground", icon: TerminalSquare },
  { to: "/revision", label: "Revision", icon: ClipboardCheck },
  { to: "/ai-tutor", label: "AI Tutor", icon: Brain },
  { to: "/groups", label: "Groups", icon: Users },
  { to: "/python", label: "Python", icon: FileCode },
  { to: "/profile", label: "Profile", icon: Settings },
];

export function AppLayout() {
  const { signOut, profile, email } = useAuth();
  const navigate = useNavigate();
  const [searchOpen, setSearchOpen] = useState(false);
  const [offline, setOffline] = useState(!navigator.onLine);

  useEffect(() => {
    const on = () => setOffline(false);
    const off = () => setOffline(true);
    window.addEventListener("online", on);
    window.addEventListener("offline", off);
    const onKey = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("online", on);
      window.removeEventListener("offline", off);
      window.removeEventListener("keydown", onKey);
    };
  }, []);

  return (
    <div className="app-shell">
      <a className="skip-link" href="#main">Skip to content</a>
      <aside className="sidebar">
        <div className="brand">
          <span className="brand-mark">DS</span>
          <span>DSA Mastery OS</span>
        </div>
        <nav className="nav-list" aria-label="Primary">
          {navigation.map(({ to, label, icon: Icon }) => (
            <NavLink key={to} to={to} className={({ isActive }) => `nav-link ${isActive ? "nav-link-active" : ""}`}>
              <Icon size={16} />
              {label}
            </NavLink>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <span className="persist-chip">{env.persistence === "local" ? "Local workspace" : "Supabase"}</span>
          <p className="sidebar-user">{profile?.displayName || email}</p>
          <button className="button button-ghost" onClick={() => setSearchOpen(true)}>
            <Search size={15} /> Search
          </button>
          <button className="button button-ghost" onClick={() => { signOut(); navigate("/login"); }}>
            <LogOut size={15} /> Sign out
          </button>
        </div>
      </aside>
      <main className="main-content" id="main">
        {offline && (
          <div className="page" style={{ paddingBottom: 0 }}>
            <p className="offline-banner">You are offline. Local data remains available; cloud sync and the judge will wait.</p>
          </div>
        )}
        <Outlet />
      </main>
      {searchOpen && <SearchModal onClose={() => setSearchOpen(false)} />}
    </div>
  );
}
