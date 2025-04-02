
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
import FreeCoursesDashboard from '@/pages/student/FreeCoursesDashboard';
import LanguagesPage from '@/pages/student/LanguagesPage';
import LanguageModulesPage from '@/pages/student/LanguageModulesPage';
import ModuleContentPage from '@/pages/student/ModuleContentPage';
import MiniGamePage from '@/pages/student/MiniGamePage';
import LanguageSelectionPage from '@/pages/student/LanguageSelectionPage';
import LanguageCoursePage from '@/pages/student/LanguageCoursePage';
import LanguageSummaryPage from '@/pages/student/LanguageSummaryPage';
import LanguageQuizPage from '@/pages/student/LanguageQuizPage';
import SocialFeedPage from '@/pages/student/SocialFeedPage';
import MessagesPage from '@/pages/student/MessagesPage';
import KnowledgeSharePage from '@/pages/KnowledgeSharePage';
import InternshipOpportunitiesPage from '@/pages/student/InternshipOpportunitiesPage';
import YTDevTutorialsPage from '@/pages/student/YTDevTutorialsPage';
import AnalyticsDashboard from '@/pages/student/AnalyticsDashboard';

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
import InternshipManagementPage from '@/pages/admin/InternshipManagementPage';
import PostManagementPage from '@/pages/admin/PostManagementPage';
import CourseManagementPage from '@/pages/admin/CourseManagementPage';
import UserManagementPage from '@/pages/admin/UserManagementPage';
import ExerciseManagementPage from '@/pages/admin/ExerciseManagementPage';

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
          
          {/* Keep existing student routes */}
          <Route path="/student/courses" element={<StudentCoursesPage />} />
          <Route path="/student/free-courses" element={<FreeCoursesDashboard />} />
          <Route path="/student/courses/:courseId/details" element={<StudentCourseDetailsPage />} />
          <Route path="/student/courses/:courseId/learn" element={<StudentCourseLearnPage />} />
          <Route path="/student/languages" element={<LanguagesPage />} />
          <Route path="/student/languages/:languageId" element={<LanguageModulesPage />} />
          <Route path="/student/modules/:moduleId" element={<ModuleContentPage />} />
          <Route path="/student/exercises" element={<StudentExercisesPage />} />
          <Route path="/student/discussion" element={<StudentDiscussionPage />} />
          <Route path="/student/projects" element={<StudentProjectsPage />} />
          <Route path="/student/editor" element={<StudentCodeEditorPage />} />
          <Route path="/student/code-editor" element={<StudentCodeEditorPage />} /> {/* Add this route as an alias */}
          <Route path="/student/ai-assistant" element={<StudentAIAssistantPage />} />
          <Route path="/student/progress" element={<StudentProgressPage />} />
          <Route path="/student/achievements" element={<StudentAchievementsPage />} />
          <Route path="/student/mini-game" element={<MiniGamePage />} />
          <Route path="/student/profile" element={<StudentProfilePage />} />
          <Route path="/student/notifications" element={<StudentNotificationsPage />} />
          <Route path="/student/settings" element={<StudentSettingsPage />} />
          
          {/* New route for Analytics Dashboard */}
          <Route path="/student/analytics" element={<AnalyticsDashboard />} />
          
          {/* New route for YT Dev Tutorials */}
          <Route path="/student/yt-dev-tutorials" element={<YTDevTutorialsPage />} />
          
          {/* Social features routes */}
          <Route path="/student/social" element={<SocialFeedPage />} />
          <Route path="/student/messages" element={<MessagesPage />} />
          <Route path="/student/knowledge" element={<KnowledgeSharePage />} />
          <Route path="/student/internships" element={<InternshipOpportunitiesPage />} />
          
          {/* Nouvelles routes pour le système de cours simplifiés */}
          <Route path="/student/language-selection" element={<LanguageSelectionPage />} />
          <Route path="/student/language-courses/:languageId" element={<LanguageCoursePage />} />

          {/* Nouvelles routes pour les résumés et les quiz */}
          <Route path="/student/language-summary/:languageId" element={<LanguageSummaryPage />} />
          <Route path="/student/language-quiz/:languageId" element={<LanguageQuizPage />} />

          {/* Teacher Routes */}
          <Route path="/teacher" element={<TeacherDashboardPage />} />
          <Route path="/teacher/knowledge" element={<KnowledgeSharePage />} />
          
          {/* Keep existing teacher routes */}
          <Route path="/teacher/courses" element={<TeacherCoursesPage />} />
          <Route path="/teacher/courses/create" element={<TeacherCreateCoursePage />} />
          <Route path="/teacher/courses/edit/:courseId" element={<TeacherEditCoursePage />} />
          <Route path="/teacher/exercises" element={<TeacherExercisesPage />} />
          <Route path="/teacher/exercises/create" element={<TeacherCreateExercisePage />} />
          <Route path="/teacher/settings" element={<TeacherSettingsPage />} />

          {/* Admin Routes */}
          <Route path="/admin" element={<AdminDashboardPage />} />
          <Route path="/admin/knowledge" element={<KnowledgeSharePage />} />
          <Route path="/admin/internships" element={<InternshipManagementPage />} />
          <Route path="/admin/posts" element={<PostManagementPage />} />
          <Route path="/admin/users" element={<UserManagementPage />} />
          <Route path="/admin/courses" element={<CourseManagementPage />} />
          <Route path="/admin/exercises" element={<ExerciseManagementPage />} />
          
          {/* Keep existing admin routes */}
          <Route path="/admin/settings" element={<AdminSettingsPage />} />

          <Route path="*" element={<Navigate to="/not-found" replace />} />
        </Routes>
      </Suspense>
      <Toaster />
    </Router>
  );
}

export default App;
