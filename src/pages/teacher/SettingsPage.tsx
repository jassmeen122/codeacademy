
import { useState } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuthState, UserProfile } from "@/hooks/useAuthState";
import { ThemeSettings, NotificationSettings, SecuritySettings } from "@/types/teacher";
import { ProfilePhotoUpload } from "@/components/ProfilePhotoUpload";

const TeacherSettingsPage = () => {
  const { user } = useAuthState();
  const [profile, setProfile] = useState<UserProfile | null>(user);
  const [loading, setLoading] = useState(false);
  
  // Mock theme settings for demonstration
  const [themeSettings, setThemeSettings] = useState<ThemeSettings>({
    colorTheme: 'blue',
  });
  
  // Mock notification settings for demonstration
  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>({
    emailNotifications: true,
    assignmentNotifications: true,
    discussionNotifications: false,
  });
  
  // Mock security settings for demonstration
  const [securitySettings, setSecuritySettings] = useState<SecuritySettings>({
    twoFactorAuth: false,
  });

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile || !user) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: profile.full_name,
          bio: profile.bio,
          specialization: profile.specialization,
        })
        .eq('id', user.id);

      if (error) throw error;
      toast.success('Profile updated successfully');
    } catch (error: any) {
      toast.error(error.message || 'Error updating profile');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfileField = (field: keyof UserProfile, value: string | null) => {
    if (profile) {
      setProfile({ ...profile, [field]: value });
    }
  };

  const handlePhotoChange = (url: string) => {
    if (profile) {
      setProfile({ ...profile, avatar_url: url });
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
          <p className="text-muted-foreground">Manage your account settings and preferences.</p>
        </div>

        <Tabs defaultValue="profile" className="space-y-4">
          <TabsList>
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="appearance">Appearance</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Profile Photo</CardTitle>
                <CardDescription>
                  This is your public profile photo. It will be visible to students and other teachers.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ProfilePhotoUpload user={user} onPhotoChange={handlePhotoChange} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>
                  Update your profile information that will be visible to students and administrators.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSaveProfile} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      value={profile?.full_name || ''}
                      onChange={(e) => handleUpdateProfileField('full_name', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      value={profile?.email || ''}
                      disabled
                    />
                    <p className="text-sm text-muted-foreground">
                      Your email cannot be changed.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="specialization">Specialization</Label>
                    <Input
                      id="specialization"
                      value={profile?.specialization || ''}
                      onChange={(e) => handleUpdateProfileField('specialization', e.target.value)}
                      placeholder="e.g., Web Development, AI, Data Science"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea
                      id="bio"
                      value={profile?.bio || ''}
                      onChange={(e) => handleUpdateProfileField('bio', e.target.value)}
                      placeholder="Tell students about your background, expertise, and teaching style"
                      className="min-h-32"
                    />
                  </div>
                  <Button type="submit" disabled={loading}>
                    {loading ? 'Saving...' : 'Save Changes'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="appearance">
            <Card>
              <CardHeader>
                <CardTitle>Appearance</CardTitle>
                <CardDescription>
                  Customize how the dashboard looks for you.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="theme">Color Theme</Label>
                  <Select
                    value={themeSettings.colorTheme}
                    onValueChange={(value: 'blue' | 'purple' | 'green' | 'dark') => 
                      setThemeSettings({...themeSettings, colorTheme: value})
                    }
                  >
                    <SelectTrigger id="theme">
                      <SelectValue placeholder="Select a theme" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="blue">Blue</SelectItem>
                      <SelectItem value="purple">Purple</SelectItem>
                      <SelectItem value="green">Green</SelectItem>
                      <SelectItem value="dark">Dark</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button>Save Preferences</Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle>Notification Settings</CardTitle>
                <CardDescription>
                  Configure how you receive notifications from the platform.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="emailNotifications" className="text-base">
                      Email Notifications
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Receive notifications via email.
                    </p>
                  </div>
                  <Switch
                    id="emailNotifications"
                    checked={notificationSettings.emailNotifications}
                    onCheckedChange={(checked) => 
                      setNotificationSettings({...notificationSettings, emailNotifications: checked})
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="assignmentNotifications" className="text-base">
                      Assignment Submissions
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Notifications when students submit assignments.
                    </p>
                  </div>
                  <Switch
                    id="assignmentNotifications"
                    checked={notificationSettings.assignmentNotifications}
                    onCheckedChange={(checked) => 
                      setNotificationSettings({...notificationSettings, assignmentNotifications: checked})
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="discussionNotifications" className="text-base">
                      Discussion Replies
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Notifications for new replies in discussions.
                    </p>
                  </div>
                  <Switch
                    id="discussionNotifications"
                    checked={notificationSettings.discussionNotifications}
                    onCheckedChange={(checked) => 
                      setNotificationSettings({...notificationSettings, discussionNotifications: checked})
                    }
                  />
                </div>
                <Button>Save Notification Settings</Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security">
            <Card>
              <CardHeader>
                <CardTitle>Security Settings</CardTitle>
                <CardDescription>
                  Manage your security settings and preferences.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="twoFactorAuth" className="text-base">
                      Two-factor Authentication
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Add an extra layer of security to your account.
                    </p>
                  </div>
                  <Switch
                    id="twoFactorAuth"
                    checked={securitySettings.twoFactorAuth}
                    onCheckedChange={(checked) => 
                      setSecuritySettings({...securitySettings, twoFactorAuth: checked})
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Change Password</Label>
                  <Input id="currentPassword" type="password" placeholder="Current password" />
                  <Input placeholder="New password" />
                  <Input placeholder="Confirm new password" />
                </div>
                <Button>Update Security Settings</Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default TeacherSettingsPage;
