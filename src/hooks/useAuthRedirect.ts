
import { useNavigate } from "react-router-dom";

export const useAuthRedirect = () => {
  const navigate = useNavigate();

  const redirectToDashboard = (role: string) => {
    console.log("Redirecting to dashboard for role:", role);
    switch (role) {
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
  };

  return { redirectToDashboard };
};
