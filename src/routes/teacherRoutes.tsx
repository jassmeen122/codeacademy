
import { RouteObject } from "react-router-dom";
import ProtectedRoute from "../components/ProtectedRoute";
import TeacherDashboard from "../pages/TeacherDashboard";
import TeacherSettingsPage from "../pages/teacher/SettingsPage";
import TeacherCoursesPage from "../pages/teacher/CoursesPage";
import TeacherExercisesPage from "../pages/teacher/ExercisesPage";
import CreateCoursePage from "../pages/teacher/CreateCoursePage";
import EditCoursePage from "../pages/teacher/EditCoursePage";
import CreateExercisePage from "../pages/teacher/CreateExercisePage";

const teacherAllowedRoles = ['teacher', 'admin'];

export const teacherRoutes: RouteObject[] = [
  {
    path: "/teacher",
    element: (
      <ProtectedRoute allowedRoles={teacherAllowedRoles}>
        <TeacherDashboard />
      </ProtectedRoute>
    ),
  },
  {
    path: "/teacher/settings",
    element: (
      <ProtectedRoute allowedRoles={teacherAllowedRoles}>
        <TeacherSettingsPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/teacher/courses",
    element: (
      <ProtectedRoute allowedRoles={teacherAllowedRoles}>
        <TeacherCoursesPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/teacher/exercises",
    element: (
      <ProtectedRoute allowedRoles={teacherAllowedRoles}>
        <TeacherExercisesPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/teacher/courses/create",
    element: (
      <ProtectedRoute allowedRoles={teacherAllowedRoles}>
        <CreateCoursePage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/teacher/courses/edit/:courseId",
    element: (
      <ProtectedRoute allowedRoles={teacherAllowedRoles}>
        <EditCoursePage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/teacher/exercises/create",
    element: (
      <ProtectedRoute allowedRoles={teacherAllowedRoles}>
        <CreateExercisePage />
      </ProtectedRoute>
    ),
  },
];
