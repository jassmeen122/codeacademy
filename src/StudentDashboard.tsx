import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { GraduationCap, Code, FileCode, Users, Target, Zap, Book, Home, BarChart2, Settings, MessageSquare, Award, Trophy, Star } from "lucide-react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { useAuthState } from "@/hooks/useAuthState";
import { CourseTabs } from "@/components/dashboard/CourseTabs";
import { useCourses } from "@/hooks/useCourses";
import { useGamificationInitializer } from '@/hooks/useGamificationInitializer';
import { useChallenges, useUserBadges } from '@/hooks/useGamification';
import { Badge } from '@/components/ui/badge';

export default function StudentDashboard() {
  const navigate = useNavigate();
  const { user } = useAuthState();
  const { courses, loading } = useCourses();
  
  // Initialize gamification system
  useGamificationInitializer();
  
  // Get challenges and badges
  const { challenges, userChallenges, loading: challengesLoading } = useChallenges();
  const { badges, loading: badgesLoading } = useUserBadges();
  
  const handleBrowseCourses = () => {
    navigate("/student/courses");
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <DashboardLayout>
      <div className="container px-4 py-6 mx-auto">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Welcome back, {user.full_name}!</h1>
              <p className="text-muted-foreground">Here's what's happening in your learning journey today.</p>
            </div>
            <Button onClick={handleBrowseCourses}>
              <GraduationCap className="mr-2 h-4 w-4" />
              Browse Courses
            </Button>
          </div>
        </div>
      </div>
      
      <div className="container px-4 py-6 mx-auto">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <CourseTabs courses={courses} loading={loading} />
            
            {/* Daily Challenges Section */}
            <Card className="mb-6">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-lg font-medium">
                  <div className="flex items-center">
                    <Trophy className="mr-2 h-5 w-5 text-yellow-500" />
                    Daily Challenges
                  </div>
                </CardTitle>
                <Button variant="outline" size="sm" onClick={() => navigate('/student/challenges')}>View All</Button>
              </CardHeader>
              <CardContent>
                {challengesLoading ? (
                  <div className="text-center py-4">
                    <p>Loading challenges...</p>
                  </div>
                ) : challenges.filter(c => c.type === 'daily').length > 0 ? (
                  <div className="space-y-4">
                    {challenges.filter(c => c.type === 'daily').slice(0, 2).map(challenge => {
                      const userChallenge = userChallenges.find(uc => uc.challenge_id === challenge.id);
                      const isCompleted = userChallenge?.completed || false;
                      
                      return (
                        <div key={challenge.id} className="flex items-center justify-between border-b pb-3">
                          <div>
                            <div className="flex items-center gap-2">
                              {isCompleted ? (
                                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                                  Completed
                                </Badge>
                              ) : (
                                <Badge>Daily</Badge>
                              )}
                              <span className="text-yellow-500 text-sm font-medium flex items-center">
                                <Star className="h-3 w-3 mr-1 fill-yellow-500" /> {challenge.points} pts
                              </span>
                            </div>
                            <p className="text-sm font-medium mt-1">{challenge.title}</p>
                          </div>
                          <Button 
                            size="sm" 
                            variant={isCompleted ? "outline" : "default"}
                            disabled={isCompleted}
                            onClick={() => navigate('/student/challenges')}
                          >
                            {isCompleted ? 'Completed' : 'Start'}
                          </Button>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-4 text-muted-foreground">
                    <p>No challenges available today.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
          
          <div className="space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-lg font-medium">
                  <Home className="mr-2 h-4 w-4" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Button variant="secondary" onClick={() => navigate('/student/courses')}>
                    <Book className="mr-2 h-4 w-4" />
                    Continue Learning
                  </Button>
                  <Button variant="secondary" onClick={() => navigate('/student/exercises')}>
                    <FileCode className="mr-2 h-4 w-4" />
                    Practice Exercises
                  </Button>
                  <Button variant="secondary" onClick={() => navigate('/student/discussion')}>
                    <MessageSquare className="mr-2 h-4 w-4" />
                    Join Discussions
                  </Button>
                  <Button variant="secondary" onClick={() => navigate('/student/ai-assistant')}>
                    <GraduationCap className="mr-2 h-4 w-4" />
                    Get AI Help
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            {/* Achievements Section */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-lg font-medium">
                  <div className="flex items-center">
                    <Award className="mr-2 h-5 w-5 text-indigo-500" />
                    Your Badges
                  </div>
                </CardTitle>
                <Button variant="outline" size="sm" onClick={() => navigate('/student/achievements')}>
                  View All
                </Button>
              </CardHeader>
              <CardContent>
                {badgesLoading ? (
                  <div className="text-center py-4">
                    <p>Loading badges...</p>
                  </div>
                ) : badges.length > 0 ? (
                  <div className="grid grid-cols-2 gap-2">
                    {badges.slice(0, 4).map((userBadge) => (
                      <div 
                        key={userBadge.id} 
                        className="flex flex-col items-center justify-center p-2 bg-muted rounded-lg"
                      >
                        <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground mb-1">
                          {userBadge.badge.icon === 'award' && <Award className="h-5 w-5" />}
                          {userBadge.badge.icon === 'code' && <Code className="h-5 w-5" />}
                          {userBadge.badge.icon === 'zap' && <Zap className="h-5 w-5" />}
                          {userBadge.badge.icon === 'trophy' && <Trophy className="h-5 w-5" />}
                          {userBadge.badge.icon === 'users' && <Users className="h-5 w-5" />}
                          {userBadge.badge.icon === 'target' && <Target className="h-5 w-5" />}
                        </div>
                        <span className="text-xs font-medium text-center mt-1">
                          {userBadge.badge.name}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4 text-muted-foreground">
                    <p>Complete courses and challenges to earn badges!</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
