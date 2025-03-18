
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export const useAuthRedirect = () => {
  const navigate = useNavigate();

  const redirectToDashboard = (role: string) => {
    console.log("Redirecting to dashboard for role:", role);
    
    // Make sure the role is a string and convert to lowercase for case-insensitive comparison
    const normalizedRole = typeof role === 'string' ? role.toLowerCase() : '';
    
    switch (normalizedRole) {
      case 'admin':
        toast.success("Welcome back, Admin!");
        navigate('/admin', { replace: true });
        break;
      case 'teacher':
        toast.success("Welcome back, Teacher!");
        navigate('/teacher', { replace: true });
        break;
      case 'student':
        toast.success("Welcome back, Student!");
        navigate('/student', { replace: true });
        break;
      default:
        console.error("Unknown role:", role);
        toast.error("Login successful, but could not determine your role");
        navigate('/', { replace: true });
    }
  };

  return { redirectToDashboard };
};
