
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Trophy,
  Clock,
  BookOpen,
  Code,
  Target,
  Award,
  BarChart3,
  PieChart as LucidePieChart,
  LineChart as LucideLineChart,
  Users,
  Zap,
} from "lucide-react";
import { ChartContainer, ChartTooltipContent, ChartTooltip, ChartLegend, ChartLegendContent } from "@/components/ui/chart";
import { useState } from "react";
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
  PieChart as RechartsPieChart,
  Pie,
  LineChart,
  Line,
  Legend
} from "recharts";

const ProgressPage = () => {
  const [activeTab, setActiveTab] = useState("overview");

  // Données statistiques de base
  const stats = [
    {
      title: "Total Learning Hours",
      value: "24h",
      icon: Clock,
      description: "Time spent learning",
    },
    {
      title: "Courses Completed",
      value: "3/5",
      icon: BookOpen,
      description: "Completed courses",
    },
    {
      title: "Coding Exercises",
      value: "45",
      icon: Code,
      description: "Exercises completed",
    },
    {
      title: "Achievement Points",
      value: "1,250",
      icon: Trophy,
      description: "Points earned",
    },
  ];

  // Compétences
  const skills = [
    { name: "JavaScript", progress: 75 },
    { name: "React", progress: 60 },
    { name: "TypeScript", progress: 45 },
    { name: "Node.js", progress: 30 },
  ];

  // Succès
  const achievements = [
    {
      title: "Quick Learner",
      description: "Complete 5 lessons in one day",
      icon: Target,
      achieved: true,
    },
    {
      title: "Code Master",
      description: "Solve 10 coding challenges",
      icon: Award,
      achieved: true,
    },
    {
      title: "Team Player",
      description: "Help 5 other students",
      icon: Trophy,
      achieved: false,
    },
  ];

  // Données pour les graphiques de performance
  const retentionData = [
    { month: 'Jan', retention: 85 },
    { month: 'Feb', retention: 90 },
    { month: 'Mar', retention: 87 },
    { month: 'Apr', retention: 91 },
    { month: 'May', retention: 94 },
    { month: 'Jun', retention: 93 },
  ];

  const userInteractionsData = [
    { day: 'Mon', comments: 5, likes: 12, shares: 3 },
    { day: 'Tue', comments: 7, likes: 15, shares: 5 },
    { day: 'Wed', comments: 10, likes: 20, shares: 8 },
    { day: 'Thu', comments: 8, likes: 17, shares: 6 },
    { day: 'Fri', comments: 12, likes: 25, shares: 10 },
    { day: 'Sat', comments: 15, likes: 30, shares: 12 },
    { day: 'Sun', comments: 9, likes: 18, shares: 7 },
  ];

  const projectsCompletionData = [
    { name: 'Completed', value: 65, color: '#16a34a' },
    { name: 'In Progress', value: 25, color: '#3b82f6' },
    { name: 'Not Started', value: 10, color: '#cbd5e1' }
  ];

  const performanceByMonth = [
    { month: 'Jan', score: 65 },
    { month: 'Feb', score: 70 },
    { month: 'Mar', score: 68 },
    { month: 'Apr', score: 75 },
    { month: 'May', score: 80 },
    { month: 'Jun', score: 85 },
  ];

  const COLORS = ['#16a34a', '#3b82f6', '#cbd5e1'];

  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Learning Progress</h1>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-8">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {stats.map((stat) => {
                const Icon = stat.icon;
                return (
                  <Card key={stat.title}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">
                        {stat.title}
                      </CardTitle>
                      <Icon className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{stat.value}</div>
                      <p className="text-xs text-muted-foreground">
                        {stat.description}
                      </p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Skills Progress */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Skills Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {skills.map((skill) => (
                    <div key={skill.name} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>{skill.name}</span>
                        <span>{skill.progress}%</span>
                      </div>
                      <Progress value={skill.progress} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Achievements */}
            <Card>
              <CardHeader>
                <CardTitle>Achievements</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {achievements.map((achievement) => {
                    const Icon = achievement.icon;
                    return (
                      <Card key={achievement.title} className={achievement.achieved ? "border-primary" : ""}>
                        <CardContent className="pt-6">
                          <div className="flex items-center gap-4">
                            <div className={`p-2 rounded-full ${
                              achievement.achieved ? "bg-primary text-primary-foreground" : "bg-muted"
                            }`}>
                              <Icon className="h-4 w-4" />
                            </div>
                            <div>
                              <h3 className="font-medium">{achievement.title}</h3>
                              <p className="text-sm text-muted-foreground">
                                {achievement.description}
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="performance" className="space-y-8">
            {/* Rétention des utilisateurs */}
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

            {/* Interactions utilisateur */}
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
                      data={userInteractionsData}
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

            {/* Complétion des projets */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <LucidePieChart className="h-5 w-5 text-primary" />
                      Projects Completion Status
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <RechartsPieChart>
                        <Pie
                          data={projectsCompletionData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {projectsCompletionData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => [`${value}%`, 'Percentage']} />
                      </RechartsPieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="flex justify-center gap-6 mt-4">
                    {projectsCompletionData.map((entry, index) => (
                      <div key={`legend-${index}`} className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }}></div>
                        <span className="text-sm">{entry.name}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Performance scores */}
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
                      <LineChart
                        data={performanceByMonth}
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
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                  <p className="text-sm text-muted-foreground mt-4 text-center">
                    Monthly performance score based on activity and achievements
                  </p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="recommendations" className="space-y-8">
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
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default ProgressPage;
