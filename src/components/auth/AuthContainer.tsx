
import { ReactNode } from "react";

interface AuthContainerProps {
  children: ReactNode;
}

const AuthContainer = ({ children }: AuthContainerProps) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-50">
      {/* Logo/Brand Section */}
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold text-primary mb-2">Code Academy</h1>
        <p className="text-gray-600">Your Journey to Programming Excellence</p>
      </div>

      <div className="w-full max-w-md p-8 glass-card rounded-xl border border-blue-100 shadow-lg">
        {children}
      </div>
    </div>
  );
};

export default AuthContainer;
