import { Navigate, Route, Routes } from "react-router-dom";
import { AppLayout } from "../components/AppLayout";
import { AuthProvider } from "../features/auth/AuthProvider";
import { LoginPage } from "../features/auth/LoginPage";
import { OnboardingPage } from "../features/auth/OnboardingPage";
import { ProtectedRoute } from "../features/auth/ProtectedRoute";
import { RegisterPage } from "../features/auth/RegisterPage";
import { AiTutorPage } from "../features/ai-tutor/AiTutorPage";
import { DashboardPage } from "../features/dashboard/DashboardPage";
import { GroupsPage } from "../features/groups/GroupsPage";
import { LearnIndexPage } from "../features/lessons/LearnIndexPage";
import { LessonPage } from "../features/lessons/LessonPage";
import { PlaygroundPage } from "../features/playground/PlaygroundPage";
import { PracticePage } from "../features/practice/PracticePage";
import { ProblemPage } from "../features/practice/ProblemPage";
import { ProfilePage } from "../features/profile/ProfilePage";
import { PythonTrackPage } from "../features/python-track/PythonTrackPage";
import { RevisionPage } from "../features/revision/RevisionPage";
import { RoadmapPage } from "../features/roadmap/RoadmapPage";

export function AppRoutes() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/onboarding" element={<OnboardingPage />} />
          <Route element={<AppLayout />}>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/roadmap" element={<RoadmapPage />} />
            <Route path="/learn" element={<LearnIndexPage />} />
            <Route path="/learn/:topicSlug" element={<LessonPage />} />
            <Route path="/practice" element={<PracticePage />} />
            <Route path="/practice/:problemSlug" element={<ProblemPage />} />
            <Route path="/playground" element={<PlaygroundPage />} />
            <Route path="/revision" element={<RevisionPage />} />
            <Route path="/ai-tutor" element={<AiTutorPage />} />
            <Route path="/groups" element={<GroupsPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/python" element={<PythonTrackPage />} />
          </Route>
        </Route>
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </AuthProvider>
  );
}
