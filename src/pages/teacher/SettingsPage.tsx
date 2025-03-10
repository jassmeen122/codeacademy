
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Bell, Moon, Sun, Lock, Mail, User, Palette } from "lucide-react";
import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

export default function TeacherSettingsPage() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [settings, setSettings] = useState({
    emailNotifications: true,
    assignmentNotifications: true,
    discussionNotifications: true,
    twoFactorAuth: false,
    colorTheme: "blue"
  });

  useEffect(() => {
    setMounted(true);
  }, []);

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
    toast.success(`Theme preference saved! (Display implementation coming soon)`);
  };

  if (!mounted) return null;

  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Teacher Settings</h1>

        <div className="space-y-6">
          {/* Profile Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Profile Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Full Name</Label>
                <Input type="text" placeholder="Your full name" />
              </div>
              <div className="space-y-2">
                <Label>Bio</Label>
                <Input type="text" placeholder="Brief description about yourself" />
              </div>
              <div className="space-y-2">
                <Label>Specialization</Label>
                <Input type="text" placeholder="e.g. Computer Science, Mathematics" />
              </div>
              <div className="pt-2">
                <Button>
                  <User className="mr-2 h-4 w-4" />
                  Update Profile
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
              <div className="space-y-2 pt-2">
                <Label>Color Theme</Label>
                <Select value={settings.colorTheme} onValueChange={handleThemeChange}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select theme" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="blue">Blue (Professional)</SelectItem>
                    <SelectItem value="purple">Purple & Pink (Modern)</SelectItem>
                    <SelectItem value="green">Green & White (Fresh)</SelectItem>
                    <SelectItem value="dark">Dark Mode (Low Light)</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground mt-1">
                  Choose a theme that suits your teaching style
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
                  <Input type="email" placeholder="your@email.com" />
                  <Button>
                    <Mail className="mr-2 h-4 w-4" />
                    Update
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
