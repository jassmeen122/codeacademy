
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { UserAvatar } from "@/components/UserAvatar";

interface MobileMenuProps {
  isOpen: boolean;
  session: any;
  loading: boolean;
  onAuth: () => void;
  userRole?: string;
  onPortalClick?: () => void;
}

export const MobileMenu = ({ 
  isOpen, 
  session, 
  loading, 
  onAuth,
  userRole,
  onPortalClick 
}: MobileMenuProps) => {
  if (!isOpen) return null;
  
  const user = session?.user ? {
    full_name: session.user.user_metadata?.full_name,
    avatar_url: session.user.user_metadata?.avatar_url,
    role: userRole
  } : null;

  return (
    <div className="md:hidden">
      <div className="px-2 pt-2 pb-3 space-y-1 border-t border-border">
        {!loading && session && (
          <div className="flex items-center gap-3 p-3">
            <UserAvatar user={user} size="sm" />
            <div className="text-sm">
              <p className="font-medium">{user?.full_name || 'User'}</p>
              <p className="text-xs text-muted-foreground capitalize">{userRole || 'User'}</p>
            </div>
          </div>
        )}
        
        <Link
          to="/"
          className="block px-3 py-2 rounded-md text-base font-medium text-foreground hover:bg-accent/50"
        >
          Home
        </Link>
        
        {!loading && session && (userRole === 'teacher' || userRole === 'admin') && (
          <Button
            variant="outline"
            className="w-full justify-start border-primary text-primary hover:bg-primary/10"
            onClick={onPortalClick}
          >
            {userRole === 'admin' ? 'Admin Portal' : 'Teacher Portal'}
          </Button>
        )}
        
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
