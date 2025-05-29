
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
const ExercisesPage = React.lazy(() => import('./pages/student/ExercisesPage'));
const YTDevTutorialsPage = React.lazy(() => import('./pages/student/YTDevTutorialsPage'));
const PrivateMessagesPage = React.lazy(() => import('./pages/student/PrivateMessagesPage'));
const ProjectsPage = React.lazy(() => import('./pages/student/ProjectsPage'));
const InternshipOpportunitiesPage = React.lazy(() => import('./pages/student/InternshipOpportunitiesPage'));
const CodeEditorPage = React.lazy(() => import('./pages/student/CodeEditorPage'));
const AIAssistantPage = React.lazy(() => import('./pages/student/AIAssistantPage'));
const MiniGamePage = React.lazy(() => import('./pages/student/MiniGamePage'));
const ProgressPage = React.lazy(() => import('./pages/student/ProgressPage'));
const ProgressGamificationPage = React.lazy(() => import('./pages/student/ProgressGamificationPage'));
const AchievementsPage = React.lazy(() => import('./pages/student/AchievementsPage'));
const SocialFeedPage = React.lazy(() => import('./pages/student/SocialFeedPage'));
const MessagesPage = React.lazy(() => import('./pages/student/MessagesPage'));
const ProfilePage = React.lazy(() => import('./pages/student/ProfilePage'));
const SettingsPage = React.lazy(() => import('./pages/student/SettingsPage'));
const ModuleContentPage = React.lazy(() => import('./pages/student/ModuleContentPage'));

// Teacher pages
const TeacherCoursesPage = React.lazy(() => import('./pages/teacher/CoursesPage'));
const TeacherExercisesPage = React.lazy(() => import('./pages/teacher/ExercisesPage'));
const CreateCoursePage = React.lazy(() => import('./pages/teacher/CreateCoursePage'));
const CreateExercisePage = React.lazy(() => import('./pages/teacher/CreateExercisePage'));
const EditCoursePage = React.lazy(() => import('./pages/teacher/EditCoursePage'));
const TeacherPrivateMessagesPage = React.lazy(() => import('./pages/teacher/PrivateMessagesPage'));
const TeacherSettingsPage = React.lazy(() => import('./pages/teacher/SettingsPage'));

// Admin pages
const UserManagementPage = React.lazy(() => import('./pages/admin/UserManagementPage'));
const CourseManagementPage = React.lazy(() => import('./pages/admin/CourseManagementPage'));
const ExerciseManagementPage = React.lazy(() => import('./pages/admin/ExerciseManagementPage'));
const PostManagementPage = React.lazy(() => import('./pages/admin/PostManagementPage'));
const InternshipManagementPage = React.lazy(() => import('./pages/admin/InternshipManagementPage'));
const AdminPrivateMessagesPage = React.lazy(() => import('./pages/admin/PrivateMessagesPage'));
const AdminSettingsPage = React.lazy(() => import('./pages/admin/SettingsPage'));

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
                <Route path="/student/exercises" element={<ExercisesPage />} />
                <Route path="/student/yt-dev-tutorials" element={<YTDevTutorialsPage />} />
                <Route path="/student/private-messages" element={<PrivateMessagesPage />} />
                <Route path="/student/projects" element={<ProjectsPage />} />
                <Route path="/student/internships" element={<InternshipOpportunitiesPage />} />
                <Route path="/student/code-editor" element={<CodeEditorPage />} />
                <Route path="/student/ai-assistant" element={<AIAssistantPage />} />
                <Route path="/student/mini-game" element={<MiniGamePage />} />
                <Route path="/student/progress" element={<ProgressPage />} />
                <Route path="/student/progress-gamification" element={<ProgressGamificationPage />} />
                <Route path="/student/achievements" element={<AchievementsPage />} />
                <Route path="/student/social" element={<SocialFeedPage />} />
                <Route path="/student/messages" element={<MessagesPage />} />
                <Route path="/student/profile" element={<ProfilePage />} />
                <Route path="/student/settings" element={<SettingsPage />} />
                <Route path="/student/module/:moduleId" element={<ModuleContentPage />} />
                
                {/* Teacher Routes */}
                <Route path="/teacher" element={<TeacherDashboard />} />
                <Route path="/teacher/courses" element={<TeacherCoursesPage />} />
                <Route path="/teacher/courses/create" element={<CreateCoursePage />} />
                <Route path="/teacher/courses/:id/edit" element={<EditCoursePage />} />
                <Route path="/teacher/exercises" element={<TeacherExercisesPage />} />
                <Route path="/teacher/exercises/create" element={<CreateExercisePage />} />
                <Route path="/teacher/private-messages" element={<TeacherPrivateMessagesPage />} />
                <Route path="/teacher/settings" element={<TeacherSettingsPage />} />
                
                {/* Admin Routes */}
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/admin/users" element={<UserManagementPage />} />
                <Route path="/admin/courses" element={<CourseManagementPage />} />
                <Route path="/admin/exercises" element={<ExerciseManagementPage />} />
                <Route path="/admin/posts" element={<PostManagementPage />} />
                <Route path="/admin/internships" element={<InternshipManagementPage />} />
                <Route path="/admin/private-messages" element={<AdminPrivateMessagesPage />} />
                <Route path="/admin/settings" element={<AdminSettingsPage />} />
                
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
