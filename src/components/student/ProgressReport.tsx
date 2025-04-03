
import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  FileDown, 
  FileText, 
  Mail, 
  Calendar, 
  Book, 
  Code, 
  ArrowUpRight,
  Clock,
  CheckCircle2,
  XCircle
} from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface ProgressReportProps {
  userId: string;
  userName: string;
  period: 'weekly' | 'monthly' | 'all-time';
}

export const ProgressReport: React.FC<ProgressReportProps> = ({
  userId,
  userName,
  period
}) => {
  const [loading, setLoading] = useState(false);
  const [exportFormat, setExportFormat] = useState<'pdf'|'csv'>('pdf');

  // This would normally be fetched from the API
  const reportData = {
    overallScore: 85,
    topicsBreakdown: [
      { topic: 'JavaScript Fundamentals', proficiency: 92, exercises: 24 },
      { topic: 'React Components', proficiency: 85, exercises: 18 },
      { topic: 'SQL Queries', proficiency: 78, exercises: 12 },
      { topic: 'Python Basics', proficiency: 90, exercises: 15 },
      { topic: 'Data Structures', proficiency: 72, exercises: 10 },
    ],
    timeSpent: {
      javascript: 35, // in hours
      python: 20,
      sql: 15,
      react: 25,
      other: 5
    },
    achievements: [
      { name: 'Completed 100 Exercises', completed: true, date: '2025-03-01' },
      { name: 'Full JavaScript Course', completed: true, date: '2025-02-15' },
      { name: 'Python Challenge Champion', completed: false, percentage: 75 }
    ],
    recommendations: [
      'Practice more advanced SQL joins and subqueries',
      'Complete the React Hooks course to strengthen component skills',
      'Revisit data structures fundamentals for better algorithm performance'
    ]
  };

  const generateReport = () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      if (exportFormat === 'pdf') {
        // In a real app, this would generate and download a PDF
        alert('PDF report download would start');
      } else {
        // In a real app, this would generate and download a CSV
        alert('CSV report download would start');
      }
    }, 2000);
  };

  const sendReportByEmail = () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      alert('Progress report would be sent by email');
    }, 2000);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              Progress Report
            </CardTitle>
            <CardDescription>
              {period === 'weekly' ? 'Weekly' : period === 'monthly' ? 'Monthly' : 'All-time'} learning summary
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setExportFormat('pdf')}
              className={exportFormat === 'pdf' ? 'bg-primary text-primary-foreground' : ''}
            >
              PDF
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setExportFormat('csv')}
              className={exportFormat === 'csv' ? 'bg-primary text-primary-foreground' : ''}
            >
              CSV
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Overall score */}
        <div className="flex flex-col items-center justify-center p-6 bg-gray-50 rounded-lg">
          <h3 className="text-lg font-medium mb-2">Overall Performance Score</h3>
          <div className="relative w-32 h-32">
            <svg className="w-full h-full" viewBox="0 0 100 100">
              <circle
                className="text-gray-200"
                strokeWidth="10"
                stroke="currentColor"
                fill="transparent"
                r="40"
                cx="50"
                cy="50"
              />
              <circle
                className="text-primary"
                strokeWidth="10"
                strokeDasharray={2 * Math.PI * 40}
                strokeDashoffset={2 * Math.PI * 40 * (1 - reportData.overallScore / 100)}
                strokeLinecap="round"
                stroke="currentColor"
                fill="transparent"
                r="40"
                cx="50"
                cy="50"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-3xl font-bold">{reportData.overallScore}%</span>
            </div>
          </div>
        </div>

        {/* Topic Mastery Breakdown */}
        <div>
          <h3 className="text-lg font-medium mb-4">Topic Mastery Breakdown</h3>
          <div className="space-y-4">
            {reportData.topicsBreakdown.map((topic, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>{topic.topic}</span>
                  <span className="font-medium">{topic.proficiency}%</span>
                </div>
                <Progress value={topic.proficiency} className="h-2" />
                <p className="text-xs text-muted-foreground text-right">
                  {topic.exercises} exercises completed
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Time Spent Per Language */}
        <div>
          <h3 className="text-lg font-medium mb-4">Time Spent Per Language</h3>
          <div className="grid grid-cols-2 gap-4">
            {Object.entries(reportData.timeSpent).map(([language, hours], index) => (
              <div key={index} className="flex items-center p-3 border rounded-md">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                  <Clock className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="capitalize font-medium">{language}</p>
                  <p className="text-sm text-muted-foreground">{hours} hours</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Achievements & Milestones */}
        <div>
          <h3 className="text-lg font-medium mb-4">Achievements & Milestones</h3>
          <div className="space-y-3">
            {reportData.achievements.map((achievement, index) => (
              <div key={index} className="flex items-center p-3 border rounded-md">
                {achievement.completed ? (
                  <CheckCircle2 className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                ) : (
                  <XCircle className="h-5 w-5 text-gray-400 mr-3 flex-shrink-0" />
                )}
                <div className="flex-1">
                  <p className="font-medium">{achievement.name}</p>
                  {achievement.completed ? (
                    <p className="text-xs flex items-center gap-1 text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      Completed on {achievement.date}
                    </p>
                  ) : (
                    <div className="mt-1">
                      <div className="flex justify-between text-xs mb-1">
                        <span>Progress</span>
                        <span>{achievement.percentage}%</span>
                      </div>
                      <Progress value={achievement.percentage} className="h-1.5" />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recommendations */}
        <div>
          <h3 className="text-lg font-medium mb-4">Recommendations for Next Steps</h3>
          <ul className="space-y-2 list-disc pl-5">
            {reportData.recommendations.map((recommendation, index) => (
              <li key={index} className="text-sm">
                {recommendation}
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button 
          variant="outline" 
          onClick={sendReportByEmail}
          disabled={loading}
        >
          <Mail className="h-4 w-4 mr-2" />
          Send by Email
        </Button>
        <Button 
          onClick={generateReport}
          disabled={loading}
        >
          {loading ? (
            <div className="h-4 w-4 mr-2 rounded-full border-2 border-t-transparent border-white animate-spin"></div>
          ) : (
            <FileDown className="h-4 w-4 mr-2" />
          )}
          Generate Report
        </Button>
      </CardFooter>
    </Card>
  );
};
