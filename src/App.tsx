import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useAuthState } from "@/hooks/useAuthState";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";

// Pages
import Index from "@/pages/Index";
import Auth from "@/pages/Auth";
import StudentDashboard from "@/pages/StudentDashboard";
import TeacherDashboard from "@/pages/TeacherDashboard";
import AdminDashboard from "@/pages/AdminDashboard";

// Student pages
import CoursesPage from "@/pages/student/CoursesPage";
import ExercisesPage from "@/pages/student/ExercisesPage";
import AchievementsPage from "@/pages/student/AchievementsPage";
import ProgressPage from "@/pages/student/ProgressPage";
import CodeEditorPage from "@/pages/student/CodeEditorPage";
import AIAssistantPage from "@/pages/student/AIAssistantPage";
import LocalAIAssistantPage from "@/pages/student/LocalAIAssistantPage";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  const { user, loading } = useAuthState();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div className="min-h-screen bg-background">
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            
            {/* Protected routes */}
            {user ? (
              <>
                {/* Student routes */}
                {user.role === 'student' && (
                  <>
                    <Route path="/student" element={<StudentDashboard />} />
                    <Route path="/student/courses" element={<CoursesPage />} />
                    <Route path="/student/exercises" element={<ExercisesPage />} />
                    <Route path="/student/achievements" element={<AchievementsPage />} />
                    <Route path="/student/progress" element={<ProgressPage />} />
                    <Route path="/student/code-editor" element={<CodeEditorPage />} />
                    <Route path="/student/ai-assistant" element={<AIAssistantPage />} />
                    <Route path="/student/local-ai-assistant" element={<LocalAIAssistantPage />} />
                  </>
                )}
                
                {/* Teacher routes */}
                {user.role === 'teacher' && (
                  <>
                    <Route path="/teacher" element={<TeacherDashboard />} />
                  </>
                )}
                
                {/* Admin routes */}
                {user.role === 'admin' && (
                  <>
                    <Route path="/admin" element={<AdminDashboard />} />
                  </>
                )}
                
                {/* Redirect based on role */}
                <Route path="*" element={
                  <Navigate to={
                    user.role === 'student' ? '/student' :
                    user.role === 'teacher' ? '/teacher' :
                    user.role === 'admin' ? '/admin' : '/'
                  } replace />
                } />
              </>
            ) : (
              <Route path="*" element={<Navigate to="/auth" replace />} />
            )}
          </Routes>
          <Toaster />
          <Sonner />
        </div>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
