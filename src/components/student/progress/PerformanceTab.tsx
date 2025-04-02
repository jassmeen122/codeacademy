
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
  PieChart as RechartsChart,
  Pie,
  LineChart as RechartsLineChart,
  Line,
  Legend
} from "recharts";
import { 
  BarChart3, 
  PieChart, 
  Users, 
  Zap 
} from "lucide-react";
import { 
  retentionData, 
  userInteractionsData, 
  projectsCompletionData, 
  performanceByMonth 
} from "@/data/progressData";
import { UserPerformanceMetric, UserActivity } from "@/hooks/useUserPerformance";
import { Skeleton } from "@/components/ui/skeleton";

interface PerformanceTabProps {
  loading: boolean;
  metrics: UserPerformanceMetric[];
  activities: UserActivity[];
}

const PerformanceTab = ({ loading, metrics, activities }: PerformanceTabProps) => {
  const COLORS = ['#16a34a', '#3b82f6', '#cbd5e1'];
  
  // Transform metrics into chart data if available
  const performanceChartData = React.useMemo(() => {
    if (!metrics.length) return performanceByMonth;
    
    // Group by month and calculate average score
    const monthlyData = metrics.reduce((acc, metric) => {
      const date = new Date(metric.recorded_at);
      const month = date.toLocaleString('default', { month: 'short' });
      
      if (!acc[month]) {
        acc[month] = { total: 0, count: 0 };
      }
      
      // Calculate performance score based on response time (lower is better)
      // and interaction count (higher is better)
      let score = 50; // Default score
      
      if (metric.response_time) {
        // Lower response time means higher score (max 25 points)
        score += Math.min(25, Math.max(0, 25 - metric.response_time / 40));
      }
      
      if (metric.interactions_count) {
        // Higher interaction count means higher score (max 25 points)
        score += Math.min(25, metric.interactions_count);
      }
      
      acc[month].total += score;
      acc[month].count += 1;
      
      return acc;
    }, {} as Record<string, { total: number, count: number }>);
    
    return Object.entries(monthlyData).map(([month, data]) => ({
      month,
      score: Math.round(data.total / data.count)
    }));
  }, [metrics]);
  
  // Calculate user interactions data from activities
  const calculatedInteractionsData = React.useMemo(() => {
    if (!activities.length) return userInteractionsData;
    
    // Group activities by day and count different types
    const last7Days = [...Array(7)].map((_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - i);
      return d.toISOString().split('T')[0];
    }).reverse();
    
    const dailyData = activities.reduce((acc, activity) => {
      const date = activity.created_at.split('T')[0];
      
      if (!acc[date]) {
        acc[date] = { comments: 0, likes: 0, shares: 0 };
      }
      
      if (activity.activity_type === 'comment_added') {
        acc[date].comments += 1;
      } else if (activity.activity_type === 'like_added') {
        acc[date].likes += 1;
      } else if (activity.activity_type === 'share_content') {
        acc[date].shares += 1;
      }
      
      return acc;
    }, {} as Record<string, { comments: number, likes: number, shares: number }>);
    
    // Fill in missing days with zeros
    return last7Days.map(date => {
      const dayName = new Date(date).toLocaleString('default', { weekday: 'short' });
      return {
        day: dayName,
        comments: dailyData[date]?.comments || 0,
        likes: dailyData[date]?.likes || 0,
        shares: dailyData[date]?.shares || 0
      };
    });
  }, [activities]);
  
  // Calculate project completion data
  const calculatedProjectData = React.useMemo(() => {
    if (!activities.length) return projectsCompletionData;
    
    // Count project activities
    const projectActivities = activities.filter(a => 
      a.activity_type === 'project_started' || 
      a.activity_type === 'project_in_progress' || 
      a.activity_type === 'project_completed'
    );
    
    if (!projectActivities.length) return projectsCompletionData;
    
    const completed = projectActivities.filter(a => 
      a.activity_type === 'project_completed'
    ).length;
    
    const inProgress = projectActivities.filter(a => 
      a.activity_type === 'project_in_progress'
    ).length;
    
    const notStarted = projectActivities.filter(a => 
      a.activity_type === 'project_started'
    ).length - (completed + inProgress);
    
    const total = Math.max(1, completed + inProgress + notStarted);
    
    return [
      { name: 'Completed', value: Math.round((completed / total) * 100), color: '#16a34a' },
      { name: 'In Progress', value: Math.round((inProgress / total) * 100), color: '#3b82f6' },
      { name: 'Not Started', value: Math.round((notStarted / total) * 100), color: '#cbd5e1' }
    ];
  }, [activities]);

  if (loading) {
    return (
      <div className="space-y-8">
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-1/3" />
          </CardHeader>
          <CardContent>
            <div className="h-80 flex items-center justify-center">
              <Skeleton className="h-64 w-full" />
            </div>
            <Skeleton className="h-4 w-3/4 mx-auto mt-4" />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-1/3" />
          </CardHeader>
          <CardContent>
            <div className="h-80 flex items-center justify-center">
              <Skeleton className="h-64 w-full" />
            </div>
            <Skeleton className="h-4 w-3/4 mx-auto mt-4" />
          </CardContent>
        </Card>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-1/3" />
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-center justify-center">
                <Skeleton className="h-48 w-48 rounded-full" />
              </div>
              <div className="flex justify-center gap-6 mt-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center gap-2">
                    <Skeleton className="h-3 w-3 rounded-full" />
                    <Skeleton className="h-4 w-16" />
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
              <div className="h-64 flex items-center justify-center">
                <Skeleton className="h-48 w-full" />
              </div>
              <Skeleton className="h-4 w-3/4 mx-auto mt-4" />
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* User Retention Rate */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              User Retention Rate
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={retentionData}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorRetention" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" />
                <YAxis domain={[0, 100]} />
                <CartesianGrid strokeDasharray="3 3" />
                <Tooltip formatter={(value) => [`${value}%`, 'Retention Rate']} />
                <Area 
                  type="monotone" 
                  dataKey="retention" 
                  stroke="#3b82f6" 
                  fillOpacity={1} 
                  fill="url(#colorRetention)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <p className="text-sm text-muted-foreground mt-4 text-center">
            Retention rate shows the percentage of users who continue using the platform each month
          </p>
        </CardContent>
      </Card>

      {/* User Interactions */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-primary" />
              User Interactions
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={calculatedInteractionsData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="comments" stackId="a" fill="#8884d8" name="Comments" />
                <Bar dataKey="likes" stackId="a" fill="#82ca9d" name="Likes" />
                <Bar dataKey="shares" stackId="a" fill="#ffc658" name="Shares" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p className="text-sm text-muted-foreground mt-4 text-center">
            Daily breakdown of user interactions on the platform
          </p>
        </CardContent>
      </Card>

      {/* Projects Completion Status and Performance Score */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <PieChart className="h-5 w-5 text-primary" />
                Projects Completion Status
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsChart>
                  <Pie
                    data={calculatedProjectData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {calculatedProjectData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value}%`, 'Percentage']} />
                </RechartsChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center gap-6 mt-4">
              {calculatedProjectData.map((entry, index) => (
                <div key={`legend-${index}`} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }}></div>
                  <span className="text-sm">{entry.name}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Performance scores using real data if available */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-primary" />
                Performance Score
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsLineChart
                  data={performanceChartData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip formatter={(value) => [`${value}/100`, 'Score']} />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="score" 
                    stroke="#f59e0b" 
                    activeDot={{ r: 8 }} 
                    name="Performance Score"
                    strokeWidth={2}
                  />
                </RechartsLineChart>
              </ResponsiveContainer>
            </div>
            <p className="text-sm text-muted-foreground mt-4 text-center">
              Monthly performance score based on activity and achievements
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PerformanceTab;
