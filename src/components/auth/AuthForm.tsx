
import { useState } from "react";
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

interface AuthFormProps {
  isSignUp: boolean;
  onSuccessfulAuth: (role: string) => void;
}

const AuthForm = ({ isSignUp, onSuccessfulAuth }: AuthFormProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    fullName: "",
    role: "student" as "admin" | "teacher" | "student",
  });

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
          console.log("Account created and signed in, session:", authConfig.session ? "exists" : "does not exist");
          
          const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', authConfig.session.user.id)
            .single();

          if (profile) {
            console.log("Redirecting to dashboard after signup:", profile.role);
            onSuccessfulAuth(profile.role);
          } else {
            console.log("No profile found after signup");
          }
        } else {
          // Email verification is required
          toast.success("Please check your email to confirm your account!");
          console.log("Email verification required, no automatic login");
        }
      } else {
        console.log("Attempting signin with email:", formData.email);
        
        const { data, error: signInError } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password,
        });
        
        if (signInError) throw signInError;

        if (!data.user) {
          throw new Error("Invalid email or password");
        }

        toast.success("Successfully signed in!");
        console.log("Sign in successful, session:", data.session ? "exists" : "does not exist");
        
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
          console.log("Login successful, redirecting to dashboard:", profile.role);
          onSuccessfulAuth(profile.role);
        } else {
          console.error("No profile found for user");
          throw new Error("User profile not found");
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
  );
};

export default AuthForm;
