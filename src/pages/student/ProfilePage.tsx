
import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { UserRound, Mail, BookOpen, Trophy, Target, Award, Zap, Users, Code } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  points: number;
}

interface UserBadge {
  badge: Badge;
  earned_at: string;
}

const ProfilePage = () => {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
  });
  const [badges, setBadges] = useState<UserBadge[]>([]);
  const [progress, setProgress] = useState({
    coursesCompleted: 0,
    totalPoints: 0,
    rank: 0,
    completionRate: 0,
  });

  useEffect(() => {
    fetchProfile();
    fetchBadges();
    fetchProgress();
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

  const fetchBadges = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('user_badges')
        .select(`
          earned_at,
          badge:badges (*)
        `)
        .eq('user_id', user.id);

      if (error) throw error;
      setBadges(data || []);
    } catch (error: any) {
      console.error('Error fetching badges:', error);
    }
  };

  const fetchProgress = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Fetch completed courses
      const { data: coursesProgress, error: coursesError } = await supabase
        .from('student_progress')
        .select('*')
        .eq('student_id', user.id)
        .gte('completion_percentage', 100);

      if (coursesError) throw coursesError;

      // Fetch user's rank
      const { data: profiles, error: rankError } = await supabase
        .from('profiles')
        .select('id')
        .gt('points', profile?.points || 0);

      if (rankError) throw rankError;

      // Calculate overall completion rate
      const { data: allProgress, error: progressError } = await supabase
        .from('student_progress')
        .select('completion_percentage')
        .eq('student_id', user.id);

      if (progressError) throw progressError;

      const completionRate = allProgress?.length 
        ? allProgress.reduce((acc, curr) => acc + (curr.completion_percentage || 0), 0) / allProgress.length 
        : 0;

      setProgress({
        coursesCompleted: coursesProgress?.length || 0,
        totalPoints: profile?.points || 0,
        rank: (profiles?.length || 0) + 1,
        completionRate,
      });
    } catch (error: any) {
      console.error('Error fetching progress:', error);
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

  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case 'award': return Award;
      case 'zap': return Zap;
      case 'code': return Code;
      case 'users': return Users;
      case 'target': return Target;
      default: return Trophy;
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

          {/* Progress Overview */}
          <Card>
            <CardHeader>
              <CardTitle>Learning Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Overall Progress</span>
                    <span>{Math.round(progress.completionRate)}%</span>
                  </div>
                  <Progress value={progress.completionRate} className="h-2" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <p className="text-2xl font-bold">{progress.coursesCompleted}</p>
                    <p className="text-sm text-muted-foreground">Courses Completed</p>
                  </div>
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <p className="text-2xl font-bold">#{progress.rank}</p>
                    <p className="text-sm text-muted-foreground">Ranking</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Achievements */}
          <Card className="md:col-span-3">
            <CardHeader>
              <CardTitle>Achievements & Badges</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {badges.map((userBadge) => {
                  const IconComponent = getIconComponent(userBadge.badge.icon);
                  return (
                    <Card key={userBadge.badge.id}>
                      <CardContent className="pt-6">
                        <div className="flex items-center gap-4">
                          <div className="p-2 rounded-full bg-primary text-primary-foreground">
                            <IconComponent className="h-6 w-6" />
                          </div>
                          <div>
                            <h3 className="font-medium">{userBadge.badge.name}</h3>
                            <p className="text-sm text-muted-foreground">
                              {userBadge.badge.description}
                            </p>
                            <div className="mt-2">
                              <Badge variant="secondary">
                                {userBadge.badge.points} points
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
              {badges.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  No badges earned yet. Complete courses and challenges to earn badges!
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ProfilePage;
