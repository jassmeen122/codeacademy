
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { BookOpen, Code, Clock, ChevronRight, ThumbsUp, Award, Lightbulb } from "lucide-react";
import { UserRecommendation, UserProgressReport } from "@/hooks/useUserPerformance";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface RecommendationsTabProps {
  loading: boolean;
  recommendations: UserRecommendation[];
  progressReport: UserProgressReport | null;
  onRecommendationAction: (id: string, action: string) => void;
}

const RecommendationsTab = ({ 
  loading, 
  recommendations, 
  progressReport,
  onRecommendationAction
}: RecommendationsTabProps) => {
  
  // Group recommendations by type
  const groupedRecommendations = React.useMemo(() => {
    const groups = {
      course: [] as UserRecommendation[],
      practice: [] as UserRecommendation[],
      study: [] as UserRecommendation[],
    };
    
    recommendations.forEach(rec => {
      if (rec.recommendation_type === 'course' || rec.recommendation_type === 'theme') {
        groups.course.push(rec);
      } else if (rec.recommendation_type === 'feature' || rec.recommendation_type === 'exercise') {
        groups.practice.push(rec);
      } else {
        groups.study.push(rec);
      }
    });
    
    return groups;
  }, [recommendations]);
  
  // Mock course recommendations (to be replaced with real data)
  const courseRecommendations = [
    "Advanced JavaScript Patterns",
    "React State Management Deep Dive",
    "TypeScript for React Developers"
  ];
  
  // Mock practice recommendations (to be replaced with real data)
  const practiceRecommendations = [
    "Build a TypeScript API client",
    "Create a custom React Hook",
    "Implement a state management solution"
  ];
  
  // Mock study plan (to be replaced with real data)
  const studyPlanRecommendations = [
    "Dedicate more time to JavaScript fundamentals",
    "Practice TypeScript exercises more regularly",
    "Join study groups for Node.js to accelerate learning"
  ];

  if (loading) {
    return (
      <div className="space-y-8">
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-1/3" />
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="p-4 border rounded-lg">
                  <Skeleton className="h-5 w-1/3 mb-2" />
                  <Skeleton className="h-4 w-3/4 mb-4" />
                  <div className="space-y-2">
                    {[1, 2, 3].map((j) => (
                      <div key={j} className="flex items-center gap-2">
                        <Skeleton className="h-4 w-4 rounded-full" />
                        <Skeleton className="h-4 w-full" />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-1/3" />
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <Skeleton className="h-5 w-2/3 mb-2" />
                <Skeleton className="h-2 w-full mb-4" />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="p-3 rounded-md">
                      <Skeleton className="h-4 w-1/2 mb-1" />
                      <div className="space-y-1">
                        {[1, 2, 3].map((j) => (
                          <Skeleton key={j} className="h-3 w-full" />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="pt-4 border-t">
                <Skeleton className="h-4 w-full" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-yellow-500" />
            Personalized Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="p-4 border rounded-lg bg-muted/50">
              <h3 className="text-lg font-medium mb-2 flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-primary" />
                Recommended Next Courses
                {groupedRecommendations.course.length > 0 && (
                  <Badge variant="outline" className="ml-2">
                    {groupedRecommendations.course.length} new
                  </Badge>
                )}
              </h3>
              <p className="text-sm mb-4">Based on your skills progress and interests, we recommend:</p>
              <ul className="space-y-2">
                {/* Show real recommendations if available, otherwise fall back to mock data */}
                {groupedRecommendations.course.length > 0 ? (
                  groupedRecommendations.course.map((rec) => (
                    <li key={rec.id} className="flex items-center justify-between gap-2 p-2 hover:bg-muted rounded-md">
                      <div className="flex items-center gap-2">
                        <BookOpen className="h-4 w-4 text-primary" />
                        <span>{rec.recommendation_type === 'theme' ? 'Theme: ' : ''}{rec.id}</span>
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => onRecommendationAction(rec.id, 'view')}
                        >
                          View
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => onRecommendationAction(rec.id, 'save')}
                        >
                          Save
                        </Button>
                      </div>
                    </li>
                  ))
                ) : (
                  courseRecommendations.map((course, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <BookOpen className="h-4 w-4 text-primary" />
                      <span>{course}</span>
                    </li>
                  ))
                )}
              </ul>
            </div>

            <div className="p-4 border rounded-lg bg-muted/50">
              <h3 className="text-lg font-medium mb-2 flex items-center gap-2">
                <Code className="h-4 w-4 text-primary" />
                Suggested Practice Exercises
                {groupedRecommendations.practice.length > 0 && (
                  <Badge variant="outline" className="ml-2">
                    {groupedRecommendations.practice.length} new
                  </Badge>
                )}
              </h3>
              <p className="text-sm mb-4">To strengthen your skills:</p>
              <ul className="space-y-2">
                {/* Show real recommendations if available, otherwise fall back to mock data */}
                {groupedRecommendations.practice.length > 0 ? (
                  groupedRecommendations.practice.map((rec) => (
                    <li key={rec.id} className="flex items-center justify-between gap-2 p-2 hover:bg-muted rounded-md">
                      <div className="flex items-center gap-2">
                        <Code className="h-4 w-4 text-primary" />
                        <span>{rec.recommendation_type === 'feature' ? 'Try: ' : ''}{rec.id}</span>
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => onRecommendationAction(rec.id, 'view')}
                        >
                          View
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => onRecommendationAction(rec.id, 'try')}
                        >
                          Try Now
                        </Button>
                      </div>
                    </li>
                  ))
                ) : (
                  practiceRecommendations.map((practice, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <Code className="h-4 w-4 text-primary" />
                      <span>{practice}</span>
                    </li>
                  ))
                )}
              </ul>
            </div>

            <div className="p-4 border rounded-lg bg-muted/50">
              <h3 className="text-lg font-medium mb-2 flex items-center gap-2">
                <Clock className="h-4 w-4 text-primary" />
                Study Plan Optimization
                {groupedRecommendations.study.length > 0 && (
                  <Badge variant="outline" className="ml-2">
                    {groupedRecommendations.study.length} new
                  </Badge>
                )}
              </h3>
              <p className="text-sm mb-4">To improve your learning efficiency:</p>
              <ul className="space-y-2">
                {/* Show real recommendations if available, otherwise fall back to mock data */}
                {groupedRecommendations.study.length > 0 ? (
                  groupedRecommendations.study.map((rec) => (
                    <li key={rec.id} className="flex items-center justify-between gap-2 p-2 hover:bg-muted rounded-md">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-primary" />
                        <span>{rec.id}</span>
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => onRecommendationAction(rec.id, 'implement')}
                        >
                          Add to My Plan
                        </Button>
                      </div>
                    </li>
                  ))
                ) : (
                  studyPlanRecommendations.map((plan, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-primary" />
                      <span>{plan}</span>
                    </li>
                  ))
                )}
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5 text-primary" />
            Learning Path Progress
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div>
              <h3 className="font-medium mb-2">
                Frontend Developer Path - {progressReport?.completion_percentage || 65}% Complete
              </h3>
              <Progress 
                value={progressReport?.completion_percentage || 65} 
                className="h-2 mb-4" 
              />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-3 bg-green-100/50 text-green-800 rounded-md">
                  <h4 className="font-medium mb-1">Completed</h4>
                  <ul className="text-sm space-y-1">
                    {progressReport && progressReport.completed_steps.length > 0 ? (
                      progressReport.completed_steps.slice(0, 3).map((step, index) => (
                        <li key={index} className="flex items-center gap-1">
                          <ThumbsUp className="h-3 w-3" />
                          <span>{typeof step === 'string' ? step : JSON.stringify(step)}</span>
                        </li>
                      ))
                    ) : (
                      <>
                        <li>HTML & CSS Fundamentals</li>
                        <li>JavaScript Basics</li>
                        <li>DOM Manipulation</li>
                      </>
                    )}
                  </ul>
                </div>
                <div className="p-3 bg-blue-100/50 text-blue-800 rounded-md">
                  <h4 className="font-medium mb-1">In Progress</h4>
                  <ul className="text-sm space-y-1">
                    {progressReport && progressReport.in_progress_steps.length > 0 ? (
                      progressReport.in_progress_steps.slice(0, 3).map((step, index) => (
                        <li key={index}>{typeof step === 'string' ? step : JSON.stringify(step)}</li>
                      ))
                    ) : (
                      <>
                        <li>React Fundamentals</li>
                        <li>TypeScript Introduction</li>
                      </>
                    )}
                  </ul>
                </div>
                <div className="p-3 bg-gray-100/50 text-gray-800 rounded-md">
                  <h4 className="font-medium mb-1">Upcoming</h4>
                  <ul className="text-sm space-y-1">
                    {progressReport && progressReport.pending_steps.length > 0 ? (
                      progressReport.pending_steps.slice(0, 3).map((step, index) => (
                        <li key={index}>{typeof step === 'string' ? step : JSON.stringify(step)}</li>
                      ))
                    ) : (
                      <>
                        <li>Advanced React Patterns</li>
                        <li>Performance Optimization</li>
                        <li>Testing React Applications</li>
                      </>
                    )}
                  </ul>
                </div>
              </div>
            </div>
            
            <div className="pt-4 border-t">
              <p className="text-sm text-muted-foreground">
                You're making great progress! Focus on completing your TypeScript exercises to get back on track with your learning goals. 
                {progressReport?.estimated_completion_time ? (
                  ` At your current pace, you'll complete this learning path in approximately ${progressReport.estimated_completion_time} minutes.`
                ) : (
                  " At your current pace, you'll complete this learning path in approximately 2 months."
                )}
              </p>
            </div>
            
            <div className="flex justify-end">
              <Button variant="outline" className="flex items-center gap-1">
                View Full Learning Path
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RecommendationsTab;
