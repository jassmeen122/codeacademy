import React, { Suspense } from 'react';
import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Index from './pages/Index';
import Auth from './pages/Auth';
import { SidebarProvider } from '@/components/ui/sidebar';

// Lazy load components
const StudentDashboard = React.lazy(() => import('./pages/StudentDashboard'));
const TeacherDashboard = React.lazy(() => import('./pages/TeacherDashboard'));
const AdminDashboard = React.lazy(() => import('./pages/AdminDashboard'));
const CoursesPage = React.lazy(() => import('./pages/student/CoursesPage'));
const SimpleProgressPage = React.lazy(() => import('./pages/student/SimpleProgressPage'));
const FreeCoursesPage = React.lazy(() => import('./pages/student/FreeCoursesPage'));
const ProgrammingLanguagesPage = React.lazy(() => import('./pages/student/ProgrammingLanguagesPage'));
const LanguagePage = React.lazy(() => import('./pages/student/LanguagePage'));
const ExercisesPage = React.lazy(() => import('./pages/student/ExercisesPage'));
const YTDevTutorialsPage = React.lazy(() => import('./pages/student/YTDevTutorialsPage'));
const DiscussionForumPage = React.lazy(() => import('./pages/student/DiscussionForumPage'));
const PrivateMessagesPage = React.lazy(() => import('./pages/student/PrivateMessagesPage'));
const ProjectsPage = React.lazy(() => import('./pages/student/ProjectsPage'));
const InternshipsPage = React.lazy(() => import('./pages/student/InternshipsPage'));
const CodeEditorPage = React.lazy(() => import('./pages/student/CodeEditorPage'));
const AiAssistantPage = React.lazy(() => import('./pages/student/AiAssistantPage'));
const MiniGamePage = React.lazy(() => import('./pages/student/MiniGamePage'));
const ProgressPage = React.lazy(() => import('./pages/student/ProgressPage'));
const ProgressGamificationPage = React.lazy(() => import('./pages/student/ProgressGamificationPage'));
const AchievementsPage = React.lazy(() => import('./pages/student/AchievementsPage'));
const SocialFeedPage = React.lazy(() => import('./pages/student/SocialFeedPage'));
const KnowledgeSharePage = React.lazy(() => import('./pages/student/KnowledgeSharePage'));
const MessagesPage = React.lazy(() => import('./pages/student/MessagesPage'));
const ProfilePage = React.lazy(() => import('./pages/student/ProfilePage'));
const SettingsPage = React.lazy(() => import('./pages/student/SettingsPage'));
const ModuleContentPage = React.lazy(() => import('./pages/student/ModuleContentPage'));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 10, // 10 minutes
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <SidebarProvider>
          <Toaster />
          <BrowserRouter>
            <Suspense fallback={
              <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
              </div>
            }>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/auth" element={<Auth />} />
                
                {/* Student Routes */}
                <Route path="/student" element={<StudentDashboard />} />
                <Route path="/student/courses" element={<CoursesPage />} />
                <Route path="/student/progress-simple" element={<SimpleProgressPage />} />
                <Route path="/student/free-courses" element={<FreeCoursesPage />} />
                <Route path="/student/languages" element={<ProgrammingLanguagesPage />} />
                <Route path="/student/languages/:languageId" element={<LanguagePage />} />
                <Route path="/student/exercises" element={<ExercisesPage />} />
                <Route path="/student/yt-dev-tutorials" element={<YTDevTutorialsPage />} />
                <Route path="/student/discussion" element={<DiscussionForumPage />} />
                <Route path="/student/private-messages" element={<PrivateMessagesPage />} />
                <Route path="/student/projects" element={<ProjectsPage />} />
                <Route path="/student/internships" element={<InternshipsPage />} />
                <Route path="/student/code-editor" element={<CodeEditorPage />} />
                <Route path="/student/ai-assistant" element={<AiAssistantPage />} />
                <Route path="/student/mini-game" element={<MiniGamePage />} />
                <Route path="/student/progress" element={<ProgressPage />} />
                <Route path="/student/progress-gamification" element={<ProgressGamificationPage />} />
                <Route path="/student/achievements" element={<AchievementsPage />} />
                <Route path="/student/social" element={<SocialFeedPage />} />
                <Route path="/student/knowledge" element={<KnowledgeSharePage />} />
                <Route path="/student/messages" element={<MessagesPage />} />
                <Route path="/student/profile" element={<ProfilePage />} />
                <Route path="/student/settings" element={<SettingsPage />} />
                <Route path="/student/module/:moduleId" element={<ModuleContentPage />} />
                
                {/* Teacher Routes */}
                
                {/* Admin Routes */}
                
                {/* Catch all route */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </Suspense>
          </BrowserRouter>
        </SidebarProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
