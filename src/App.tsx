import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import AdminDashboard from "./pages/AdminDashboard";
import TeacherDashboard from "./pages/TeacherDashboard";
import StudentDashboard from "./pages/StudentDashboard";
import ProfilePage from "./pages/student/ProfilePage";
import CoursesPage from "./pages/student/CoursesPage";
import CodeEditorPage from "./pages/student/CodeEditorPage";
import AIAssistantPage from "./pages/student/AIAssistantPage";
import ExercisesPage from "./pages/student/ExercisesPage";
import ProgressPage from "./pages/student/ProgressPage";
import NotFound from "./pages/NotFound";
import AchievementsPage from "./pages/student/AchievementsPage";
import DiscussionPage from "./pages/student/DiscussionPage";
import NotificationsPage from "./pages/student/NotificationsPage";
import ProjectsPage from "./pages/student/ProjectsPage";
import SettingsPage from "./pages/student/SettingsPage";

const queryClient = new QueryClient();

// Protected Route wrapper component
const ProtectedRoute = ({ children, allowedRoles = [] }: { children: React.ReactNode, allowedRoles?: string[] }) => {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    // Check active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session?.user) {
        // Fetch user role from profiles
        supabase
          .from('profiles')
          .select('role')
          .eq('id', session.user.id)
          .single()
          .then(({ data, error }) => {
            if (!error && data) {
              setUserRole(data.role);
            }
            setLoading(false);
          });
      } else {
        setLoading(false);
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (!session) {
        setUserRole(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!session) {
    return <Navigate to="/auth" />;
  }

  if (allowedRoles.length > 0 && userRole && !allowedRoles.includes(userRole)) {
    // Redirect to appropriate dashboard based on role
    if (userRole === 'admin') return <Navigate to="/admin" />;
    if (userRole === 'teacher') return <Navigate to="/teacher" />;
    if (userRole === 'student') return <Navigate to="/student" />;
    return <Navigate to="/" />;
  }

  return <>{children}</>;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/auth" element={<Auth />} />
          
          <Route path="/admin" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminDashboard />
            </ProtectedRoute>
          } />
          
          <Route path="/teacher" element={
            <ProtectedRoute allowedRoles={['teacher']}>
              <TeacherDashboard />
            </ProtectedRoute>
          } />
          
          <Route path="/student" element={
            <ProtectedRoute allowedRoles={['student']}>
              <StudentDashboard />
            </ProtectedRoute>
          } />
          
          <Route path="/student/profile" element={
            <ProtectedRoute allowedRoles={['student']}>
              <ProfilePage />
            </ProtectedRoute>
          } />
          
          <Route path="/student/courses" element={
            <ProtectedRoute allowedRoles={['student']}>
              <CoursesPage />
            </ProtectedRoute>
          } />
          
          <Route path="/student/code-editor" element={
            <ProtectedRoute allowedRoles={['student']}>
              <CodeEditorPage />
            </ProtectedRoute>
          } />
          
          <Route path="/student/ai-assistant" element={
            <ProtectedRoute allowedRoles={['student']}>
              <AIAssistantPage />
            </ProtectedRoute>
          } />
          
          <Route path="/student/exercises" element={
            <ProtectedRoute allowedRoles={['student']}>
              <ExercisesPage />
            </ProtectedRoute>
          } />
          
          <Route path="/student/progress" element={
            <ProtectedRoute allowedRoles={['student']}>
              <ProgressPage />
            </ProtectedRoute>
          } />
          
          <Route path="/student/achievements" element={
            <ProtectedRoute allowedRoles={['student']}>
              <AchievementsPage />
            </ProtectedRoute>
          } />
          
          <Route path="/student/discussion" element={
            <ProtectedRoute allowedRoles={['student']}>
              <DiscussionPage />
            </ProtectedRoute>
          } />
          
          <Route path="/student/notifications" element={
            <ProtectedRoute allowedRoles={['student']}>
              <NotificationsPage />
            </ProtectedRoute>
          } />
          
          <Route path="/student/projects" element={
            <ProtectedRoute allowedRoles={['student']}>
              <ProjectsPage />
            </ProtectedRoute>
          } />
          
          <Route path="/student/settings" element={
            <ProtectedRoute allowedRoles={['student']}>
              <SettingsPage />
            </ProtectedRoute>
          } />
          
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
