import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import StudentDashboard from "./pages/StudentDashboard";
import TeacherDashboard from "./pages/TeacherDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import NotFound from "./pages/NotFound";

// Student pages
import LanguagesPage from "./pages/student/LanguagesPage";
import LanguageSelectionPage from "./pages/student/LanguageSelectionPage";
import LanguageCoursePage from "./pages/student/LanguageCoursePage";
import LanguageModulesPage from "./pages/student/LanguageModulesPage";
import ModuleContentPage from "./pages/student/ModuleContentPage";
import LanguageQuizPage from "./pages/student/LanguageQuizPage";
import LanguageSummaryPage from "./pages/student/LanguageSummaryPage";
import CoursesPage from "./pages/student/CoursesPage";
import CourseDetailsPage from "./pages/student/CourseDetailsPage";
import CourseLearnPage from "./pages/student/CourseLearnPage";
import ExercisesPage from "./pages/student/ExercisesPage";
import CodeEditorPage from "./pages/student/CodeEditorPage";
import SettingsPage from "./pages/student/SettingsPage";
import ProfilePage from "./pages/student/ProfilePage";
import ProgressPage from "./pages/student/ProgressPage";
import ProgressGamificationPage from "./pages/student/ProgressGamificationPage";
import NotificationsPage from "./pages/student/NotificationsPage";
import SocialFeedPage from "./pages/student/SocialFeedPage";
import ProjectsPage from "./pages/student/ProjectsPage";
import AchievementsPage from "./pages/student/AchievementsPage";
import MiniGamePage from "./pages/student/MiniGamePage";
import AIAssistantPage from "./pages/student/AIAssistantPage";
import InternshipOpportunitiesPage from "./pages/student/InternshipOpportunitiesPage";
import DiscussionPage from "./pages/student/DiscussionPage";
import MessagesPage from "./pages/student/MessagesPage";
import EnhancedMessagesPage from "./pages/student/EnhancedMessagesPage";
import PrivateMessagesPage from "./pages/student/PrivateMessagesPage";
import FreeCoursesDashboard from "./pages/student/FreeCoursesDashboard";
import PaidCourseDetailsPage from "./pages/student/PaidCourseDetailsPage";
import YTDevTutorialsPage from "./pages/student/YTDevTutorialsPage";

// Teacher pages
import TeacherCoursesPage from "./pages/teacher/CoursesPage";
import CreateCoursePage from "./pages/teacher/CreateCoursePage";
import EditCoursePage from "./pages/teacher/EditCoursePage";
import TeacherExercisesPage from "./pages/teacher/ExercisesPage";
import CreateExercisePage from "./pages/teacher/CreateExercisePage";
import TeacherSettingsPage from "./pages/teacher/SettingsPage";
import TeacherPrivateMessagesPage from "./pages/teacher/PrivateMessagesPage";

// Admin pages
import UserManagementPage from "./pages/admin/UserManagementPage";
import CourseManagementPage from "./pages/admin/CourseManagementPage";
import ExerciseManagementPage from "./pages/admin/ExerciseManagementPage";
import PostManagementPage from "./pages/admin/PostManagementPage";
import InternshipManagementPage from "./pages/admin/InternshipManagementPage";
import AdminSettingsPage from "./pages/admin/SettingsPage";
import AdminPrivateMessagesPage from "./pages/admin/PrivateMessagesPage";

// Other pages
import KnowledgeSharePage from "./pages/KnowledgeSharePage";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            
            {/* Student routes */}
            <Route path="/student" element={<StudentDashboard />} />
            <Route path="/student/languages" element={<LanguagesPage />} />
            <Route path="/student/language-selection" element={<LanguageSelectionPage />} />
            <Route path="/student/language/:id" element={<LanguageCoursePage />} />
            <Route path="/student/language/:id/modules" element={<LanguageModulesPage />} />
            <Route path="/student/language/:languageId/module/:moduleId" element={<ModuleContentPage />} />
            <Route path="/student/language/:id/quiz" element={<LanguageQuizPage />} />
            <Route path="/student/language/:id/summary" element={<LanguageSummaryPage />} />
            <Route path="/student/courses" element={<CoursesPage />} />
            <Route path="/student/course/:id" element={<CourseDetailsPage />} />
            <Route path="/student/course/:id/learn" element={<CourseLearnPage />} />
            <Route path="/student/exercises" element={<ExercisesPage />} />
            <Route path="/student/editor" element={<CodeEditorPage />} />
            <Route path="/student/code-editor" element={<CodeEditorPage />} />
            <Route path="/student/settings" element={<SettingsPage />} />
            <Route path="/student/profile" element={<ProfilePage />} />
            <Route path="/student/progress" element={<ProgressPage />} />
            <Route path="/student/progress-gamification" element={<ProgressGamificationPage />} />
            <Route path="/student/notifications" element={<NotificationsPage />} />
            <Route path="/student/social" element={<SocialFeedPage />} />
            <Route path="/student/projects" element={<ProjectsPage />} />
            <Route path="/student/achievements" element={<AchievementsPage />} />
            <Route path="/student/mini-game" element={<MiniGamePage />} />
            <Route path="/student/ai-assistant" element={<AIAssistantPage />} />
            <Route path="/student/internships" element={<InternshipOpportunitiesPage />} />
            <Route path="/student/discussion" element={<DiscussionPage />} />
            <Route path="/student/messages" element={<MessagesPage />} />
            <Route path="/student/enhanced-messages" element={<EnhancedMessagesPage />} />
            <Route path="/student/private-messages" element={<PrivateMessagesPage />} />
            <Route path="/student/free-courses" element={<FreeCoursesDashboard />} />
            <Route path="/student/paid-course/:id" element={<PaidCourseDetailsPage />} />
            <Route path="/student/yt-dev-tutorials" element={<YTDevTutorialsPage />} />
            <Route path="/student/knowledge" element={<KnowledgeSharePage />} />

            {/* Teacher routes */}
            <Route path="/teacher" element={<TeacherDashboard />} />
            <Route path="/teacher/courses" element={<TeacherCoursesPage />} />
            <Route path="/teacher/create-course" element={<CreateCoursePage />} />
            <Route path="/teacher/edit-course/:id" element={<EditCoursePage />} />
            <Route path="/teacher/exercises" element={<TeacherExercisesPage />} />
            <Route path="/teacher/create-exercise" element={<CreateExercisePage />} />
            <Route path="/teacher/settings" element={<TeacherSettingsPage />} />
            <Route path="/teacher/private-messages" element={<TeacherPrivateMessagesPage />} />

            {/* Admin routes */}
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/users" element={<UserManagementPage />} />
            <Route path="/admin/courses" element={<CourseManagementPage />} />
            <Route path="/admin/exercises" element={<ExerciseManagementPage />} />
            <Route path="/admin/posts" element={<PostManagementPage />} />
            <Route path="/admin/internships" element={<InternshipManagementPage />} />
            <Route path="/admin/settings" element={<AdminSettingsPage />} />
            <Route path="/admin/private-messages" element={<AdminPrivateMessagesPage />} />

            {/* Other routes */}
            <Route path="/knowledge-share" element={<KnowledgeSharePage />} />
            
            {/* 404 route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
