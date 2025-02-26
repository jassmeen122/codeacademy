
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

interface MobileMenuProps {
  isOpen: boolean;
  session: any;
  loading: boolean;
  onAuth: () => void;
}

export const MobileMenu = ({ isOpen, session, loading, onAuth }: MobileMenuProps) => {
  if (!isOpen) return null;

  return (
    <div className="md:hidden animate-fadeIn">
      <div className="px-2 pt-2 pb-3 space-y-1">
        <Link
          to="/student"
          className="block px-3 py-2 text-base font-medium text-foreground/60 hover:text-foreground"
        >
          Dashboard
        </Link>
        <Link
          to="#courses"
          className="block px-3 py-2 text-base font-medium text-foreground/60 hover:text-foreground"
        >
          Courses
        </Link>
        <Link
          to="#features"
          className="block px-3 py-2 text-base font-medium text-foreground/60 hover:text-foreground"
        >
          Features
        </Link>
        {!loading && (
          <Button
            className="w-full mt-4"
            onClick={onAuth}
          >
            {session ? "Sign Out" : "Sign In"}
          </Button>
        )}
      </div>
    </div>
  );
};
