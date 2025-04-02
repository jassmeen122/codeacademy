
import { Clock, BookOpen, Code, Trophy, Target, Award } from "lucide-react";

// Basic statistics data
export const statsData = [
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

// Skills progress data
export const skillsData = [
  { name: "JavaScript", progress: 75 },
  { name: "React", progress: 60 },
  { name: "TypeScript", progress: 45 },
  { name: "Node.js", progress: 30 },
];

// Achievements data
export const achievementsData = [
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

// Chart data for performance tab
export const retentionData = [
  { month: 'Jan', retention: 85 },
  { month: 'Feb', retention: 90 },
  { month: 'Mar', retention: 87 },
  { month: 'Apr', retention: 91 },
  { month: 'May', retention: 94 },
  { month: 'Jun', retention: 93 },
];

export const userInteractionsData = [
  { day: 'Mon', comments: 5, likes: 12, shares: 3 },
  { day: 'Tue', comments: 7, likes: 15, shares: 5 },
  { day: 'Wed', comments: 10, likes: 20, shares: 8 },
  { day: 'Thu', comments: 8, likes: 17, shares: 6 },
  { day: 'Fri', comments: 12, likes: 25, shares: 10 },
  { day: 'Sat', comments: 15, likes: 30, shares: 12 },
  { day: 'Sun', comments: 9, likes: 18, shares: 7 },
];

export const projectsCompletionData = [
  { name: 'Completed', value: 65, color: '#16a34a' },
  { name: 'In Progress', value: 25, color: '#3b82f6' },
  { name: 'Not Started', value: 10, color: '#cbd5e1' }
];

export const performanceByMonth = [
  { month: 'Jan', score: 65 },
  { month: 'Feb', score: 70 },
  { month: 'Mar', score: 68 },
  { month: 'Apr', score: 75 },
  { month: 'May', score: 80 },
  { month: 'Jun', score: 85 },
];
