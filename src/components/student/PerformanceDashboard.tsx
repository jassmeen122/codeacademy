
import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie,
  ScatterChart,
  Scatter,
  ZAxis,
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis
} from 'recharts';
import { 
  Trophy, 
  Clock, 
  Check, 
  X,
  CalendarDays,
  Timer,
  Cpu
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface PerformanceDashboardProps {
  userId: string;
  timeRange: 'week' | 'month' | 'year' | 'all';
}

export const PerformanceDashboard: React.FC<PerformanceDashboardProps> = ({
  userId,
  timeRange = 'month'
}) => {
  const [activeTab, setActiveTab] = useState('overview');
  
  // Mock performance data
  const successRateData = [
    { date: '2025-01-01', rate: 65 },
    { date: '2025-01-08', rate: 70 },
    { date: '2025-01-15', rate: 75 },
    { date: '2025-01-22', rate: 73 },
    { date: '2025-01-29', rate: 78 },
    { date: '2025-02-05', rate: 82 },
    { date: '2025-02-12', rate: 85 },
    { date: '2025-02-19', rate: 88 },
    { date: '2025-02-26', rate: 90 },
  ];
  
  const completionTimeData = [
    { date: '2025-01-01', time: 350 },
    { date: '2025-01-08', time: 320 },
    { date: '2025-01-15', time: 300 },
    { date: '2025-01-22', time: 310 },
    { date: '2025-01-29', time: 290 },
    { date: '2025-02-05', time: 275 },
    { date: '2025-02-12', time: 260 },
    { date: '2025-02-19', time: 250 },
    { date: '2025-02-26', time: 240 },
  ];
  
  const attemptsData = [
    { exercise: 'E1', attempts: 1 },
    { exercise: 'E2', attempts: 2 },
    { exercise: 'E3', attempts: 1 },
    { exercise: 'E4', attempts: 3 },
    { exercise: 'E5', attempts: 2 },
    { exercise: 'E6', attempts: 1 },
    { exercise: 'E7', attempts: 1 },
    { exercise: 'E8', attempts: 2 },
  ];
  
  const errorPatternData = [
    { pattern: 'Syntax Errors', count: 15 },
    { pattern: 'Logic Errors', count: 10 },
    { pattern: 'Runtime Errors', count: 8 },
    { pattern: 'Type Errors', count: 5 },
    { pattern: 'Algorithm Errors', count: 12 },
  ];
  
  const languageComparisonData = [
    { language: 'JavaScript', successRate: 85, avgTime: 280 },
    { language: 'Python', successRate: 90, avgTime: 250 },
    { language: 'SQL', successRate: 75, avgTime: 320 },
    { language: 'HTML/CSS', successRate: 95, avgTime: 200 },
    { language: 'TypeScript', successRate: 80, avgTime: 300 },
  ];
  
  const codeEfficiencyData = [
    { exercise: 'E1', runtime: 120, memory: 15, quality: 85 },
    { exercise: 'E2', runtime: 150, memory: 22, quality: 75 },
    { exercise: 'E3', runtime: 90, memory: 18, quality: 90 },
    { exercise: 'E4', runtime: 180, memory: 30, quality: 70 },
    { exercise: 'E5', runtime: 100, memory: 20, quality: 88 },
  ];
  
  const skillRadarData = [
    { subject: 'Algorithms', score: 80 },
    { subject: 'Data Structures', score: 70 },
    { subject: 'Syntax', score: 90 },
    { subject: 'Debugging', score: 85 },
    { subject: 'Problem Solving', score: 75 },
    { subject: 'Code Quality', score: 80 },
  ];
  
  const overviewStats = [
    { name: 'Average Success Rate', value: '85%', icon: Check, color: 'bg-green-100 text-green-700' },
    { name: 'Average Completion Time', value: '4m 30s', icon: Timer, color: 'bg-blue-100 text-blue-700' },
    { name: 'Exercises Completed', value: '78', icon: Trophy, color: 'bg-yellow-100 text-yellow-700' },
    { name: 'Average Attempts', value: '1.6', icon: Cpu, color: 'bg-purple-100 text-purple-700' },
  ];
  
  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="languages">Languages</TabsTrigger>
          <TabsTrigger value="time">Time Analysis</TabsTrigger>
          <TabsTrigger value="errors">Error Patterns</TabsTrigger>
          <TabsTrigger value="efficiency">Code Efficiency</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-6">
          {/* Overview Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {overviewStats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <Card key={index}>
                  <CardContent className="pt-6">
                    <div className="flex items-center">
                      <div className={`p-3 rounded-full mr-4 ${stat.color}`}>
                        <Icon className="h-6 w-6" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">{stat.name}</p>
                        <p className="text-2xl font-bold">{stat.value}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
          
          {/* Success Rate Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Success Rate Over Time</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={successRateData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="rate" 
                      name="Success Rate (%)" 
                      stroke="#8884d8" 
                      activeDot={{ r: 8 }} 
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          
          {/* Radar Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Skill Proficiency</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="80%" data={skillRadarData}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="subject" />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} />
                    <Radar 
                      name="Skill Score" 
                      dataKey="score" 
                      stroke="#8884d8" 
                      fill="#8884d8" 
                      fillOpacity={0.6} 
                    />
                    <Tooltip />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="languages" className="space-y-6">
          {/* Language Comparison */}
          <Card>
            <CardHeader>
              <CardTitle>Language Performance Comparison</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={languageComparisonData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="language" />
                    <YAxis yAxisId="left" orientation="left" domain={[0, 100]} />
                    <YAxis yAxisId="right" orientation="right" domain={[0, 400]} />
                    <Tooltip />
                    <Legend />
                    <Bar 
                      yAxisId="left" 
                      dataKey="successRate" 
                      name="Success Rate (%)" 
                      fill="#8884d8" 
                    />
                    <Bar 
                      yAxisId="right" 
                      dataKey="avgTime" 
                      name="Avg. Completion Time (sec)" 
                      fill="#82ca9d" 
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="time" className="space-y-6">
          {/* Completion Time Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Average Completion Time</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={completionTimeData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="time" 
                      name="Completion Time (sec)" 
                      stroke="#82ca9d" 
                      activeDot={{ r: 8 }} 
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          
          {/* Attempts Per Exercise */}
          <Card>
            <CardHeader>
              <CardTitle>Attempts Per Exercise</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={attemptsData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="exercise" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="attempts" name="Number of Attempts" fill="#ffc658" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="errors" className="space-y-6">
          {/* Error Pattern Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Error Pattern Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={errorPatternData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="count"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {errorPatternData.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'][index % 5]} 
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="efficiency" className="space-y-6">
          {/* Code Efficiency */}
          <Card>
            <CardHeader>
              <CardTitle>Code Efficiency Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                    <CartesianGrid />
                    <XAxis 
                      type="number" 
                      dataKey="runtime" 
                      name="Runtime (ms)" 
                      domain={[0, 200]}
                    />
                    <YAxis 
                      dataKey="memory" 
                      name="Memory Usage (MB)" 
                      domain={[0, 50]}
                    />
                    <ZAxis 
                      dataKey="quality" 
                      range={[50, 400]} 
                      name="Code Quality Score"
                    />
                    <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                    <Legend />
                    <Scatter 
                      name="Exercises" 
                      data={codeEfficiencyData} 
                      fill="#8884d8" 
                    />
                  </ScatterChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 text-sm text-muted-foreground">
                <p className="mb-2">Bubble size represents code quality score.</p>
                <p>Lower runtime and memory usage with higher quality scores indicate more efficient code.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
