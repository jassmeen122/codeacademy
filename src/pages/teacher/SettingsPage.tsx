
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Bell, Moon, Sun, Lock, Mail, User, Palette, Check } from "lucide-react";
import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { UserProfile } from "@/hooks/useAuthState";
import { useAuthState } from "@/hooks/useAuthState";
import { ProfilePhotoUpload } from "@/components/ProfilePhotoUpload";

export default function TeacherSettingsPage() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const { user } = useAuthState();
  const [settings, setSettings] = useState({
    emailNotifications: true,
    assignmentNotifications: true,
    discussionNotifications: true,
    twoFactorAuth: false,
    colorTheme: "blue"
  });
  const [profileData, setProfileData] = useState<{
    fullName: string;
    bio: string;
    specialization: string;
    email: string;
  }>({
    fullName: "",
    bio: "",
    specialization: "",
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
            bio: data.bio || "",
            specialization: data.specialization || "",
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

  const handleThemeChange = (value: string) => {
    setSettings(prev => ({
      ...prev,
      colorTheme: value
    }));
    toast.success(`Theme preference saved!`);

    // Apply theme changes
    switch (value) {
      case "blue":
        document.documentElement.style.setProperty('--primary-color', '#1E90FF');
        document.documentElement.style.setProperty('--secondary-color', '#0F056B');
        break;
      case "purple":
        document.documentElement.style.setProperty('--primary-color', '#800080');
        document.documentElement.style.setProperty('--secondary-color', '#FF69B4');
        break;
      case "green":
        document.documentElement.style.setProperty('--primary-color', '#32CD32');
        document.documentElement.style.setProperty('--secondary-color', '#FFFFFF');
        break;
      case "dark":
        // Dark mode is handled by the theme provider
        break;
    }
  };

  const updateProfile = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        const { error } = await supabase
          .from('profiles')
          .update({
            full_name: profileData.fullName,
            bio: profileData.bio,
            specialization: profileData.specialization
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
        <h1 className="text-3xl font-bold mb-8">Teacher Settings</h1>

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
                <Label>Bio</Label>
                <Input 
                  type="text" 
                  placeholder="Brief description about yourself" 
                  value={profileData.bio}
                  onChange={(e) => setProfileData({...profileData, bio: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label>Specialization</Label>
                <Input 
                  type="text" 
                  placeholder="e.g. Computer Science, Mathematics" 
                  value={profileData.specialization}
                  onChange={(e) => setProfileData({...profileData, specialization: e.target.value})}
                />
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
                    Receive email updates about your courses and students
                  </p>
                </div>
                <Switch
                  checked={settings.emailNotifications}
                  onCheckedChange={() => handleSettingChange("emailNotifications")}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Assignment Submissions</Label>
                  <p className="text-sm text-muted-foreground">
                    Get notified when students submit assignments
                  </p>
                </div>
                <Switch
                  checked={settings.assignmentNotifications}
                  onCheckedChange={() => handleSettingChange("assignmentNotifications")}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Discussion Mentions</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive notifications when mentioned in discussions
                  </p>
                </div>
                <Switch
                  checked={settings.discussionNotifications}
                  onCheckedChange={() => handleSettingChange("discussionNotifications")}
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
              
              <div className="space-y-4 pt-2">
                <Label>Color Theme</Label>
                <RadioGroup 
                  value={settings.colorTheme} 
                  onValueChange={handleThemeChange}
                  className="grid grid-cols-1 md:grid-cols-2 gap-4"
                >
                  <div>
                    <RadioGroupItem 
                      value="blue" 
                      id="blue" 
                      className="peer sr-only" 
                    />
                    <Label 
                      htmlFor="blue" 
                      className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-gradient-to-br from-blue-100 to-blue-50 p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-blue-500 [&:has([data-state=checked])]:border-blue-500"
                    >
                      <div className="mb-2 flex items-center justify-center space-x-2 rounded-full bg-gradient-to-r from-blue-600 to-blue-400 p-2 text-white">
                        <Check className="h-4 w-4" />
                      </div>
                      <div className="text-center space-y-0.5">
                        <div className="text-sm font-semibold">Professional Blue</div>
                        <div className="w-full h-1.5 bg-gradient-to-r from-[#0F056B] to-[#1E90FF] rounded-full"></div>
                      </div>
                    </Label>
                  </div>
                  
                  <div>
                    <RadioGroupItem 
                      value="purple" 
                      id="purple" 
                      className="peer sr-only" 
                    />
                    <Label 
                      htmlFor="purple" 
                      className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-gradient-to-br from-purple-100 to-pink-50 p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-purple-500 [&:has([data-state=checked])]:border-purple-500"
                    >
                      <div className="mb-2 flex items-center justify-center space-x-2 rounded-full bg-gradient-to-r from-purple-600 to-pink-400 p-2 text-white">
                        <Check className="h-4 w-4" />
                      </div>
                      <div className="text-center space-y-0.5">
                        <div className="text-sm font-semibold">Vibrant Purple & Pink</div>
                        <div className="w-full h-1.5 bg-gradient-to-r from-[#800080] to-[#FF69B4] rounded-full"></div>
                      </div>
                    </Label>
                  </div>
                  
                  <div>
                    <RadioGroupItem 
                      value="green" 
                      id="green" 
                      className="peer sr-only" 
                    />
                    <Label 
                      htmlFor="green" 
                      className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-gradient-to-br from-green-100 to-green-50 p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-green-500 [&:has([data-state=checked])]:border-green-500"
                    >
                      <div className="mb-2 flex items-center justify-center space-x-2 rounded-full bg-gradient-to-r from-green-600 to-green-400 p-2 text-white">
                        <Check className="h-4 w-4" />
                      </div>
                      <div className="text-center space-y-0.5">
                        <div className="text-sm font-semibold">Fresh Green & White</div>
                        <div className="w-full h-1.5 bg-gradient-to-r from-[#32CD32] to-white rounded-full"></div>
                      </div>
                    </Label>
                  </div>
                  
                  <div>
                    <RadioGroupItem 
                      value="dark" 
                      id="dark" 
                      className="peer sr-only" 
                    />
                    <Label 
                      htmlFor="dark" 
                      className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-gradient-to-br from-gray-700 to-gray-900 p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-gray-500 [&:has([data-state=checked])]:border-gray-500 text-white"
                    >
                      <div className="mb-2 flex items-center justify-center space-x-2 rounded-full bg-gradient-to-r from-gray-800 to-gray-600 p-2 text-white">
                        <Check className="h-4 w-4" />
                      </div>
                      <div className="text-center space-y-0.5">
                        <div className="text-sm font-semibold">Dark Mode</div>
                        <div className="w-full h-1.5 bg-gradient-to-r from-black to-gray-700 rounded-full"></div>
                      </div>
                    </Label>
                  </div>
                </RadioGroup>
                
                <p className="text-xs text-muted-foreground mt-1">
                  Choose a theme that suits your teaching style and preferences
                </p>
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
                  To change your email address, please contact an administrator
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
