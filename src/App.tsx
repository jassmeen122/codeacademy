
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { TooltipProvider } from "@/components/ui/tooltip"
import { Toaster } from "@/components/ui/toaster"

import Index from "@/pages/Index";
import Auth from "@/pages/Auth";
import NotFound from "@/pages/NotFound";

// Admin Pages (only including existing ones)
import AdminDashboard from "@/pages/AdminDashboard";
import CourseManagementPage from "@/pages/admin/CourseManagementPage";
import ExerciseManagementPage from "@/pages/admin/ExerciseManagementPage";
import UserManagementPage from "@/pages/admin/UserManagementPage";
import PostManagementPage from "@/pages/admin/PostManagementPage";
import InternshipManagementPage from "@/pages/admin/InternshipManagementPage";
import AdminSettingsPage from "@/pages/admin/SettingsPage";

// Teacher Pages (only including existing ones)
import TeacherDashboard from "@/pages/TeacherDashboard";
import CoursesPage from "@/pages/teacher/CoursesPage";
import CreateCoursePage from "@/pages/teacher/CreateCoursePage";
import EditCoursePage from "@/pages/teacher/EditCoursePage";
import ExercisesPage from "@/pages/teacher/ExercisesPage";
import CreateExercisePage from "@/pages/teacher/CreateExercisePage";
import TeacherSettingsPage from "@/pages/teacher/SettingsPage";

// Student Pages (only including existing ones)
import StudentDashboard from "@/pages/StudentDashboard";
import StudentCoursesPage from "@/pages/student/CoursesPage";
import CourseDetailsPage from "@/pages/student/CourseDetailsPage";
import CourseLearnPage from "@/pages/student/CourseLearnPage";
import PaidCourseDetailsPage from "@/pages/student/PaidCourseDetailsPage";
import FreeCoursesDashboard from "@/pages/student/FreeCoursesDashboard";
import LanguagesPage from "@/pages/student/LanguagesPage";
import LanguageModulesPage from "@/pages/student/LanguageModulesPage";
import LanguageQuizPage from "@/pages/student/LanguageQuizPage";
import LanguageCoursePage from "@/pages/student/LanguageCoursePage";
import LanguageSelectionPage from "@/pages/student/LanguageSelectionPage";
import LanguageSummaryPage from "@/pages/student/LanguageSummaryPage";
import ModuleContentPage from "@/pages/student/ModuleContentPage";
import StudentExercisesPage from "@/pages/student/ExercisesPage";
import YTDevTutorialsPage from "@/pages/student/YTDevTutorialsPage";
import DiscussionPage from "@/pages/student/DiscussionPage";
import ProjectsPage from "@/pages/student/ProjectsPage";
import InternshipOpportunitiesPage from "@/pages/student/InternshipOpportunitiesPage";
import CodeEditorPage from "@/pages/student/CodeEditorPage";
import AIAssistantPage from "@/pages/student/AIAssistantPage";
import MiniGamePage from "@/pages/student/MiniGamePage";
import ProgressPage from "@/pages/student/ProgressPage";
import AchievementsPage from "@/pages/student/AchievementsPage";
import SocialFeedPage from "@/pages/student/SocialFeedPage";
import KnowledgeSharePage from "@/pages/KnowledgeSharePage";
import MessagesPage from "@/pages/student/MessagesPage";
import EnhancedMessagesPage from "@/pages/student/EnhancedMessagesPage";
import NotificationsPage from "@/pages/student/NotificationsPage";
import ProfilePage from "@/pages/student/ProfilePage";
import StudentSettingsPage from "@/pages/student/SettingsPage";
import ProgressGamificationPage from "@/pages/student/ProgressGamificationPage";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/teacher" element={<TeacherDashboard />} />
            <Route path="/student" element={<StudentDashboard />} />
            
            {/* Admin routes */}
            <Route path="/admin/courses" element={<CourseManagementPage />} />
            <Route path="/admin/exercises" element={<ExerciseManagementPage />} />
            <Route path="/admin/users" element={<UserManagementPage />} />
            <Route path="/admin/posts" element={<PostManagementPage />} />
            <Route path="/admin/internships" element={<InternshipManagementPage />} />
            <Route path="/admin/settings" element={<AdminSettingsPage />} />
            
            {/* Teacher routes */}
            <Route path="/teacher/courses" element={<CoursesPage />} />
            <Route path="/teacher/create-course" element={<CreateCoursePage />} />
            <Route path="/teacher/edit-course/:id" element={<EditCoursePage />} />
            <Route path="/teacher/exercises" element={<ExercisesPage />} />
            <Route path="/teacher/create-exercise" element={<CreateExercisePage />} />
            <Route path="/teacher/settings" element={<TeacherSettingsPage />} />
            
            {/* Student routes */}
            <Route path="/student/courses" element={<StudentCoursesPage />} />
            <Route path="/student/course/:id" element={<CourseDetailsPage />} />
            <Route path="/student/course/:courseId/learn" element={<CourseLearnPage />} />
            <Route path="/student/paid-course/:id" element={<PaidCourseDetailsPage />} />
            <Route path="/student/free-courses" element={<FreeCoursesDashboard />} />
            <Route path="/student/languages" element={<LanguagesPage />} />
            <Route path="/student/language/:languageId" element={<LanguageModulesPage />} />
            <Route path="/student/language/:languageId/quiz" element={<LanguageQuizPage />} />
            <Route path="/student/language/:languageId/course" element={<LanguageCoursePage />} />
            <Route path="/student/language-selection" element={<LanguageSelectionPage />} />
            <Route path="/student/language-summary/:languageId" element={<LanguageSummaryPage />} />
            <Route path="/student/module/:moduleId" element={<ModuleContentPage />} />
            <Route path="/student/exercises" element={<StudentExercisesPage />} />
            <Route path="/student/yt-dev-tutorials" element={<YTDevTutorialsPage />} />
            <Route path="/student/discussion" element={<DiscussionPage />} />
            <Route path="/student/projects" element={<ProjectsPage />} />
            <Route path="/student/internships" element={<InternshipOpportunitiesPage />} />
            <Route path="/student/code-editor" element={<CodeEditorPage />} />
            <Route path="/student/ai-assistant" element={<AIAssistantPage />} />
            <Route path="/student/mini-game" element={<MiniGamePage />} />
            <Route path="/student/progress" element={<ProgressPage />} />
            <Route path="/student/progress-gamification" element={<ProgressGamificationPage />} />
            <Route path="/student/achievements" element={<AchievementsPage />} />
            <Route path="/student/social" element={<SocialFeedPage />} />
            <Route path="/knowledge" element={<KnowledgeSharePage />} />
            <Route path="/student/knowledge" element={<KnowledgeSharePage />} />
            <Route path="/student/messages" element={<MessagesPage />} />
            <Route path="/student/enhanced-messages" element={<EnhancedMessagesPage />} />
            <Route path="/student/notifications" element={<NotificationsPage />} />
            <Route path="/student/profile" element={<ProfilePage />} />
            <Route path="/student/settings" element={<StudentSettingsPage />} />
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
