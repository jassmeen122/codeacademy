
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import Navigation from "./components/Navigation";
import { Toaster } from "sonner";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";
import StudentDashboard from "./pages/StudentDashboard";
import TeacherDashboard from "./pages/TeacherDashboard";
import AdminDashboard from "./pages/AdminDashboard";

// Student Pages
import StudentSettingsPage from "./pages/student/SettingsPage";
import CoursesPage from "./pages/student/CoursesPage";
import CourseDetailsPage from "./pages/student/CourseDetailsPage";
import PaidCourseDetailsPage from "./pages/student/PaidCourseDetailsPage";
import CourseLearnPage from "./pages/student/CourseLearnPage";
import ExercisesPage from "./pages/student/ExercisesPage";
import ProjectsPage from "./pages/student/ProjectsPage";
import ProgressPage from "./pages/student/ProgressPage";
import AchievementsPage from "./pages/student/AchievementsPage";
import DiscussionPage from "./pages/student/DiscussionPage";
import NotificationsPage from "./pages/student/NotificationsPage";
import ProfilePage from "./pages/student/ProfilePage";
import AIAssistantPage from "./pages/student/AIAssistantPage";
import CodeEditorPage from "./pages/student/CodeEditorPage";

// Teacher Pages
import TeacherCoursesPage from "./pages/teacher/CoursesPage";
import TeacherExercisesPage from "./pages/teacher/ExercisesPage";
import CreateCoursePage from "./pages/teacher/CreateCoursePage";
import EditCoursePage from "./pages/teacher/EditCoursePage";
import CreateExercisePage from "./pages/teacher/CreateExercisePage";
import TeacherSettingsPage from "./pages/teacher/SettingsPage";

// Admin Pages
import AdminSettingsPage from "./pages/admin/SettingsPage";
import { useEffect, useState } from "react";
import { supabase } from "./integrations/supabase/client";

// Create a new query client instance
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      refetchOnWindowFocus: false,
    },
  },
});

// Protected route component
const ProtectedRoute = ({ children, allowedRoles }: { children: React.ReactNode, allowedRoles: string[] }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        console.log("Checking authentication status");
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session) {
          console.log("User is authenticated");
          setIsAuthenticated(true);
          
          // Get user role from profiles
          const { data: profile, error } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', session.user.id)
            .single();
            
          if (error) {
            console.error("Error fetching profile:", error);
          } else if (profile) {
            console.log("User role:", profile.role);
            setUserRole(profile.role);
          }
        } else {
          console.log("User is not authenticated");
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error("Error checking auth:", error);
      } finally {
        setLoading(false);
      }
    };
    
    checkAuth();

    // Also set up auth state change listener
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("Auth state changed:", event);
      if (event === 'SIGNED_IN' && session) {
        setIsAuthenticated(true);
        // Get user role
        supabase
          .from('profiles')
          .select('role')
          .eq('id', session.user.id)
          .single()
          .then(({ data, error }) => {
            if (!error && data) {
              setUserRole(data.role);
            }
          });
      } else if (event === 'SIGNED_OUT') {
        setIsAuthenticated(false);
        setUserRole(null);
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [navigate]);

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  if (!isAuthenticated) {
    console.log("User not authenticated, redirecting to auth");
    return <Navigate to="/auth" />;
  }

  if (userRole && !allowedRoles.includes(userRole)) {
    console.log(`User role ${userRole} not in allowed roles ${allowedRoles}, redirecting`);
    // Redirect to appropriate dashboard based on role
    if (userRole === 'admin') {
      return <Navigate to="/admin" />;
    } else if (userRole === 'teacher') {
      return <Navigate to="/teacher" />;
    } else if (userRole === 'student') {
      return <Navigate to="/student" />;
    }
    
    // Default fallback
    return <Navigate to="/" />;
  }

  console.log("Rendering protected route");
  return <>{children}</>;
};

const App = () => {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <QueryClientProvider client={queryClient}>
        <Router>
          <Navigation />
          <main className="pt-16 min-h-screen">
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/auth" element={<Auth />} />

              {/* Student Routes */}
              <Route path="/student" element={
                <ProtectedRoute allowedRoles={['student', 'admin', 'teacher']}>
                  <StudentDashboard />
                </ProtectedRoute>
              } />
              <Route path="/student/settings" element={
                <ProtectedRoute allowedRoles={['student', 'admin', 'teacher']}>
                  <StudentSettingsPage />
                </ProtectedRoute>
              } />
              <Route path="/student/courses" element={
                <ProtectedRoute allowedRoles={['student', 'admin', 'teacher']}>
                  <CoursesPage />
                </ProtectedRoute>
              } />
              <Route path="/student/courses/:courseId" element={
                <ProtectedRoute allowedRoles={['student', 'admin', 'teacher']}>
                  <CourseDetailsPage />
                </ProtectedRoute>
              } />
              <Route path="/student/paid-courses/:courseId" element={
                <ProtectedRoute allowedRoles={['student', 'admin', 'teacher']}>
                  <PaidCourseDetailsPage />
                </ProtectedRoute>
              } />
              <Route path="/student/learn/:courseId" element={
                <ProtectedRoute allowedRoles={['student', 'admin', 'teacher']}>
                  <CourseLearnPage />
                </ProtectedRoute>
              } />
              <Route path="/student/exercises" element={
                <ProtectedRoute allowedRoles={['student', 'admin', 'teacher']}>
                  <ExercisesPage />
                </ProtectedRoute>
              } />
              <Route path="/student/projects" element={
                <ProtectedRoute allowedRoles={['student', 'admin', 'teacher']}>
                  <ProjectsPage />
                </ProtectedRoute>
              } />
              <Route path="/student/progress" element={
                <ProtectedRoute allowedRoles={['student', 'admin', 'teacher']}>
                  <ProgressPage />
                </ProtectedRoute>
              } />
              <Route path="/student/achievements" element={
                <ProtectedRoute allowedRoles={['student', 'admin', 'teacher']}>
                  <AchievementsPage />
                </ProtectedRoute>
              } />
              <Route path="/student/discussion" element={
                <ProtectedRoute allowedRoles={['student', 'admin', 'teacher']}>
                  <DiscussionPage />
                </ProtectedRoute>
              } />
              <Route path="/student/notifications" element={
                <ProtectedRoute allowedRoles={['student', 'admin', 'teacher']}>
                  <NotificationsPage />
                </ProtectedRoute>
              } />
              <Route path="/student/profile" element={
                <ProtectedRoute allowedRoles={['student', 'admin', 'teacher']}>
                  <ProfilePage />
                </ProtectedRoute>
              } />
              <Route path="/student/ai-assistant" element={
                <ProtectedRoute allowedRoles={['student', 'admin', 'teacher']}>
                  <AIAssistantPage />
                </ProtectedRoute>
              } />
              <Route path="/student/code-editor" element={
                <ProtectedRoute allowedRoles={['student', 'admin', 'teacher']}>
                  <CodeEditorPage />
                </ProtectedRoute>
              } />

              {/* Teacher Routes */}
              <Route path="/teacher" element={
                <ProtectedRoute allowedRoles={['teacher', 'admin']}>
                  <TeacherDashboard />
                </ProtectedRoute>
              } />
              <Route path="/teacher/settings" element={
                <ProtectedRoute allowedRoles={['teacher', 'admin']}>
                  <TeacherSettingsPage />
                </ProtectedRoute>
              } />
              <Route path="/teacher/courses" element={
                <ProtectedRoute allowedRoles={['teacher', 'admin']}>
                  <TeacherCoursesPage />
                </ProtectedRoute>
              } />
              <Route path="/teacher/exercises" element={
                <ProtectedRoute allowedRoles={['teacher', 'admin']}>
                  <TeacherExercisesPage />
                </ProtectedRoute>
              } />
              <Route path="/teacher/courses/create" element={
                <ProtectedRoute allowedRoles={['teacher', 'admin']}>
                  <CreateCoursePage />
                </ProtectedRoute>
              } />
              <Route path="/teacher/courses/edit/:courseId" element={
                <ProtectedRoute allowedRoles={['teacher', 'admin']}>
                  <EditCoursePage />
                </ProtectedRoute>
              } />
              <Route path="/teacher/exercises/create" element={
                <ProtectedRoute allowedRoles={['teacher', 'admin']}>
                  <CreateExercisePage />
                </ProtectedRoute>
              } />

              {/* Admin Routes */}
              <Route path="/admin" element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminDashboard />
                </ProtectedRoute>
              } />
              <Route path="/admin/settings" element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminSettingsPage />
                </ProtectedRoute>
              } />

              {/* 404 Route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <Toaster position="top-right" closeButton />
        </Router>
      </QueryClientProvider>
    </ThemeProvider>
  );
};

export default App;
