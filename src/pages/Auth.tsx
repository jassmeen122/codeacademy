
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        // Fetch user role and redirect accordingly
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', session.user.id)
          .single();

        if (profile) {
          switch (profile.role) {
            case 'admin':
              navigate('/admin');
              break;
            case 'teacher':
              navigate('/teacher');
              break;
            case 'student':
              navigate('/student');
              break;
            default:
              navigate('/');
          }
        }
      }
    };

    checkAuth();
  }, [navigate]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isSignUp) {
        console.log("Attempting signup with data:", {
          email: formData.email,
          fullName: formData.fullName,
          role: formData.role
        });
        
        const { data, error } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
          options: {
            data: {
              full_name: formData.fullName,
              role: formData.role,
            },
          },
        });

        if (error) throw error;

        toast.success("Check your email to confirm your account!");
      } else {
        console.log("Attempting signin with email:", formData.email);
        
        const { data: { user }, error } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password,
        });
        
        if (error) throw error;

        if (!user) {
          throw new Error("No user returned from signin");
        }

        toast.success("Successfully signed in!");
        
        // Fetch user role and redirect accordingly
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single();

        if (profileError) throw profileError;

        if (profile) {
          switch (profile.role) {
            case 'admin':
              navigate('/admin');
              break;
            case 'teacher':
              navigate('/teacher');
              break;
            case 'student':
              navigate('/student');
              break;
            default:
              navigate('/');
          }
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
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-50">
      {/* Logo/Brand Section */}
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold text-primary mb-2">Code Academy</h1>
        <p className="text-gray-600">Your Journey to Programming Excellence</p>
      </div>

      <div className="w-full max-w-md p-8 glass-card rounded-xl border border-blue-100 shadow-lg">
        <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">
          {isSignUp ? "Create an Account" : "Welcome Back"}
        </h2>
        <form onSubmit={handleAuth} className="space-y-4">
          {isSignUp && (
            <>
              <div>
                <label htmlFor="fullName" className="text-sm font-medium text-gray-700">
                  Full Name
                </label>
                <Input
                  id="fullName"
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  required={isSignUp}
                  className="mt-1"
                  placeholder="Enter your full name"
                />
              </div>
              <div>
                <label htmlFor="role" className="text-sm font-medium text-gray-700">
                  Role
                </label>
                <Select
                  value={formData.role}
                  onValueChange={(value: "admin" | "teacher" | "student") =>
                    setFormData({ ...formData, role: value })
                  }
                >
                  <SelectTrigger className="w-full mt-1">
                    <SelectValue placeholder="Select your role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="student">Student/Learner</SelectItem>
                    <SelectItem value="teacher">Teacher/Professor</SelectItem>
                    <SelectItem value="admin">Administrator</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </>
          )}
          <div>
            <label htmlFor="email" className="text-sm font-medium text-gray-700">
              Email
            </label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
              className="mt-1"
              placeholder="Enter your email"
            />
          </div>
          <div>
            <label htmlFor="password" className="text-sm font-medium text-gray-700">
              Password
            </label>
            <Input
              id="password"
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
              className="mt-1"
              placeholder="Enter your password"
            />
          </div>
          <Button 
            type="submit" 
            className="w-full bg-primary hover:bg-primary/90" 
            disabled={isLoading}
          >
            {isLoading ? "Loading..." : isSignUp ? "Sign Up" : "Sign In"}
          </Button>
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
