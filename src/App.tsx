import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Toaster } from "sonner";
import { ThemeProvider } from "next-themes";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Pages
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";
import AdminDashboard from "./pages/AdminDashboard";
import AdminSettingsPage from "./pages/admin/SettingsPage";
import TeacherDashboard from "./pages/TeacherDashboard";
import TeacherSettingsPage from "./pages/teacher/SettingsPage";
import StudentDashboard from "./pages/StudentDashboard";
import StudentSettingsPage from "./pages/student/SettingsPage";
import StudentProfilePage from "./pages/student/ProfilePage";
import CoursesPage from "./pages/student/CoursesPage";
import CodeEditorPage from "./pages/student/CodeEditorPage";
import AIAssistantPage from "./pages/student/AIAssistantPage";
import ExercisesPage from "./pages/student/ExercisesPage";
import NotificationsPage from "./pages/student/NotificationsPage";
import AchievementsPage from "./pages/student/AchievementsPage";
import DiscussionPage from "./pages/student/DiscussionPage";
import ProjectsPage from "./pages/student/ProjectsPage";
import ProgressPage from "./pages/student/ProgressPage";
import PaidCourseDetailsPage from "./pages/student/PaidCourseDetailsPage";
import TeacherCoursesPage from "./pages/teacher/CoursesPage";
import TeacherExercisesPage from "./pages/teacher/ExercisesPage";
import CreateCoursePage from "./pages/teacher/CreateCoursePage";
import CreateExercisePage from "./pages/teacher/CreateExercisePage";

const queryClient = new QueryClient();

function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="ui-theme">
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
        <Toaster richColors position="top-center" />
      </QueryClientProvider>
    </ThemeProvider>
  );
}

// Routes array
const routes = [
  {
    path: "/",
    element: <Index />,
  },
  {
    path: "/auth",
    element: <Auth />,
  },
  {
    path: "*",
    element: <NotFound />,
  },
  
  // Admin routes
  {
    path: "/admin",
    element: <AdminDashboard />,
  },
  {
    path: "/admin/settings",
    element: <AdminSettingsPage />,
  },
  
  // Teacher routes
  {
    path: "/teacher",
    element: <TeacherDashboard />,
  },
  {
    path: "/teacher/settings",
    element: <TeacherSettingsPage />,
  },
  {
    path: "/teacher/courses",
    element: <TeacherCoursesPage />,
  },
  {
    path: "/teacher/exercises",
    element: <TeacherExercisesPage />,
  },
  {
    path: "/teacher/courses/create",
    element: <CreateCoursePage />,
  },
  {
    path: "/teacher/exercises/create",
    element: <CreateExercisePage />,
  },
  
  // Student routes
  {
    path: "/student",
    element: <StudentDashboard />,
  },
  {
    path: "/student/settings",
    element: <StudentSettingsPage />,
  },
  {
    path: "/student/profile",
    element: <StudentProfilePage />,
  },
  {
    path: "/student/courses",
    element: <CoursesPage />,
  },
  {
    path: "/student/code-editor",
    element: <CodeEditorPage />,
  },
  {
    path: "/student/ai-assistant",
    element: <AIAssistantPage />,
  },
  {
    path: "/student/exercises",
    element: <ExercisesPage />,
  },
  {
    path: "/student/notifications",
    element: <NotificationsPage />,
  },
  {
    path: "/student/achievements",
    element: <AchievementsPage />,
  },
  {
    path: "/student/discussion",
    element: <DiscussionPage />,
  },
  {
    path: "/student/projects",
    element: <ProjectsPage />,
  },
  {
    path: "/student/progress",
    element: <ProgressPage />,
  },
  {
    path: "/student/courses/:courseId",
    element: <PaidCourseDetailsPage />,
  },
];

// Create the router with the routes
const router = createBrowserRouter(routes);

export default App;
