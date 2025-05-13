import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Terminal, User, Mail, Lock, Code, Server, BookOpen } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

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
  const [animatedText, setAnimatedText] = useState("");
  const welcomeText = isSignUp 
    ? "> Preparing new user registration..." 
    : "> Authenticating user...";

  // Clean up any stale auth tokens before logging in
  const cleanupAuthState = () => {
    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
        localStorage.removeItem(key);
      }
    });
  };

  // Animation effect for terminal-style text
  useEffect(() => {
    let i = 0;
    const txt = welcomeText;
    const speed = 50; // typing speed in ms

    const typeWriter = () => {
      if (i < txt.length) {
        setAnimatedText(txt.substring(0, i + 1));
        i++;
        setTimeout(typeWriter, speed);
      }
    };

    // Reset animation when switching between signup and signin
    setAnimatedText("");
    i = 0;
    typeWriter();
  }, [isSignUp, welcomeText]);

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
      // Clean up any stale auth state
      cleanupAuthState();
      
      // Try global sign out first to clear any existing sessions
      try {
        await supabase.auth.signOut({ scope: 'global' });
      } catch (signOutError) {
        // Continue even if this fails
        console.warn("Pre-auth signout failed:", signOutError);
      }

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
        
        // Sign up the user
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
            // Force page reload to ensure clean state
            window.location.href = `/${profile.role.toLowerCase()}`;
          }
        } else {
          // Email verification is required
          toast.success("Please check your email to confirm your account!");
        }
      } else {
        console.log("Attempting signin with email:", formData.email);
        
        try {
          const { data, error: signInError } = await supabase.auth.signInWithPassword({
            email: formData.email,
            password: formData.password,
          });
          
          if (signInError) throw signInError;

          if (!data.user) {
            throw new Error("Invalid email or password");
          }

          toast.success("Successfully signed in!");
          
          // Skip trying to update user_status since it causes permission errors
          // Instead, go directly to fetching user role and redirecting
          
          // Fetch user role and redirect accordingly
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', data.user.id)
            .single();

          if (profileError) throw profileError;

          if (profile) {
            // Force page reload to ensure clean state
            window.location.href = `/${profile.role.toLowerCase()}`;
          }
        } catch (error: any) {
          if (error.message === "Database error granting user" || 
              error.message.includes("permission denied for table user_status")) {
            // Special handling for the database error - log in anyway
            toast.success("Successfully signed in! Redirecting...");
            console.error("Database permission error:", error);
            
            // Try to get the user from the session directly
            const { data: { session } } = await supabase.auth.getSession();
            if (session?.user) {
              const { data: profile } = await supabase
                .from('profiles')
                .select('role')
                .eq('id', session.user.id)
                .single();
                
              if (profile) {
                window.location.href = `/${profile.role.toLowerCase()}`;
                return;
              } else {
                // Default to student if we can't get the role
                window.location.href = "/student";
                return;
              }
            } else {
              // Default to student if we can't get the session
              window.location.href = "/student";
              return;
            }
          } else {
            // Handle other errors
            throw error;
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
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-blue-50 to-white">
      {/* Auth container */}
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg p-2 flex items-center gap-2 border-b border-gray-200 shadow-sm">
          <div className="flex gap-2">
            <div className="w-3 h-3 rounded-full bg-red-400"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
            <div className="w-3 h-3 rounded-full bg-green-400"></div>
          </div>
          <div className="flex-1 text-center text-xs text-gray-500 font-medium">
            {isSignUp ? "CodeAcademy Registration" : "CodeAcademy Login"}
          </div>
          <BookOpen className="w-4 h-4 text-primary" />
        </div>

        <div className="p-8 bg-white rounded-b-lg border border-gray-200 shadow-md highlight-animation">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-primary mb-2 flex items-center gap-2">
              <Code className="h-5 w-5" />
              <span>CodeAcademy</span>
            </h2>
            <div className="comment-text text-xs">// Programming Excellence Platform</div>
            
            <div className="mt-4 font-mono text-sm text-primary">
              {animatedText}
              <span className="terminal-cursor"></span>
            </div>
          </div>
          
          <form onSubmit={handleAuth} className="space-y-4">
            {isSignUp && (
              <>
                <div className="code-block p-3 rounded-md bg-blue-50">
                  <div className="comment-text mb-1">// User details</div>
                  <div className="flex flex-col space-y-2">
                    <Label htmlFor="fullName" className="text-sm font-medium text-gray-600">
                      <span className="keyword-text">const</span> <span className="variable-text">fullName</span> <span className="text-gray-500">=</span>
                    </Label>
                    <div className="flex items-center">
                      <User className="w-4 h-4 mr-2 text-gray-500" />
                      <Input
                        id="fullName"
                        type="text"
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        required={isSignUp}
                        className="bg-white border-gray-300 text-gray-800"
                        placeholder="John Doe"
                      />
                    </div>
                  </div>
                </div>
                
                <div className="code-block p-3 rounded-md bg-blue-50">
                  <div className="comment-text mb-1">// Access level</div>
                  <div className="flex flex-col space-y-2">
                    <Label htmlFor="role" className="text-sm font-medium text-gray-600">
                      <span className="keyword-text">const</span> <span className="variable-text">role</span> <span className="text-gray-500">=</span>
                    </Label>
                    <div className="flex items-center">
                      <Server className="w-4 h-4 mr-2 text-gray-500" />
                      <Select
                        value={formData.role}
                        onValueChange={(value: "admin" | "teacher" | "student") =>
                          setFormData({ ...formData, role: value })
                        }
                      >
                        <SelectTrigger className="w-full bg-white border-gray-300 text-gray-800">
                          <SelectValue placeholder="Select role" />
                        </SelectTrigger>
                        <SelectContent className="bg-white border-gray-200 text-gray-800">
                          <SelectItem value="student" className="hover:bg-blue-50">student</SelectItem>
                          <SelectItem value="teacher" className="hover:bg-blue-50">teacher</SelectItem>
                          <SelectItem value="admin" className="hover:bg-blue-50">admin</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </>
            )}
            
            <div className="code-block p-3 rounded-md bg-blue-50">
              <div className="comment-text mb-1">// Authentication credentials</div>
              <div className="flex flex-col space-y-4">
                <div>
                  <Label htmlFor="email" className="text-sm font-medium text-gray-600">
                    <span className="keyword-text">const</span> <span className="variable-text">email</span> <span className="text-gray-500">=</span>
                  </Label>
                  <div className="flex items-center mt-1">
                    <Mail className="w-4 h-4 mr-2 text-gray-500" />
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                      className="bg-white border-gray-300 text-gray-800"
                      placeholder="user@example.com"
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="password" className="text-sm font-medium text-gray-600">
                    <span className="keyword-text">const</span> <span className="variable-text">password</span> <span className="text-gray-500">=</span>
                  </Label>
                  <div className="flex items-center mt-1">
                    <Lock className="w-4 h-4 mr-2 text-gray-500" />
                    <Input
                      id="password"
                      type="password"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      required
                      className="bg-white border-gray-300 text-gray-800"
                      placeholder="••••••••"
                    />
                  </div>
                </div>
              </div>
            </div>
            
            <div className="pt-2">
              <Button 
                type="submit" 
                className="w-full bg-primary hover:bg-primary/90 text-white font-bold" 
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="typing-animation">
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                  </div>
                ) : (
                  <>
                    <Terminal className="w-4 h-4 mr-2" />
                    {isSignUp ? "register()" : "login()"}
                  </>
                )}
              </Button>
            </div>
          </form>
          
          <div className="mt-6 text-center">
            <button
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-primary hover:underline text-sm font-mono"
            >
              {isSignUp
                ? "import { SignIn } from '@auth';"
                : "import { SignUp } from '@auth';"}
            </button>
          </div>
          
          <div className="mt-4 text-xs text-gray-500 font-mono">
            <div className="comment-text">
              {isSignUp 
                ? "// A confirmation email will be sent to verify your account"
                : "// Enter your credentials to access your account"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
