
import React, { useState } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Bell, Mail, Trophy, Megaphone, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { useNotifications } from "@/hooks/useNotifications";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

export default function NotificationsPage() {
  const [activeTab, setActiveTab] = useState<string>("notifications");
  const { 
    notifications, 
    loading, 
    markAsRead, 
    markAllAsRead 
  } = useNotifications();
  const navigate = useNavigate();

  const getIcon = (type: string) => {
    switch (type) {
      case 'announcement':
        return <Megaphone className="h-5 w-5" />;
      case 'message':
        return <Mail className="h-5 w-5" />;
      case 'achievement':
        return <Trophy className="h-5 w-5" />;
      default:
        return <Bell className="h-5 w-5" />;
    }
  };

  const handleNotificationClick = async (notificationId: string, type: string) => {
    // Mark notification as read
    await markAsRead(notificationId);
    
    // If it's a message notification, navigate to messages page
    if (type === 'message') {
      navigate("/student/messages");
    }
  };

  const handleMarkAllAsRead = async () => {
    await markAllAsRead();
    toast.success("Toutes les notifications ont été marquées comme lues");
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-8">Notifications</h1>
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Centre de notifications</h1>
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
            onClick={handleMarkAllAsRead}
          >
            <Check className="h-4 w-4" />
            Tout marquer comme lu
          </Button>
        </div>

        <Tabs 
          defaultValue="notifications" 
          className="space-y-4"
          value={activeTab}
          onValueChange={setActiveTab}
        >
          <TabsList className="grid grid-cols-2 w-[400px]">
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="messages" onClick={() => navigate("/student/messages")}>Messages</TabsTrigger>
          </TabsList>

          <TabsContent value="notifications" className="space-y-4">
            {notifications.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-8 text-center">
                  <Bell className="h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">Vous n'avez pas de notifications</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {notifications.map((notification) => (
                  <Card
                    key={notification.id}
                    className={cn(
                      "cursor-pointer hover:shadow-md transition-shadow",
                      !notification.read && "border-l-4 border-l-primary"
                    )}
                    onClick={() => handleNotificationClick(notification.id, notification.type)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start gap-4">
                        <div className="p-2 rounded-full bg-muted">
                          {getIcon(notification.type)}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium">{notification.title}</h3>
                          <p className="text-sm text-muted-foreground">
                            {notification.content}
                          </p>
                          <p className="text-xs text-muted-foreground mt-2">
                            {new Date(notification.created_at).toLocaleDateString()} à {new Date(notification.created_at).toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
