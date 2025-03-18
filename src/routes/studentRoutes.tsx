
import { RouteObject } from "react-router-dom";
import ProtectedRoute from "../components/ProtectedRoute";
import StudentDashboard from "../pages/StudentDashboard";
import StudentSettingsPage from "../pages/student/SettingsPage";
import CoursesPage from "../pages/student/CoursesPage";
import CourseDetailsPage from "../pages/student/CourseDetailsPage";
import PaidCourseDetailsPage from "../pages/student/PaidCourseDetailsPage";
import CourseLearnPage from "../pages/student/CourseLearnPage";
import ExercisesPage from "../pages/student/ExercisesPage";
import ProjectsPage from "../pages/student/ProjectsPage";
import ProgressPage from "../pages/student/ProgressPage";
import AchievementsPage from "../pages/student/AchievementsPage";
import DiscussionPage from "../pages/student/DiscussionPage";
import NotificationsPage from "../pages/student/NotificationsPage";
import ProfilePage from "../pages/student/ProfilePage";
import AIAssistantPage from "../pages/student/AIAssistantPage";
import CodeEditorPage from "../pages/student/CodeEditorPage";

const studentAllowedRoles = ['student', 'admin', 'teacher'];

export const studentRoutes: RouteObject[] = [
  {
    path: "/student",
    element: (
      <ProtectedRoute allowedRoles={studentAllowedRoles}>
        <StudentDashboard />
      </ProtectedRoute>
    ),
  },
  {
    path: "/student/settings",
    element: (
      <ProtectedRoute allowedRoles={studentAllowedRoles}>
        <StudentSettingsPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/student/courses",
    element: (
      <ProtectedRoute allowedRoles={studentAllowedRoles}>
        <CoursesPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/student/courses/:courseId",
    element: (
      <ProtectedRoute allowedRoles={studentAllowedRoles}>
        <CourseDetailsPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/student/paid-courses/:courseId",
    element: (
      <ProtectedRoute allowedRoles={studentAllowedRoles}>
        <PaidCourseDetailsPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/student/learn/:courseId",
    element: (
      <ProtectedRoute allowedRoles={studentAllowedRoles}>
        <CourseLearnPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/student/exercises",
    element: (
      <ProtectedRoute allowedRoles={studentAllowedRoles}>
        <ExercisesPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/student/projects",
    element: (
      <ProtectedRoute allowedRoles={studentAllowedRoles}>
        <ProjectsPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/student/progress",
    element: (
      <ProtectedRoute allowedRoles={studentAllowedRoles}>
        <ProgressPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/student/achievements",
    element: (
      <ProtectedRoute allowedRoles={studentAllowedRoles}>
        <AchievementsPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/student/discussion",
    element: (
      <ProtectedRoute allowedRoles={studentAllowedRoles}>
        <DiscussionPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/student/notifications",
    element: (
      <ProtectedRoute allowedRoles={studentAllowedRoles}>
        <NotificationsPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/student/profile",
    element: (
      <ProtectedRoute allowedRoles={studentAllowedRoles}>
        <ProfilePage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/student/ai-assistant",
    element: (
      <ProtectedRoute allowedRoles={studentAllowedRoles}>
        <AIAssistantPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/student/code-editor",
    element: (
      <ProtectedRoute allowedRoles={studentAllowedRoles}>
        <CodeEditorPage />
      </ProtectedRoute>
    ),
  },
];
