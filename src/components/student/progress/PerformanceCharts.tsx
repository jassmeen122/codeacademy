
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Calendar, Flame, CheckCircle2, Clock, Star } from "lucide-react";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  Legend
} from "recharts";

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

interface PerformanceChartsProps {
  performanceData: any[];
  monthlyActivity: any[];
  retentionRate: any[];
  courseCompletions: any[];
}

export const PerformanceCharts = ({ 
  performanceData, 
  monthlyActivity, 
  retentionRate, 
  courseCompletions 
}: PerformanceChartsProps) => {
  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <LineChart className="h-5 w-5 text-primary" />
            Tendances de performance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80 mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis label={{ value: 'Score de performance', angle: -90, position: 'insideLeft' }} />
                <Tooltip />
                <Legend />
                <Bar dataKey="score" fill="#8884d8" name="Score de performance quotidien" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 text-sm text-muted-foreground">
            Score de performance moyen : {Math.round(performanceData.reduce((sum, day) => sum + day.score, 0) / performanceData.length)}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            Distribution d'activité mensuelle
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80 mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyActivity}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis label={{ value: 'Heures d\'apprentissage', angle: -90, position: 'insideLeft' }} />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" fill="#82ca9d" name="Heures totales" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Flame className="h-5 w-5 text-orange-500" />
            Taux d'engagement
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80 mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={retentionRate}>
                <defs>
                  <linearGradient id="colorRetention" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#FF8042" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#FF8042" stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis label={{ value: 'Taux d\'engagement (%)', angle: -90, position: 'insideLeft' }} />
                <Tooltip />
                <Area 
                  type="monotone" 
                  dataKey="rate" 
                  stroke="#FF8042" 
                  fillOpacity={1} 
                  fill="url(#colorRetention)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 text-sm text-muted-foreground">
            Engagement moyen : {Math.round(retentionRate.reduce((sum, item) => sum + item.rate, 0) / retentionRate.length)}%
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-green-500" />
            Progression des cours
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80 mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={courseCompletions}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, completion }) => `${name} (${completion}%)`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="completion"
                  nameKey="name"
                >
                  {courseCompletions.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `${value}%`} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            {courseCompletions.map((course, index) => (
              <div key={course.name} className="flex items-center gap-2">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: COLORS[index % COLORS.length] }} 
                />
                <span className="text-sm truncate">{course.name}</span>
                <span className="text-xs text-muted-foreground ml-auto">{course.completion}%</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </>
  );
};
