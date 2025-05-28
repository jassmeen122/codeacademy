
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase, authWithRetry } from "@/integrations/supabase/client";
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
  const [systemStatus, setSystemStatus] = useState<'checking' | 'available' | 'degraded'>('checking');
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

  // Check system status on mount
  useEffect(() => {
    const checkSystemStatus = async () => {
      try {
        // Simple health check
        const { data, error } = await supabase.auth.getSession();
        setSystemStatus(error ? 'degraded' : 'available');
      } catch (error) {
        console.warn("System status check failed, continuing in degraded mode");
        setSystemStatus('degraded');
      }
    };
    
    checkSystemStatus();
  }, []);

  // Clean up any stale auth tokens before logging in
  const cleanupAuthState = () => {
    try {
      Object.keys(localStorage).forEach((key) => {
        if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
          localStorage.removeItem(key);
        }
      });
    } catch (error) {
      console.warn("Error cleaning auth state:", error);
    }
  };

  // Animation effect for terminal-style text
  useEffect(() => {
    let i = 0;
    const txt = welcomeText;
    const speed = 50;

    const typeWriter = () => {
      if (i < txt.length) {
        setAnimatedText(txt.substring(0, i + 1));
        i++;
        setTimeout(typeWriter, speed);
      }
    };

    setAnimatedText("");
    i = 0;
    typeWriter();
  }, [isSignUp, welcomeText]);

  // Check for existing session and redirect if logged in
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          console.log("Found existing session:", session.user.id);
          
          const role = session.user.user_metadata?.role || 'student';
          console.log("User role from metadata:", role);
          
          redirectUserByRole(role);
        }
      } catch (error) {
        console.error("Error checking authentication:", error);
      }
    };

    if (systemStatus !== 'checking') {
      checkAuth();
    }
  }, [navigate, systemStatus]);

  // Helper function to redirect user based on role
  const redirectUserByRole = (role: string) => {
    console.log("Redirecting user with role:", role);
    
    // Use setTimeout to ensure the redirect happens after the current execution
    setTimeout(() => {
      switch (role) {
        case 'admin': 
          window.location.href = '/admin'; 
          break;
        case 'teacher': 
          window.location.href = '/teacher'; 
          break;
        default: 
          window.location.href = '/student'; 
          break;
      }
    }, 100);
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Clean up any stale auth state first
      cleanupAuthState();
      
      // Force sign out any existing session
      try {
        await supabase.auth.signOut({ scope: 'global' });
        console.log("Previous session cleared");
      } catch (signOutError) {
        console.warn("Sign out during cleanup failed (non-critical):", signOutError);
      }

      // Small delay to ensure cleanup is complete
      await new Promise(resolve => setTimeout(resolve, 200));
      
      if (isSignUp) {
        // Validate form data
        if (!formData.email || !formData.password || !formData.fullName) {
          throw new Error("Veuillez remplir tous les champs");
        }

        if (formData.password.length < 6) {
          throw new Error("Le mot de passe doit contenir au moins 6 caractères");
        }

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
            }
          },
        });

        if (error) {
          if (error.message?.includes('User already registered')) {
            throw new Error("Cet email est déjà enregistré. Veuillez vous connecter.");
          }
          throw error;
        }

        if (data?.user?.identities?.length === 0) {
          throw new Error("Cet email est déjà enregistré. Veuillez vous connecter.");
        }

        console.log("Signup successful:", data.user?.id);
        toast.success("Compte créé avec succès! Vérifiez votre email pour confirmation.");
        setIsSignUp(false);
      } else {
        console.log("Attempting signin with email:", formData.email);
        
        const { data, error } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password,
        });
          
        if (error) {
          console.error("Login error:", error);
          
          // Handle specific login errors with better messages but continue with auth flow
          if (error.message?.includes('Database error') || 
              error.message?.includes('permission denied') ||
              error.code === 'unexpected_failure') {
            
            console.log("Database error during login, but checking if auth was successful...");
            
            // Wait a moment then check if we actually got authenticated despite the error
            setTimeout(async () => {
              try {
                const { data: sessionData } = await supabase.auth.getSession();
                if (sessionData.session?.user) {
                  console.log("Auth successful despite database error");
                  const role = sessionData.session.user.user_metadata?.role || 'student';
                  toast.success("Connexion réussie! Redirection...");
                  redirectUserByRole(role);
                  return;
                }
              } catch (sessionError) {
                console.warn("Session check failed:", sessionError);
              }
              
              // If we get here, auth really failed
              toast.error("Erreur de connexion. Veuillez réessayer.");
            }, 1000);
            
            return; // Don't throw the error, let the timeout handle it
          }
          
          throw error;
        }

        if (!data.user) {
          throw new Error("Email ou mot de passe invalide");
        }

        console.log("Login successful:", data.user.id);
        toast.success("Connexion réussie! Redirection...");
        
        // Get role from user metadata and redirect accordingly
        const role = data.user.user_metadata?.role || 'student';
        
        // Force redirect with role-based navigation
        redirectUserByRole(role);
      }
    } catch (error: any) {
      console.error("Auth error:", error);
      
      // Enhanced error handling with French messages
      if (error.message?.includes("Invalid login credentials")) {
        toast.error("Email ou mot de passe incorrect. Veuillez réessayer.");
      } else if (error.message?.includes("Email not confirmed")) {
        toast.error("Veuillez vérifier votre adresse email avant de vous connecter.");
      } else if (error.message?.includes("rate limited")) {
        toast.error("Trop de tentatives de connexion. Veuillez réessayer plus tard.");
      } else if (error.message?.includes("User already registered")) {
        toast.error("Cet email est déjà enregistré. Veuillez vous connecter.");
        setIsSignUp(false);
      } else if (error.message?.includes("Network error") || 
                 error.message?.includes("Failed to fetch")) {
        toast.error("Problème de connexion réseau. Vérifiez votre connexion internet.");
      } else {
        toast.error(error.message || "Une erreur s'est produite lors de l'authentification");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Show system status if degraded
  const SystemStatusBanner = () => {
    if (systemStatus === 'degraded') {
      return (
        <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
          <div className="flex items-center text-sm text-yellow-800">
            <Server className="h-4 w-4 mr-2" />
            <span>Service en mode dégradé - Certaines fonctionnalités peuvent être limitées</span>
          </div>
        </div>
      );
    }
    return null;
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
          <SystemStatusBanner />
          
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
                ? "// Un email de confirmation sera envoyé pour vérifier votre compte"
                : "// Entrez vos identifiants pour accéder à votre compte"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
