
import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuthState } from './hooks/useAuthState';
import Auth from './pages/Auth';
import { StudentDashboardPage } from './pages/student/StudentDashboardPage';
import { CoursesPage } from './pages/student/CoursesPage';
import { ProfilePage } from './pages/student/ProfilePage';
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';
import { TeacherDashboardPage } from './pages/teacher/TeacherDashboardPage';
import { LanguageCoursesPage } from './pages/student/LanguageCoursesPage';
import { LanguageSummaryPage } from './pages/student/LanguageSummaryPage';
import { LanguageQuizPage } from './pages/student/LanguageQuizPage';
import { ExercisePage } from './pages/student/ExercisePage';
import { SocialHomePage } from './pages/student/SocialHomePage';
import { AIAssistantPage } from './pages/student/AIAssistantPage';
import { ProjectsPage } from './pages/student/ProjectsPage';
import { SQLExercisesPage } from './pages/student/SQLExercisesPage';
import { ProgressDashboardPage } from './pages/student/ProgressDashboardPage';

function App() {
  const { user, loading } = useAuthState();
  const [isFirstLoad, setIsFirstLoad] = useState(true);

  useEffect(() => {
    if (!loading && isFirstLoad) {
      setIsFirstLoad(false);
    }
  }, [loading, isFirstLoad]);

  const isLoggedIn = !!user;

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={!isLoggedIn ? <Auth /> : <Navigate to="/student/dashboard" />} />
      <Route path="/signup" element={!isLoggedIn ? <Auth /> : <Navigate to="/student/dashboard" />} />
      <Route path="/auth" element={!isLoggedIn ? <Auth /> : <Navigate to="/student/dashboard" />} />
      <Route path="/" element={<Navigate to="/login" />} />

      {/* Student Routes */}
      <Route path="/student/dashboard" element={isLoggedIn ? <StudentDashboardPage /> : <Navigate to="/login" />} />
      <Route path="/student/courses" element={isLoggedIn ? <CoursesPage /> : <Navigate to="/login" />} />
      <Route path="/student/profile" element={isLoggedIn ? <ProfilePage /> : <Navigate to="/login" />} />
      <Route path="/student/progress" element={isLoggedIn ? <ProgressDashboardPage /> : <Navigate to="/login" />} />
      <Route path="/student/progress-dashboard" element={isLoggedIn ? <ProgressDashboardPage /> : <Navigate to="/login" />} />
      <Route path="/student/language-courses/:languageId" element={isLoggedIn ? <LanguageCoursesPage /> : <Navigate to="/login" />} />
      <Route path="/student/language-summary/:languageId" element={isLoggedIn ? <LanguageSummaryPage /> : <Navigate to="/login" />} />
      <Route path="/student/language-quiz/:languageId" element={isLoggedIn ? <LanguageQuizPage /> : <Navigate to="/login" />} />
      <Route path="/student/exercise/:exerciseId" element={isLoggedIn ? <ExercisePage /> : <Navigate to="/login" />} />
      <Route path="/student/social" element={isLoggedIn ? <SocialHomePage /> : <Navigate to="/login" />} />
      <Route path="/student/ai-assistant" element={isLoggedIn ? <AIAssistantPage /> : <Navigate to="/login" />} />
      <Route path="/student/projects" element={isLoggedIn ? <ProjectsPage /> : <Navigate to="/login" />} />
      <Route path="/student/sql-exercises" element={isLoggedIn ? <SQLExercisesPage /> : <Navigate to="/login" />} />

      {/* Admin Routes */}
      <Route path="/admin/dashboard" element={isLoggedIn && user?.role === 'admin' ? <AdminDashboardPage /> : <Navigate to="/login" />} />

      {/* Teacher Routes */}
      <Route path="/teacher/dashboard" element={isLoggedIn && user?.role === 'teacher' ? <TeacherDashboardPage /> : <Navigate to="/login" />} />
    </Routes>
  );
}

export default App;
