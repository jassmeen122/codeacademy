
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, LineChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { Award, Clock, Code, ListChecks, Target, TrendingUp } from "lucide-react";
import { LanguagePerformance, ProgressTimelinePoint, UserRecommendation } from "@/types/progress";

interface ProgressOverviewProps {
  courseCompletions: number;
  exercisesCompleted: number;
  totalTimeSpent: number;
  timelineData: ProgressTimelinePoint[];
  languagePerformance: LanguagePerformance[];
  recommendations: UserRecommendation[];
  onViewRecommendation: (id: string) => void;
}

export const ProgressOverview: React.FC<ProgressOverviewProps> = ({
  courseCompletions,
  exercisesCompleted,
  totalTimeSpent,
  timelineData,
  languagePerformance,
  recommendations,
  onViewRecommendation
}) => {
  // Format time spent into hours and minutes
  const formatTimeSpent = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Courses Completed
            </CardTitle>
            <Award className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{courseCompletions}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Exercises Completed
            </CardTitle>
            <Code className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{exercisesCompleted}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Total Time Spent
            </CardTitle>
            <Clock className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatTimeSpent(totalTimeSpent)}</div>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="progress">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="progress">Progress Timeline</TabsTrigger>
          <TabsTrigger value="languages">Language Performance</TabsTrigger>
          <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
        </TabsList>
        
        <TabsContent value="progress">
          <Card>
            <CardHeader>
              <CardTitle>Your Progress Over Time</CardTitle>
            </CardHeader>
            <CardContent>
              {timelineData.length > 0 ? (
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={timelineData}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis yAxisId="left" />
                      <YAxis yAxisId="right" orientation="right" />
                      <Tooltip />
                      <Legend />
                      <Line
                        yAxisId="left"
                        type="monotone"
                        dataKey="success_rate"
                        name="Success Rate (%)"
                        stroke="#8884d8"
                        activeDot={{ r: 8 }}
                      />
                      <Line
                        yAxisId="right"
                        type="monotone"
                        dataKey="exercises_completed"
                        name="Exercises Completed"
                        stroke="#82ca9d"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <TrendingUp className="h-12 w-12 mx-auto mb-2 opacity-20" />
                  <p>Complete exercises to see your progress timeline</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="languages">
          <Card>
            <CardHeader>
              <CardTitle>Language Performance</CardTitle>
            </CardHeader>
            <CardContent>
              {languagePerformance.length > 0 ? (
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={languagePerformance}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="language" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="success_rate" name="Success Rate (%)" fill="#8884d8" />
                      <Bar dataKey="exercises_completed" name="Exercises Completed" fill="#82ca9d" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Code className="h-12 w-12 mx-auto mb-2 opacity-20" />
                  <p>Practice different languages to see your performance</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="recommendations">
          <Card>
            <CardHeader>
              <CardTitle>Personalized Recommendations</CardTitle>
            </CardHeader>
            <CardContent>
              {recommendations.length > 0 ? (
                <div className="space-y-4">
                  {recommendations.map(rec => (
                    <div key={rec.id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-medium text-sm">
                            {rec.metadata?.title || `Recommended ${rec.recommendation_type}`}
                          </h3>
                          <p className="text-muted-foreground text-xs mt-1">
                            {rec.metadata?.description || 'Based on your recent activities'}
                          </p>
                        </div>
                        <div className="bg-primary/10 text-primary text-xs px-2 py-1 rounded-md">
                          {rec.recommendation_type}
                        </div>
                      </div>
                      <div className="mt-3 flex items-center justify-between">
                        <div className="flex items-center text-xs text-muted-foreground">
                          <Target className="h-3 w-3 mr-1" />
                          <span>Relevance: {Math.round(rec.relevance_score * 100)}%</span>
                        </div>
                        <button
                          onClick={() => onViewRecommendation(rec.id)}
                          className="text-xs text-primary hover:underline"
                        >
                          View details
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <ListChecks className="h-12 w-12 mx-auto mb-2 opacity-20" />
                  <p>Complete more activities to get personalized recommendations</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
