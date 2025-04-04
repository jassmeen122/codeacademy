
import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import { ActivityLog } from '@/types/progress';

interface ActivityCalendarProps {
  activities: ActivityLog[];
}

export const ActivityCalendar: React.FC<ActivityCalendarProps> = ({ activities }) => {
  // Group activities by date and format them for the chart
  const processedData = React.useMemo(() => {
    // Create a map to store activities by date
    const activityMap = new Map<string, { date: string; total: number; exercise: number; lesson: number; course: number }>();
    
    // Ensure we have data points for the last 30 days
    const today = new Date();
    for (let i = 29; i >= 0; i--) {
      const date = new Date();
      date.setDate(today.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      const displayDate = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(date);
      
      activityMap.set(dateStr, {
        date: displayDate,
        total: 0,
        exercise: 0,
        lesson: 0,
        course: 0
      });
    }
    
    // Fill in the activity counts
    activities.forEach(activity => {
      const dateKey = activity.date.split('T')[0];
      if (activityMap.has(dateKey)) {
        const current = activityMap.get(dateKey)!;
        current.total += activity.count;
        
        // Update specific activity type counts
        if (activity.type === 'exercise_completed') {
          current.exercise += activity.count;
        } else if (activity.type === 'lesson_viewed') {
          current.lesson += activity.count;
        } else if (activity.type === 'course_completed') {
          current.course += activity.count;
        }
        
        activityMap.set(dateKey, current);
      }
    });
    
    // Convert map to array and sort by date
    return Array.from(activityMap.values());
  }, [activities]);

  return (
    <div className="w-full h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart 
          data={processedData}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="lesson" name="Lessons Viewed" stackId="a" fill="#8884d8" />
          <Bar dataKey="exercise" name="Exercises Completed" stackId="a" fill="#82ca9d" />
          <Bar dataKey="course" name="Courses Completed" stackId="a" fill="#ffc658" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
