
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Bell, Moon, Sun, Lock, Mail, User, ShieldAlert } from "lucide-react";
import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuthState } from "@/hooks/useAuthState";
import { ProfilePhotoUpload } from "@/components/ProfilePhotoUpload";

export default function AdminSettingsPage() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const { user } = useAuthState();
  const [settings, setSettings] = useState({
    emailNotifications: true,
    systemAlerts: true,
    userActivityNotifications: true,
    twoFactorAuth: true,
  });
  const [profileData, setProfileData] = useState({
    fullName: "",
    title: "System Administrator",
    email: ""
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setMounted(true);
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
        
        if (data && !error) {
          setProfileData({
            fullName: data.full_name || "",
            title: "System Administrator",
            email: data.email || ""
          });
        }
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  };

  const handleSettingChange = (setting: keyof typeof settings) => {
    setSettings((prev) => ({
      ...prev,
      [setting]: !prev[setting],
    }));
    toast.success(`Setting updated successfully!`);
  };

  const updateProfile = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        const { error } = await supabase
          .from('profiles')
          .update({
            full_name: profileData.fullName
          })
          .eq('id', user.id);
        
        if (error) throw error;
        
        toast.success("Profile updated successfully!");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const handleProfilePhotoChange = (url: string) => {
    // This function is passed to the ProfilePhotoUpload component
    // The database update is handled in the component itself
  };

  if (!mounted) return null;

  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Admin Settings</h1>

        <div className="space-y-6">
          {/* Profile Photo */}
          <Card>
            <CardHeader>
              <CardTitle>Profile Photo</CardTitle>
            </CardHeader>
            <CardContent className="flex justify-center">
              <ProfilePhotoUpload 
                user={user} 
                onPhotoChange={handleProfilePhotoChange} 
              />
            </CardContent>
          </Card>

          {/* Profile Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Profile Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Full Name</Label>
                <Input 
                  type="text" 
                  placeholder="Your full name" 
                  value={profileData.fullName}
                  onChange={(e) => setProfileData({...profileData, fullName: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label>Title</Label>
                <Input 
                  type="text" 
                  value={profileData.title}
                  disabled
                />
                <p className="text-xs text-muted-foreground">
                  Admin title cannot be changed
                </p>
              </div>
              <div className="pt-2">
                <Button onClick={updateProfile} disabled={loading}>
                  {loading ? "Updating..." : (
                    <>
                      <User className="mr-2 h-4 w-4" />
                      Update Profile
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Notifications */}
          <Card>
            <CardHeader>
              <CardTitle>Notifications</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Email Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive email updates about system events
                  </p>
                </div>
                <Switch
                  checked={settings.emailNotifications}
                  onCheckedChange={() => handleSettingChange("emailNotifications")}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>System Alerts</Label>
                  <p className="text-sm text-muted-foreground">
                    Get notified about system errors and critical events
                  </p>
                </div>
                <Switch
                  checked={settings.systemAlerts}
                  onCheckedChange={() => handleSettingChange("systemAlerts")}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>User Activity</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive notifications about important user activities
                  </p>
                </div>
                <Switch
                  checked={settings.userActivityNotifications}
                  onCheckedChange={() => handleSettingChange("userActivityNotifications")}
                />
              </div>
            </CardContent>
          </Card>

          {/* Appearance */}
          <Card>
            <CardHeader>
              <CardTitle>Appearance</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Dark Mode</Label>
                  <p className="text-sm text-muted-foreground">
                    Toggle dark mode theme
                  </p>
                </div>
                <Switch
                  checked={theme === "dark"}
                  onCheckedChange={() => setTheme(theme === "dark" ? "light" : "dark")}
                />
              </div>
            </CardContent>
          </Card>

          {/* Security */}
          <Card>
            <CardHeader>
              <CardTitle>Security</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Two-Factor Authentication</Label>
                  <p className="text-sm text-muted-foreground">
                    Add an extra layer of security to your account
                  </p>
                </div>
                <Switch
                  checked={settings.twoFactorAuth}
                  onCheckedChange={() => handleSettingChange("twoFactorAuth")}
                />
              </div>
              <div className="pt-4">
                <Button variant="outline" className="w-full">
                  <Lock className="mr-2 h-4 w-4" />
                  Change Password
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Email Preferences */}
          <Card>
            <CardHeader>
              <CardTitle>Email Preferences</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Email Address</Label>
                <div className="flex gap-2">
                  <Input 
                    type="email" 
                    placeholder="your@email.com" 
                    value={profileData.email}
                    disabled
                  />
                  <Button>
                    <Mail className="mr-2 h-4 w-4" />
                    Update
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Contact system support to change administrative email addresses
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
