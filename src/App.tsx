
import React, { Suspense } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';

// Import des pages correctement
import AuthPage from '@/pages/Auth';
import IndexPage from '@/pages/Index';
import NotFoundPage from '@/pages/NotFound';

// Student Pages
import StudentDashboard from '@/pages/StudentDashboard';
import StudentCoursesPage from '@/pages/student/CoursesPage';
import StudentCourseDetailsPage from '@/pages/student/CourseDetailsPage';
import StudentCourseLearnPage from '@/pages/student/CourseLearnPage';
import StudentExercisesPage from '@/pages/student/ExercisesPage';
import StudentDiscussionPage from '@/pages/student/DiscussionPage';
import StudentProjectsPage from '@/pages/student/ProjectsPage';
import StudentCodeEditorPage from '@/pages/student/CodeEditorPage';
import StudentAIAssistantPage from '@/pages/student/AIAssistantPage';
import StudentProgressPage from '@/pages/student/ProgressPage';
import StudentAchievementsPage from '@/pages/student/AchievementsPage';
import StudentProfilePage from '@/pages/student/ProfilePage';
import StudentNotificationsPage from '@/pages/student/NotificationsPage';
import StudentSettingsPage from '@/pages/student/SettingsPage';

// Teacher Pages
import TeacherDashboardPage from '@/pages/TeacherDashboard';
import TeacherCoursesPage from '@/pages/teacher/CoursesPage';
import TeacherCreateCoursePage from '@/pages/teacher/CreateCoursePage';
import TeacherEditCoursePage from '@/pages/teacher/EditCoursePage';
import TeacherExercisesPage from '@/pages/teacher/ExercisesPage';
import TeacherCreateExercisePage from '@/pages/teacher/CreateExercisePage';
import TeacherSettingsPage from '@/pages/teacher/SettingsPage';

// Admin Pages
import AdminDashboardPage from '@/pages/AdminDashboard';
import AdminSettingsPage from '@/pages/admin/SettingsPage';

function App() {
  const isLoggedIn = false; // Replace with actual authentication check

  return (
    <Router>
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route path="/" element={<IndexPage />} />
          <Route path="/auth/*" element={<AuthPage />} />
          <Route path="/not-found" element={<NotFoundPage />} />

          {/* Student Routes */}
          <Route path="/student" element={<StudentDashboard />} />
          <Route path="/student/courses" element={<StudentCoursesPage />} />
          <Route path="/student/courses/:courseId/details" element={<StudentCourseDetailsPage />} />
          <Route path="/student/courses/:courseId/learn" element={<StudentCourseLearnPage />} />
          <Route path="/student/exercises" element={<StudentExercisesPage />} />
          <Route path="/student/discussion" element={<StudentDiscussionPage />} />
          <Route path="/student/projects" element={<StudentProjectsPage />} />
          <Route path="/student/editor" element={<StudentCodeEditorPage />} />
          <Route path="/student/ai-assistant" element={<StudentAIAssistantPage />} />
          <Route path="/student/progress" element={<StudentProgressPage />} />
          <Route path="/student/achievements" element={<StudentAchievementsPage />} />
          <Route path="/student/profile" element={<StudentProfilePage />} />
          <Route path="/student/notifications" element={<StudentNotificationsPage />} />
          <Route path="/student/settings" element={<StudentSettingsPage />} />

          {/* Teacher Routes */}
          <Route path="/teacher" element={<TeacherDashboardPage />} />
          <Route path="/teacher/courses" element={<TeacherCoursesPage />} />
          <Route path="/teacher/courses/create" element={<TeacherCreateCoursePage />} />
          <Route path="/teacher/courses/edit/:courseId" element={<TeacherEditCoursePage />} />
          <Route path="/teacher/exercises" element={<TeacherExercisesPage />} />
          <Route path="/teacher/exercises/create" element={<TeacherCreateExercisePage />} />
          <Route path="/teacher/settings" element={<TeacherSettingsPage />} />

          {/* Admin Routes */}
          <Route path="/admin" element={<AdminDashboardPage />} />
          <Route path="/admin/settings" element={<AdminSettingsPage />} />

          <Route path="*" element={<Navigate to="/not-found" replace />} />
        </Routes>
      </Suspense>
      <Toaster />
    </Router>
  );
}

export default App;
