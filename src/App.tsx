
import { Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";
import StudentDashboard from "./pages/StudentDashboard";
import TeacherDashboard from "./pages/TeacherDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import ProfilePage from "./pages/student/ProfilePage";
import CoursesPage from "./pages/student/CoursesPage";
import CodeEditorPage from "./pages/student/CodeEditorPage";
import AIAssistantPage from "./pages/student/AIAssistantPage";
import ExercisesPage from "./pages/student/ExercisesPage";
import ProjectsPage from "./pages/student/ProjectsPage";
import ProgressPage from "./pages/student/ProgressPage";
import AchievementsPage from "./pages/student/AchievementsPage";
import DiscussionPage from "./pages/student/DiscussionPage";
import SettingsPage from "./pages/student/SettingsPage";
import TeacherSettingsPage from "./pages/teacher/SettingsPage";
import TeacherExercisesPage from "./pages/teacher/ExercisesPage";
import TeacherCoursesPage from "./pages/teacher/CoursesPage";
import CreateExercisePage from "./pages/teacher/CreateExercisePage";
import CreateCoursePage from "./pages/teacher/CreateCoursePage";
import NotificationsPage from "./pages/student/NotificationsPage";

// Admin pages
import DashboardPage from "./pages/admin/DashboardPage";
import UserManagementPage from "./pages/admin/UserManagementPage";
import CourseManagementPage from "./pages/admin/CourseManagementPage";
import AdminExercisesPage from "./pages/admin/ExercisesPage";
import AnalyticsPage from "./pages/admin/AnalyticsPage";
import AdminSettingsPage from "./pages/admin/SettingsPage";

import "./App.css";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/auth" element={<Auth />} />
      
      {/* Student Routes */}
      <Route path="/student" element={<StudentDashboard />} />
      <Route path="/student/profile" element={<ProfilePage />} />
      <Route path="/student/courses" element={<CoursesPage />} />
      <Route path="/student/code-editor" element={<CodeEditorPage />} />
      <Route path="/student/ai-assistant" element={<AIAssistantPage />} />
      <Route path="/student/exercises" element={<ExercisesPage />} />
      <Route path="/student/projects" element={<ProjectsPage />} />
      <Route path="/student/progress" element={<ProgressPage />} />
      <Route path="/student/achievements" element={<AchievementsPage />} />
      <Route path="/student/discussion" element={<DiscussionPage />} />
      <Route path="/student/settings" element={<SettingsPage />} />
      <Route path="/student/notifications" element={<NotificationsPage />} />

      {/* Teacher Routes */}
      <Route path="/teacher" element={<TeacherDashboard />} />
      <Route path="/teacher/courses" element={<TeacherCoursesPage />} />
      <Route path="/teacher/courses/create" element={<CreateCoursePage />} />
      <Route path="/teacher/exercises" element={<TeacherExercisesPage />} />
      <Route path="/teacher/exercises/create" element={<CreateExercisePage />} />
      <Route path="/teacher/settings" element={<TeacherSettingsPage />} />

      {/* Admin Routes */}
      <Route path="/admin" element={<DashboardPage />} />
      <Route path="/admin/dashboard" element={<DashboardPage />} />
      <Route path="/admin/users" element={<UserManagementPage />} />
      <Route path="/admin/courses" element={<CourseManagementPage />} />
      <Route path="/admin/exercises" element={<AdminExercisesPage />} />
      <Route path="/admin/analytics" element={<AnalyticsPage />} />
      <Route path="/admin/settings" element={<AdminSettingsPage />} />
      
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
