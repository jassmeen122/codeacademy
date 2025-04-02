
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { BookOpen, Code, Clock } from "lucide-react";

const RecommendationsTab = () => {
  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Personalized Recommendations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="p-4 border rounded-lg bg-muted/50">
              <h3 className="text-lg font-medium mb-2">Recommended Next Courses</h3>
              <p className="text-sm mb-4">Based on your skills progress and interests, we recommend:</p>
              <ul className="space-y-2">
                <li className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-primary" />
                  <span>Advanced JavaScript Patterns</span>
                </li>
                <li className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-primary" />
                  <span>React State Management Deep Dive</span>
                </li>
                <li className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-primary" />
                  <span>TypeScript for React Developers</span>
                </li>
              </ul>
            </div>

            <div className="p-4 border rounded-lg bg-muted/50">
              <h3 className="text-lg font-medium mb-2">Suggested Practice Exercises</h3>
              <p className="text-sm mb-4">To strengthen your skills:</p>
              <ul className="space-y-2">
                <li className="flex items-center gap-2">
                  <Code className="h-4 w-4 text-primary" />
                  <span>Build a TypeScript API client</span>
                </li>
                <li className="flex items-center gap-2">
                  <Code className="h-4 w-4 text-primary" />
                  <span>Create a custom React Hook</span>
                </li>
                <li className="flex items-center gap-2">
                  <Code className="h-4 w-4 text-primary" />
                  <span>Implement a state management solution</span>
                </li>
              </ul>
            </div>

            <div className="p-4 border rounded-lg bg-muted/50">
              <h3 className="text-lg font-medium mb-2">Study Plan Optimization</h3>
              <p className="text-sm mb-4">To improve your learning efficiency:</p>
              <ul className="space-y-2">
                <li className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-primary" />
                  <span>Dedicate more time to JavaScript fundamentals</span>
                </li>
                <li className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-primary" />
                  <span>Practice TypeScript exercises more regularly</span>
                </li>
                <li className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-primary" />
                  <span>Join study groups for Node.js to accelerate learning</span>
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Learning Path Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div>
              <h3 className="font-medium mb-2">Frontend Developer Path - 65% Complete</h3>
              <Progress value={65} className="h-2 mb-4" />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-3 bg-green-100/50 text-green-800 rounded-md">
                  <h4 className="font-medium mb-1">Completed</h4>
                  <ul className="text-sm space-y-1">
                    <li>HTML & CSS Fundamentals</li>
                    <li>JavaScript Basics</li>
                    <li>DOM Manipulation</li>
                  </ul>
                </div>
                <div className="p-3 bg-blue-100/50 text-blue-800 rounded-md">
                  <h4 className="font-medium mb-1">In Progress</h4>
                  <ul className="text-sm space-y-1">
                    <li>React Fundamentals</li>
                    <li>TypeScript Introduction</li>
                  </ul>
                </div>
                <div className="p-3 bg-gray-100/50 text-gray-800 rounded-md">
                  <h4 className="font-medium mb-1">Upcoming</h4>
                  <ul className="text-sm space-y-1">
                    <li>Advanced React Patterns</li>
                    <li>Performance Optimization</li>
                    <li>Testing React Applications</li>
                  </ul>
                </div>
              </div>
            </div>
            
            <div className="pt-4 border-t">
              <p className="text-sm text-muted-foreground">
                You're making great progress! Focus on completing your TypeScript exercises to get back on track with your learning goals. At your current pace, you'll complete this learning path in approximately 2 months.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RecommendationsTab;
