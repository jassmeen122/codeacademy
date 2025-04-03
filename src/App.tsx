import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { useAuthState } from './hooks/useAuthState';
import { LoginPage } from './pages/LoginPage';
import { SignupPage } from './pages/SignupPage';
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
  const { isLoggedIn, isLoading } = useAuthState();
  const [isFirstLoad, setIsFirstLoad] = useState(true);

  useEffect(() => {
    if (!isLoading && isFirstLoad) {
      setIsFirstLoad(false);
    }
  }, [isLoading, isFirstLoad]);

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={!isLoggedIn ? <LoginPage /> : <Navigate to="/student/dashboard" />} />
        <Route path="/signup" element={!isLoggedIn ? <SignupPage /> : <Navigate to="/student/dashboard" />} />
        <Route path="/" element={<Navigate to="/login" />} />

        {/* Student Routes */}
        <Route path="/student/dashboard" element={<StudentDashboardPage />} />
        <Route path="/student/courses" element={<CoursesPage />} />
        <Route path="/student/profile" element={<ProfilePage />} />
        <Route path="/student/progress" element={<ProgressDashboardPage />} />
        {/* Add the new progress dashboard route */}
        <Route path="/student/progress-dashboard" element={<ProgressDashboardPage />} />
        <Route path="/student/language-courses/:languageId" element={<LanguageCoursesPage />} />
        <Route path="/student/language-summary/:languageId" element={<LanguageSummaryPage />} />
        <Route path="/student/language-quiz/:languageId" element={<LanguageQuizPage />} />
        <Route path="/student/exercise/:exerciseId" element={<ExercisePage />} />
        <Route path="/student/social" element={<SocialHomePage />} />
        <Route path="/student/ai-assistant" element={<AIAssistantPage />} />
        <Route path="/student/projects" element={<ProjectsPage />} />
        <Route path="/student/sql-exercises" element={<SQLExercisesPage />} />

        {/* Admin Routes */}
        <Route path="/admin/dashboard" element={<AdminDashboardPage />} />

        {/* Teacher Routes */}
        <Route path="/teacher/dashboard" element={<TeacherDashboardPage />} />
      </Routes>
    </Router>
  );
}

export default App;
