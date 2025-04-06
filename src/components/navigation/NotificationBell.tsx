
import { useState, useEffect } from "react";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useNotifications } from "@/hooks/useNotifications";
import { usePrivateMessages } from "@/hooks/usePrivateMessages";

interface NotificationBellProps {
  userId: string;
}

export const NotificationBell = ({ userId }: NotificationBellProps) => {
  const [notificationCount, setNotificationCount] = useState(0);
  const navigate = useNavigate();
  const { unreadCount: unreadNotifications, fetchNotifications } = useNotifications();
  const { getUnreadCount } = usePrivateMessages();
  const [unreadMessages, setUnreadMessages] = useState(0);
  const [totalUnread, setTotalUnread] = useState(0);

  useEffect(() => {
    if (userId) {
      fetchUnreadCounts();

      // Set up subscription for real-time updates
      const notificationsSubscription = supabase
        .channel('public:notifications')
        .on('postgres_changes', 
          { 
            event: 'INSERT', 
            schema: 'public', 
            table: 'notifications',
            filter: `user_id=eq.${userId}`
          }, 
          () => {
            fetchUnreadCounts();
          }
        )
        .subscribe();

      const messagesSubscription = supabase
        .channel('public:private_messages')
        .on('postgres_changes', 
          { 
            event: 'INSERT', 
            schema: 'public', 
            table: 'private_messages',
            filter: `receiver_id=eq.${userId}`
          }, 
          () => {
            fetchUnreadCounts();
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(notificationsSubscription);
        supabase.removeChannel(messagesSubscription);
      };
    }
  }, [userId]);

  useEffect(() => {
    // Update total unread count when either messages or notifications change
    setTotalUnread(unreadNotifications + unreadMessages);
  }, [unreadNotifications, unreadMessages]);

  const fetchUnreadCounts = async () => {
    try {
      // Get unread messages count
      const messageCount = await getUnreadCount();
      setUnreadMessages(messageCount);
      
      // Notifications are fetched by the hook automatically
    } catch (error) {
      console.error('Error fetching unread counts:', error);
    }
  };

  const handleNotificationClick = () => {
    navigate("/student/notifications");
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleNotificationClick}
      className="relative"
    >
      <Bell className="h-5 w-5" />
      {totalUnread > 0 && (
        <Badge 
          variant="destructive" 
          className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs"
        >
          {totalUnread}
        </Badge>
      )}
    </Button>
  );
};
