
import React, { useMemo } from 'react';
import {
  PieChart, Pie, LineChart, Line, BarChart, Bar, 
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, Cell,
  ResponsiveContainer
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { UserSkill, UserMetric, ActivityLog } from '@/types/progress';

interface ProgressChartsProps {
  skills: UserSkill[];
  metrics?: UserMetric | null;
  activityLogs?: ActivityLog[];
  loading: boolean;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658', '#8dd1e1'];

export const ProgressCharts: React.FC<ProgressChartsProps> = ({ 
  skills, 
  metrics, 
  activityLogs = [],
  loading 
}) => {
  const skillsData = useMemo(() => {
    return skills.map(skill => ({
      name: skill.skill_name,
      value: skill.progress
    }));
  }, [skills]);

  // Group activities by date for the activity chart
  const activityData = useMemo(() => {
    const lastSevenDays = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      return date.toISOString().split('T')[0];
    }).reverse();
    
    // Create a map of dates to count
    const activityMap = new Map();
    lastSevenDays.forEach(date => {
      activityMap.set(date, 0);
    });
    
    // Fill in the actual activity counts
    activityLogs.forEach(log => {
      const date = log.date.split('T')[0];
      if (activityMap.has(date)) {
        activityMap.set(date, activityMap.get(date) + log.count);
      }
    });
    
    // Convert map to array for chart
    return Array.from(activityMap.entries()).map(([date, count]) => ({
      date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      count
    }));
  }, [activityLogs]);

  if (loading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Learning Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 w-full flex items-center justify-center">
            <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Learning Progress</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="skills">
          <TabsList className="mb-4">
            <TabsTrigger value="skills">Skills Distribution</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
            <TabsTrigger value="time">Time Spent</TabsTrigger>
          </TabsList>
          
          <TabsContent value="skills" className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={skillsData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {skillsData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `${value}%`} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </TabsContent>
          
          <TabsContent value="activity" className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={activityData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="count" 
                  name="Activities" 
                  stroke="#8884d8" 
                  activeDot={{ r: 8 }} 
                />
              </LineChart>
            </ResponsiveContainer>
          </TabsContent>
          
          <TabsContent value="time" className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={[
                  { name: 'Total Learning Hours', hours: metrics?.total_time_spent || 0 },
                  { name: 'Avg. Daily Hours', hours: metrics?.total_time_spent ? (metrics.total_time_spent / 30).toFixed(1) : 0 },
                ]}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="hours" fill="#82ca9d" name="Hours" />
              </BarChart>
            </ResponsiveContainer>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
