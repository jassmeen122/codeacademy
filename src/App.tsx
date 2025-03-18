
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import Navigation from "./components/Navigation";
import { Toaster } from "sonner";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";
import StudentDashboard from "./pages/StudentDashboard";
import TeacherDashboard from "./pages/TeacherDashboard";
import AdminDashboard from "./pages/AdminDashboard";

// Student Pages
import StudentSettingsPage from "./pages/student/SettingsPage";
import CoursesPage from "./pages/student/CoursesPage";
import CourseDetailsPage from "./pages/student/CourseDetailsPage";
import PaidCourseDetailsPage from "./pages/student/PaidCourseDetailsPage";
import CourseLearnPage from "./pages/student/CourseLearnPage";
import ExercisesPage from "./pages/student/ExercisesPage";
import ProjectsPage from "./pages/student/ProjectsPage";
import ProgressPage from "./pages/student/ProgressPage";
import AchievementsPage from "./pages/student/AchievementsPage";
import DiscussionPage from "./pages/student/DiscussionPage";
import NotificationsPage from "./pages/student/NotificationsPage";
import ProfilePage from "./pages/student/ProfilePage";
import AIAssistantPage from "./pages/student/AIAssistantPage";
import CodeEditorPage from "./pages/student/CodeEditorPage";

// Teacher Pages
import TeacherCoursesPage from "./pages/teacher/CoursesPage";
import TeacherExercisesPage from "./pages/teacher/ExercisesPage";
import CreateCoursePage from "./pages/teacher/CreateCoursePage";
import EditCoursePage from "./pages/teacher/EditCoursePage";
import CreateExercisePage from "./pages/teacher/CreateExercisePage";
import TeacherSettingsPage from "./pages/teacher/SettingsPage";

// Admin Pages
import AdminSettingsPage from "./pages/admin/SettingsPage";

// Create a new query client instance
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <QueryClientProvider client={queryClient}>
        <Router>
          <Navigation />
          <main className="pt-16 min-h-screen">
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/auth" element={<Auth />} />

              {/* Student Routes */}
              <Route path="/student" element={<StudentDashboard />} />
              <Route path="/student/settings" element={<StudentSettingsPage />} />
              <Route path="/student/courses" element={<CoursesPage />} />
              <Route path="/student/courses/:courseId" element={<CourseDetailsPage />} />
              <Route path="/student/paid-courses/:courseId" element={<PaidCourseDetailsPage />} />
              <Route path="/student/learn/:courseId" element={<CourseLearnPage />} />
              <Route path="/student/exercises" element={<ExercisesPage />} />
              <Route path="/student/projects" element={<ProjectsPage />} />
              <Route path="/student/progress" element={<ProgressPage />} />
              <Route path="/student/achievements" element={<AchievementsPage />} />
              <Route path="/student/discussion" element={<DiscussionPage />} />
              <Route path="/student/notifications" element={<NotificationsPage />} />
              <Route path="/student/profile" element={<ProfilePage />} />
              <Route path="/student/ai-assistant" element={<AIAssistantPage />} />
              <Route path="/student/code-editor" element={<CodeEditorPage />} />

              {/* Teacher Routes */}
              <Route path="/teacher" element={<TeacherDashboard />} />
              <Route path="/teacher/settings" element={<TeacherSettingsPage />} />
              <Route path="/teacher/courses" element={<TeacherCoursesPage />} />
              <Route path="/teacher/exercises" element={<TeacherExercisesPage />} />
              <Route path="/teacher/courses/create" element={<CreateCoursePage />} />
              <Route path="/teacher/courses/edit/:courseId" element={<EditCoursePage />} />
              <Route path="/teacher/exercises/create" element={<CreateExercisePage />} />

              {/* Admin Routes */}
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/settings" element={<AdminSettingsPage />} />

              {/* 404 Route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <Toaster position="top-right" closeButton />
        </Router>
      </QueryClientProvider>
    </ThemeProvider>
  );
};

export default App;
