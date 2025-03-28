
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
import { GamificationStats } from "@/components/student/GamificationStats";
import { Skeleton } from "@/components/ui/skeleton";
import { ProfilePhotoUpload } from "@/components/ProfilePhotoUpload";
import { useAuthState } from "@/hooks/useAuthState";

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
  const { user: authUser } = useAuthState();
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
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log("Profile page loaded, auth user:", authUser);
    fetchProfile();
    fetchBadges();
    fetchProgress();
  }, [authUser]);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setError("No authenticated user found");
        toast.error("Authentication error: No user found");
        setLoading(false);
        return;
      }

      console.log("Auth user from supabase:", user.id);

      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (profileError) {
        console.error("Profile fetch error:", profileError);
        setError(`Failed to fetch profile: ${profileError.message}`);
        toast.error("Failed to fetch user profile");
        setLoading(false);
        return;
      }

      console.log("Profile data:", profile);
      setProfile(profile);
      setFormData({
        fullName: profile?.full_name || "",
        email: profile?.email || "",
      });
    } catch (error: any) {
      console.error("Unexpected error in fetchProfile:", error);
      setError(`Unexpected error: ${error.message}`);
      toast.error(error.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const fetchBadges = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      console.log("Fetching badges for user:", user.id);
      const { data, error } = await supabase
        .from('user_badges')
        .select(`
          earned_at,
          badge:badges (*)
        `)
        .eq('user_id', user.id);

      if (error) {
        console.error('Error fetching badges:', error);
        return;
      }
      
      console.log("Badges data:", data);
      setBadges(data || []);
    } catch (error: any) {
      console.error('Error in fetchBadges:', error);
    }
  };

  const fetchProgress = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      console.log("Fetching progress for user:", user.id);
      const { data: coursesProgress, error: coursesError } = await supabase
        .from('student_progress')
        .select('*')
        .eq('student_id', user.id)
        .gte('completion_percentage', 100);

      if (coursesError) {
        console.error("Error fetching courses progress:", coursesError);
        return;
      }

      console.log("Courses progress:", coursesProgress);

      // We need profile data for points calculation
      if (!profile) {
        console.log("No profile data yet, skipping rank calculation");
        return;
      }

      const { data: profiles, error: rankError } = await supabase
        .from('profiles')
        .select('id')
        .gt('points', profile?.points || 0);

      if (rankError) {
        console.error("Error fetching rank:", rankError);
        return;
      }

      const { data: allProgress, error: progressError } = await supabase
        .from('student_progress')
        .select('completion_percentage')
        .eq('student_id', user.id);

      if (progressError) {
        console.error("Error fetching all progress:", progressError);
        return;
      }

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
      console.error('Error in fetchProgress:', error);
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
      console.error("Error updating profile:", error);
      toast.error(error.message || "Failed to update profile");
    }
  };

  const handlePhotoChange = (url: string) => {
    if (profile) {
      setProfile({
        ...profile,
        avatar_url: url
      });
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

  if (error) {
    return (
      <DashboardLayout>
        <div className="container mx-auto px-4 py-8">
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            <p className="font-medium">Error loading profile</p>
            <p className="text-sm">{error}</p>
            <Button 
              onClick={fetchProfile} 
              variant="outline" 
              className="mt-3"
              size="sm"
            >
              Retry
            </Button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-2xl font-bold mb-6">Profile</h1>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-start gap-4">
                  <Skeleton className="h-20 w-20 rounded-full" />
                  <div className="flex-1 space-y-4">
                    <Skeleton className="h-8 w-48" />
                    <Skeleton className="h-4 w-full max-w-md" />
                    <Skeleton className="h-10 w-32" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Loading Statistics...</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-2 w-full" />
                <div className="grid grid-cols-2 gap-4">
                  <Skeleton className="h-20 w-full" />
                  <Skeleton className="h-20 w-full" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row items-start gap-6">
                <div className="w-full max-w-[200px] mx-auto md:mx-0">
                  <ProfilePhotoUpload 
                    user={authUser} 
                    onPhotoChange={handlePhotoChange}
                  />
                </div>
                <div className="flex-1 space-y-4 w-full">
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
                      <div>
                        <label className="text-sm font-medium">Email</label>
                        <Input
                          value={formData.email}
                          disabled
                          className="mt-1 bg-gray-50"
                        />
                        <p className="text-xs text-muted-foreground mt-1">Email cannot be changed</p>
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
                          {profile?.full_name || 'No Name Set'}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Mail className="h-4 w-4" />
                          {profile?.email || 'No Email Set'}
                        </div>
                      </div>
                      <Button onClick={() => setEditing(true)}>Edit Profile</Button>
                    </>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

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

          <div className="md:col-span-1">
            <GamificationStats />
          </div>

          <Card className="md:col-span-2">
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
