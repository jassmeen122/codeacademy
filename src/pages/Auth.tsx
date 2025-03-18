
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import AuthContainer from "@/components/auth/AuthContainer";
import AuthForm from "@/components/auth/AuthForm";
import { useAuthRedirect } from "@/hooks/useAuthRedirect";

const Auth = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const { redirectToDashboard } = useAuthRedirect();

  useEffect(() => {
    // Check if user is already logged in
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      console.log("Auth page - checking session:", session ? "exists" : "does not exist");
      
      if (session) {
        // Fetch user role and redirect accordingly
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', session.user.id)
          .single();

        if (profile) {
          console.log("User already authenticated, redirecting to dashboard:", profile.role);
          redirectToDashboard(profile.role);
        } else {
          console.log("User authenticated but no profile found");
        }
      }
    };

    checkAuth();
  }, []);

  return (
    <AuthContainer>
      <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">
        {isSignUp ? "Create an Account" : "Welcome"}
      </h2>
      
      <AuthForm 
        isSignUp={isSignUp} 
        onSuccessfulAuth={redirectToDashboard} 
      />
      
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
    </AuthContainer>
  );
};

export default Auth;
