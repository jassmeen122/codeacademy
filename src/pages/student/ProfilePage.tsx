
import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { UserRound, Mail, BookOpen, Trophy } from "lucide-react";

const ProfilePage = () => {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No user found");

      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) throw error;

      setProfile(profile);
      setFormData({
        fullName: profile.full_name || "",
        email: profile.email || "",
      });
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No user found");

      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: formData.fullName,
        })
        .eq('id', user.id);

      if (error) throw error;

      toast.success("Profile updated successfully");
      setEditing(false);
      fetchProfile();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="container mx-auto px-4 py-8">
          Loading...
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Profile Info */}
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-start gap-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={profile?.avatar_url} />
                  <AvatarFallback>
                    <UserRound className="h-10 w-10" />
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-4">
                  {editing ? (
                    <>
                      <div>
                        <label className="text-sm font-medium">Full Name</label>
                        <Input
                          value={formData.fullName}
                          onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                          className="mt-1"
                        />
                      </div>
                      <div className="flex gap-2">
                        <Button onClick={handleUpdateProfile}>Save Changes</Button>
                        <Button variant="outline" onClick={() => setEditing(false)}>Cancel</Button>
                      </div>
                    </>
                  ) : (
                    <>
                      <div>
                        <div className="flex items-center gap-2 text-lg font-medium">
                          <UserRound className="h-4 w-4" />
                          {profile?.full_name}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Mail className="h-4 w-4" />
                          {profile?.email}
                        </div>
                      </div>
                      <Button onClick={() => setEditing(true)}>Edit Profile</Button>
                    </>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Stats Card */}
          <Card>
            <CardHeader>
              <CardTitle>Learning Stats</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-4 w-4 text-primary" />
                    <span>Courses Enrolled</span>
                  </div>
                  <span className="font-medium">3</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Trophy className="h-4 w-4 text-primary" />
                    <span>Achievements</span>
                  </div>
                  <span className="font-medium">5</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ProfilePage;
