import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { UserAvatar } from "@/components/UserAvatar";

const Auth = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    fullName: "",
    role: "student" as "admin" | "teacher" | "student",
  });

  useEffect(() => {
    // Check if user is already logged in
    const checkAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        console.log("Initial auth check:", session?.user?.id);
        
        if (session) {
          // Fetch user role and redirect accordingly
          const { data: profile, error } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', session.user.id)
            .single();

          if (error) {
            console.error("Error fetching profile:", error);
            return;
          }

          if (profile) {
            console.log("User already logged in with role:", profile.role);
            redirectBasedOnRole(profile.role);
          }
        }
      } catch (error) {
        console.error("Error checking auth:", error);
      }
    };

    checkAuth();
  }, [navigate]);

  const redirectBasedOnRole = (role: string) => {
    console.log("Redirecting user with role:", role);
    
    switch (role) {
      case 'admin':
        navigate('/admin', { replace: true });
        break;
      case 'teacher':
        navigate('/teacher', { replace: true });
        break;
      case 'student':
        navigate('/student', { replace: true });
        break;
      default:
        navigate('/', { replace: true });
    }
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isSignUp) {
        // Validate form data
        if (!formData.email || !formData.password || !formData.fullName) {
          throw new Error("Please fill in all fields");
        }

        if (formData.password.length < 6) {
          throw new Error("Password must be at least 6 characters long");
        }
        
        console.log("Attempting signup with data:", {
          email: formData.email,
          fullName: formData.fullName,
          role: formData.role
        });
        
        const { data, error: signUpError } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
          options: {
            data: {
              full_name: formData.fullName,
              role: formData.role,
            },
            emailRedirectTo: window.location.origin + '/auth'
          },
        });

        if (signUpError) throw signUpError;

        if (data?.user?.identities?.length === 0) {
          throw new Error("This email is already registered. Please sign in instead.");
        }

        // Check if email verification is required
        const { data: authConfig } = await supabase.auth.getSession();
        if (authConfig.session) {
          // User is automatically signed in - email verification is disabled
          toast.success("Account created successfully!");
          const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', authConfig.session.user.id)
            .single();

          if (profile) {
            redirectBasedOnRole(profile.role);
          }
        } else {
          // Email verification is required
          toast.success("Please check your email to confirm your account!");
        }
      } else {
        console.log("Attempting signin with email:", formData.email);
        
        const { data, error: signInError } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password,
        });
        
        if (signInError) throw signInError;

        if (!data?.user) {
          throw new Error("Invalid email or password");
        }

        console.log("Sign in successful, user:", data.user.id);
        toast.success("Successfully signed in!");
        
        // Fetch user role and redirect accordingly
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', data.user.id)
          .single();

        if (profileError) {
          console.error("Error fetching profile:", profileError);
          throw profileError;
        }

        if (profile) {
          console.log("Redirecting user with role:", profile.role);
          redirectBasedOnRole(profile.role);
        }
      }
    } catch (error: any) {
      console.error("Auth error:", error);
      toast.error(error.message || "An error occurred during authentication");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Logo/Brand Section */}
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold text-primary mb-2">Code Academy</h1>
        <p className="text-gray-600 dark:text-gray-300">Your Journey to Programming Excellence</p>
      </div>

      <div className="w-full max-w-md p-8 glass-card rounded-xl border border-blue-100 shadow-lg dark:border-gray-700 dark:bg-gray-800">
        <h2 className="text-3xl font-bold text-center mb-8 text-gray-800 dark:text-white">
          {isSignUp ? "Create an Account" : "Welcome Back"}
        </h2>
        
        <form onSubmit={handleAuth} className="space-y-4">
          {isSignUp && (
            <>
              <div>
                <label htmlFor="fullName" className="text-sm font-medium text-gray-700 dark:text-gray-200">
                  Full Name
                </label>
                <input
                  id="fullName"
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  required={isSignUp}
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  placeholder="Enter your full name"
                />
              </div>
              <div>
                <label htmlFor="role" className="text-sm font-medium text-gray-700 dark:text-gray-200">
                  Role
                </label>
                <select
                  id="role"
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value as "admin" | "teacher" | "student" })}
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                >
                  <option value="student">Student/Learner</option>
                  <option value="teacher">Teacher/Professor</option>
                  <option value="admin">Administrator</option>
                </select>
              </div>
            </>
          )}
          <div>
            <label htmlFor="email" className="text-sm font-medium text-gray-700 dark:text-gray-200">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              placeholder="Enter your email"
            />
          </div>
          <div>
            <label htmlFor="password" className="text-sm font-medium text-gray-700 dark:text-gray-200">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              placeholder="Enter your password"
            />
          </div>
          <button 
            type="submit" 
            className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary" 
            disabled={isLoading}
          >
            {isLoading ? "Loading..." : isSignUp ? "Sign Up" : "Sign In"}
          </button>
        </form>
        <div className="mt-6 text-center">
          <button
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-primary hover:underline text-sm"
          >
            {isSignUp
              ? "Already have an account? Sign In"
              : "Don't have an account? Sign Up"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Auth;
