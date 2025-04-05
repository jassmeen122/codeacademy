
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, Mail, Share2, FileDown, Printer } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { UserMetric, UserSkill, ActivityLog } from '@/types/progress';
import { useAuthState } from '@/hooks/useAuthState';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { toast } from 'sonner';
import { format } from 'date-fns';

// Define PubSub interface used in jsPDF types
interface PubSub {
  [key: string]: any;
}

// Modified jsPDF type declaration to resolve conflicts
declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
    lastAutoTable: {
      finalY: number;
    };
    internal: {
      events: PubSub;
      scaleFactor: number;
      pageSize: {
        width: number;
        getWidth: () => number;
        height: number;
        getHeight: () => number;
      };
      pages: number[];
      getEncryptor(objectId: number): (data: string) => string;
      getNumberOfPages(): number;
    };
    setFontSize(size: number): jsPDF;
    setPage(pageNumber: number): jsPDF;
    text(text: string, x: number, y: number, options?: any): jsPDF;
    splitTextToSize(text: string, maxWidth: number, options?: any): string[];
    save(filename: string): jsPDF;
  }
}

interface ProgressReportProps {
  metrics: UserMetric | null;
  skills: UserSkill[];
  activityLogs: ActivityLog[];
  loading: boolean;
}

export const ProgressReport: React.FC<ProgressReportProps> = ({
  metrics,
  skills,
  activityLogs,
  loading
}) => {
  const { user } = useAuthState();
  const [generating, setGenerating] = useState(false);
  
  const generatePDF = async () => {
    if (!user) return;
    
    setGenerating(true);
    
    try {
      const doc = new jsPDF();
      
      doc.setFontSize(20);
      doc.text('Learning Progress Report', 20, 20);
      
      doc.setFontSize(12);
      doc.text(`Generated on: ${format(new Date(), 'PPP')}`, 20, 30);
      doc.text(`User: ${user.email}`, 20, 37);
      
      doc.setFontSize(16);
      doc.text('Learning Metrics', 20, 50);
      
      const metricsData = [
        ['Courses Completed', `${metrics?.course_completions || 0}`],
        ['Exercises Completed', `${metrics?.exercises_completed || 0}`],
        ['Total Learning Time', `${metrics?.total_time_spent || 0} minutes`],
      ];
      
      doc.autoTable({
        startY: 55,
        head: [['Metric', 'Value']],
        body: metricsData,
        theme: 'striped',
        headStyles: { fillColor: [79, 70, 229] }
      });
      
      doc.setFontSize(16);
      doc.text('Top Skills', 20, doc.lastAutoTable.finalY + 20);
      
      const topSkills = [...skills]
        .sort((a, b) => b.progress - a.progress)
        .slice(0, 5);
      
      const skillsData = topSkills.map(skill => [
        skill.skill_name,
        `${skill.progress}%`
      ]);
      
      if (skillsData.length === 0) {
        skillsData.push(['No skills data available yet', '']);
      }
      
      doc.autoTable({
        startY: doc.lastAutoTable.finalY + 25,
        head: [['Skill', 'Progress']],
        body: skillsData,
        theme: 'striped',
        headStyles: { fillColor: [79, 70, 229] }
      });
      
      doc.setFontSize(16);
      doc.text('Recent Activity', 20, doc.lastAutoTable.finalY + 20);
      
      const recentActivity = [...activityLogs]
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 5);
      
      const activityData = recentActivity.map(activity => [
        format(new Date(activity.date), 'PP'),
        activity.type,
        activity.count.toString()
      ]);
      
      if (activityData.length === 0) {
        activityData.push(['No recent activity', '', '']);
      }
      
      doc.autoTable({
        startY: doc.lastAutoTable.finalY + 25,
        head: [['Date', 'Type', 'Count']],
        body: activityData,
        theme: 'striped',
        headStyles: { fillColor: [79, 70, 229] }
      });
      
      doc.setFontSize(16);
      doc.text('Personalized Feedback', 20, doc.lastAutoTable.finalY + 20);
      
      let feedback = 'Keep up the good work!';
      
      if (metrics?.exercises_completed && metrics.exercises_completed > 10) {
        feedback = 'You are making excellent progress! Continue practicing regularly.';
      } else if (metrics?.total_time_spent && metrics.total_time_spent > 120) {
        feedback = 'You\'re dedicating great time to learning. This consistency will pay off!';
      } else if (skills.length > 3) {
        feedback = 'You\'re developing a diverse skill set. Consider focusing on your top skills to reach mastery.';
      } else {
        feedback = 'Start building your skills by completing more exercises and courses!';
      }
      
      doc.setFontSize(12);
      const splitText = doc.splitTextToSize(feedback, 170);
      doc.text(splitText, 20, doc.lastAutoTable.finalY + 30);
      
      const pageCount = doc.internal.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(10);
        doc.text('© 2025 Learning Platform - All Rights Reserved', 20, doc.internal.pageSize.height - 10);
      }
      
      doc.save('Learning_Progress_Report.pdf');
      toast.success('Report generated successfully!');
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast.error('Failed to generate report');
    } finally {
      setGenerating(false);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Progress Report</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Skeleton className="h-40 w-full" />
            <div className="flex justify-center">
              <Skeleton className="h-10 w-32" />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const coursesCompleted = metrics?.course_completions || 0;
  const exercisesCompleted = metrics?.exercises_completed || 0;
  const learningTime = metrics?.total_time_spent || 0;
  
  const thisWeekLogs = activityLogs.filter(log => {
    const logDate = new Date(log.date);
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return logDate >= weekAgo;
  });
  
  const lastWeekLogs = activityLogs.filter(log => {
    const logDate = new Date(log.date);
    const weekAgo = new Date();
    const twoWeeksAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);
    return logDate >= twoWeeksAgo && logDate < weekAgo;
  });
  
  const thisWeekCount = thisWeekLogs.reduce((sum, log) => sum + log.count, 0);
  const lastWeekCount = lastWeekLogs.reduce((sum, log) => sum + log.count, 0);
  
  let improvementRate = 0;
  let improvementText = 'No previous data';
  
  if (lastWeekCount > 0) {
    improvementRate = ((thisWeekCount - lastWeekCount) / lastWeekCount) * 100;
    improvementText = improvementRate > 0 
      ? `+${improvementRate.toFixed(0)}% from last week`
      : `${improvementRate.toFixed(0)}% from last week`;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Progress Report</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="bg-white p-6 rounded-lg border">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="bg-blue-50 p-4 rounded-lg text-center">
              <h3 className="text-lg font-medium text-blue-700">Courses Completed</h3>
              <p className="text-3xl font-bold text-blue-900">{coursesCompleted}</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg text-center">
              <h3 className="text-lg font-medium text-green-700">Exercises Done</h3>
              <p className="text-3xl font-bold text-green-900">{exercisesCompleted}</p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg text-center">
              <h3 className="text-lg font-medium text-purple-700">Learning Time</h3>
              <p className="text-3xl font-bold text-purple-900">{learningTime} min</p>
            </div>
          </div>
          
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-2">Weekly Improvement</h3>
            <div className="bg-gray-100 p-4 rounded-lg flex items-center justify-between">
              <span className="text-gray-700">Activity trend</span>
              <span className={`font-bold ${improvementRate >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {improvementText}
              </span>
            </div>
          </div>
          
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-2">Skill Mastery</h3>
            <div className="space-y-2">
              {skills.length > 0 ? (
                skills
                  .sort((a, b) => b.progress - a.progress)
                  .slice(0, 3)
                  .map((skill) => (
                    <div key={skill.id} className="bg-gray-100 p-3 rounded-lg">
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-medium">{skill.skill_name}</span>
                        <span className="text-sm text-blue-700">{skill.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{ width: `${skill.progress}%` }}
                        ></div>
                      </div>
                    </div>
                  ))
              ) : (
                <div className="text-center py-4 text-gray-500">
                  No skills data available yet
                </div>
              )}
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2 justify-center">
            <Button 
              onClick={generatePDF}
              disabled={generating}
              className="flex items-center gap-2"
            >
              {generating ? (
                <>
                  <div className="h-4 w-4 border-2 border-t-transparent border-white rounded-full animate-spin"></div>
                  Generating...
                </>
              ) : (
                <>
                  <Download className="h-4 w-4" />
                  Download PDF Report
                </>
              )}
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              Email Report
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <Printer className="h-4 w-4" />
              Print Report
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
