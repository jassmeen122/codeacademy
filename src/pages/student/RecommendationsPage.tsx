
import React, { useState, useEffect } from 'react';
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  BookOpen, 
  Code, 
  Video, 
  FileText, 
  ChevronRight,
  Star,
  BookMarked,
  Target,
  Lightbulb,
  Filter
} from 'lucide-react';
import { useAuthState } from '@/hooks/useAuthState';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { UserRecommendation } from '@/types/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const RecommendationsPage = () => {
  const { user } = useAuthState();
  const [recommendations, setRecommendations] = useState<UserRecommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [difficultyFilter, setDifficultyFilter] = useState('all');
  const [languageFilter, setLanguageFilter] = useState('all');

  useEffect(() => {
    if (user) {
      fetchRecommendations();
    } else {
      setLoading(false);
    }
  }, [user]);

  const fetchRecommendations = async () => {
    // In a real app, this would fetch from the database
    // For now, we'll use mock data
    setLoading(true);
    
    const mockRecommendations: UserRecommendation[] = [
      {
        id: "1",
        user_id: user?.id || '',
        recommendation_type: "exercise",
        item_id: "ex1",
        relevance_score: 0.95,
        created_at: new Date().toISOString(),
        is_viewed: false,
        metadata: {
          title: "Advanced JavaScript Array Methods",
          description: "Practice map, filter, reduce and other functional programming techniques in JavaScript",
          difficulty: "intermediate",
          language: "JavaScript",
          url: "/exercises/js-arrays"
        }
      },
      {
        id: "2",
        user_id: user?.id || '',
        recommendation_type: "course",
        item_id: "c1",
        relevance_score: 0.92,
        created_at: new Date().toISOString(),
        is_viewed: false,
        metadata: {
          title: "React Hooks Masterclass",
          description: "Learn all about React hooks and how to use them to build efficient React components",
          difficulty: "advanced",
          language: "JavaScript",
          url: "/courses/react-hooks"
        }
      },
      {
        id: "3",
        user_id: user?.id || '',
        recommendation_type: "video",
        item_id: "v1",
        relevance_score: 0.88,
        created_at: new Date().toISOString(),
        is_viewed: true,
        metadata: {
          title: "SQL Joins Explained",
          description: "Visual guide to understanding SQL joins with practical examples",
          difficulty: "beginner",
          language: "SQL",
          url: "https://example.com/sql-joins"
        }
      },
      {
        id: "4",
        user_id: user?.id || '',
        recommendation_type: "material",
        item_id: "m1",
        relevance_score: 0.85,
        created_at: new Date().toISOString(),
        is_viewed: false,
        metadata: {
          title: "Python Data Structures Guide",
          description: "Comprehensive guide to Python's built-in data structures and their usage",
          difficulty: "intermediate",
          language: "Python",
          url: "/materials/python-data-structures"
        }
      },
      {
        id: "5",
        user_id: user?.id || '',
        recommendation_type: "exercise",
        item_id: "ex2",
        relevance_score: 0.82,
        created_at: new Date().toISOString(),
        is_viewed: false,
        metadata: {
          title: "Database Normalization Practice",
          description: "Apply normalization rules to convert poorly structured databases to 3NF",
          difficulty: "advanced",
          language: "SQL",
          url: "/exercises/database-normalization"
        }
      },
      {
        id: "6",
        user_id: user?.id || '',
        recommendation_type: "course",
        item_id: "c2",
        relevance_score: 0.78,
        created_at: new Date().toISOString(),
        is_viewed: false,
        metadata: {
          title: "TypeScript for JavaScript Developers",
          description: "Bridge the gap between JavaScript and TypeScript with practical examples",
          difficulty: "beginner",
          language: "TypeScript",
          url: "/courses/typescript-basics"
        }
      },
    ];
    
    setTimeout(() => {
      setRecommendations(mockRecommendations);
      setLoading(false);
    }, 1000);
  };

  const markAsViewed = async (recommendationId: string) => {
    // In a real app, this would update the database
    setRecommendations(prev => 
      prev.map(rec => 
        rec.id === recommendationId
          ? { ...rec, is_viewed: true }
          : rec
      )
    );
    toast.success("Recommendation marked as viewed");
  };

  const refreshRecommendations = () => {
    setLoading(true);
    // In a real app, this would trigger a re-analysis of the user's progress
    setTimeout(() => {
      fetchRecommendations();
      toast.success("Recommendations refreshed based on your latest progress");
    }, 1500);
  };

  const filteredRecommendations = recommendations.filter(rec => {
    // Filter by tab (recommendation type)
    if (activeTab !== 'all' && rec.recommendation_type !== activeTab) return false;
    
    // Filter by difficulty
    if (difficultyFilter !== 'all' && rec.metadata?.difficulty !== difficultyFilter) return false;
    
    // Filter by language
    if (languageFilter !== 'all' && rec.metadata?.language !== languageFilter) return false;
    
    return true;
  });

  // Get unique languages and difficulties for filters
  const languages = ['all', ...new Set(recommendations.map(rec => rec.metadata?.language).filter(Boolean))];
  const difficulties = ['all', ...new Set(recommendations.map(rec => rec.metadata?.difficulty).filter(Boolean))];

  const getRecommendationIcon = (type: string) => {
    switch (type) {
      case 'exercise': return <Code className="h-6 w-6 text-blue-500" />;
      case 'course': return <BookOpen className="h-6 w-6 text-green-500" />;
      case 'video': return <Video className="h-6 w-6 text-red-500" />;
      case 'material': return <FileText className="h-6 w-6 text-purple-500" />;
      default: return <Lightbulb className="h-6 w-6 text-yellow-500" />;
    }
  };

  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
              <Target className="h-7 w-7 text-primary" />
              Personalized Recommendations
            </h1>
            <p className="text-muted-foreground mt-1">Tailored suggestions based on your learning progress and interests</p>
          </div>
          <Button onClick={refreshRecommendations} disabled={loading}>
            {loading ? 'Refreshing...' : 'Refresh Recommendations'}
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Filters</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium block mb-2">Content Type</label>
                  <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="w-full">
                      <TabsTrigger value="all" className="flex-1">All</TabsTrigger>
                      <TabsTrigger value="exercise" className="flex-1">Exercises</TabsTrigger>
                      <TabsTrigger value="course" className="flex-1">Courses</TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>
                
                <div>
                  <label className="text-sm font-medium block mb-2">Difficulty</label>
                  <Select value={difficultyFilter} onValueChange={setDifficultyFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select difficulty" />
                    </SelectTrigger>
                    <SelectContent>
                      {difficulties.map(difficulty => (
                        <SelectItem key={difficulty} value={difficulty}>
                          {difficulty === 'all' ? 'All Levels' : 
                            difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium block mb-2">Language</label>
                  <Select value={languageFilter} onValueChange={setLanguageFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select language" />
                    </SelectTrigger>
                    <SelectContent>
                      {languages.map(language => (
                        <SelectItem key={language} value={language}>
                          {language === 'all' ? 'All Languages' : language}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <Card className="bg-blue-50 border-blue-200">
                  <CardContent className="pt-6">
                    <h3 className="font-medium text-blue-800 flex items-center gap-2 mb-2">
                      <Lightbulb className="h-4 w-4" />
                      How It Works
                    </h3>
                    <p className="text-sm text-blue-700">
                      Recommendations are personalized based on your learning patterns, 
                      strengths, weaknesses, and past interactions. The system identifies 
                      areas where you can improve and suggests relevant content.
                    </p>
                  </CardContent>
                </Card>
              </CardContent>
            </Card>
          </div>
          
          <div className="lg:col-span-3">
            <div className="space-y-6">
              {loading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map(i => (
                    <Card key={i} className="animate-pulse">
                      <CardHeader>
                        <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/2 mt-2"></div>
                      </CardHeader>
                      <CardContent>
                        <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                        <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : filteredRecommendations.length > 0 ? (
                <>
                  <div className="flex justify-between items-center">
                    <p className="text-sm text-muted-foreground">
                      Showing {filteredRecommendations.length} recommendations
                    </p>
                    <div className="flex items-center gap-2">
                      <Filter className="h-4 w-4" />
                      <p className="text-sm font-medium">
                        Filters: {activeTab !== 'all' ? activeTab : 'none'} 
                        {difficultyFilter !== 'all' ? `, ${difficultyFilter}` : ''} 
                        {languageFilter !== 'all' ? `, ${languageFilter}` : ''}
                      </p>
                    </div>
                  </div>
                  
                  {filteredRecommendations.map(recommendation => (
                    <Card 
                      key={recommendation.id}
                      className={recommendation.is_viewed ? "opacity-75" : ""}
                    >
                      <CardHeader className="pb-2">
                        <div className="flex justify-between">
                          <div className="flex items-center gap-3">
                            {getRecommendationIcon(recommendation.recommendation_type)}
                            <div>
                              <CardTitle className="text-lg">{recommendation.metadata?.title}</CardTitle>
                              <CardDescription>
                                {recommendation.recommendation_type.charAt(0).toUpperCase() + recommendation.recommendation_type.slice(1)}
                              </CardDescription>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant={recommendation.is_viewed ? "outline" : "default"}>
                              {recommendation.is_viewed ? "Viewed" : "New"}
                            </Badge>
                            <div className="flex items-center">
                              {[...Array(Math.round(recommendation.relevance_score * 5 / 100))].map((_, i) => (
                                <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                              ))}
                              {[...Array(5 - Math.round(recommendation.relevance_score * 5 / 100))].map((_, i) => (
                                <Star key={i} className="h-4 w-4 text-gray-300" />
                              ))}
                            </div>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-600 mb-4">{recommendation.metadata?.description}</p>
                        <div className="flex flex-wrap gap-2 mb-4">
                          {recommendation.metadata?.difficulty && (
                            <Badge variant="outline" className={
                              recommendation.metadata.difficulty === 'beginner' ? "bg-green-50 text-green-700 border-green-300" :
                              recommendation.metadata.difficulty === 'intermediate' ? "bg-yellow-50 text-yellow-700 border-yellow-300" :
                              "bg-red-50 text-red-700 border-red-300"
                            }>
                              {recommendation.metadata.difficulty.charAt(0).toUpperCase() + recommendation.metadata.difficulty.slice(1)}
                            </Badge>
                          )}
                          {recommendation.metadata?.language && (
                            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-300">
                              {recommendation.metadata.language}
                            </Badge>
                          )}
                          <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-300">
                            {recommendation.relevance_score.toFixed(2) * 100}% Match
                          </Badge>
                        </div>
                        <div className="mt-2">
                          <div className="flex justify-between text-sm mb-1">
                            <span>Relevance</span>
                            <span>{(recommendation.relevance_score * 100).toFixed(0)}%</span>
                          </div>
                          <Progress value={recommendation.relevance_score * 100} className="h-1" />
                        </div>
                      </CardContent>
                      <CardFooter className="flex justify-between pt-1">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => markAsViewed(recommendation.id)}
                          disabled={recommendation.is_viewed}
                        >
                          {recommendation.is_viewed ? "Already Viewed" : "Mark as Viewed"}
                        </Button>
                        <Button size="sm">
                          Go to Content
                          <ChevronRight className="h-4 w-4 ml-1" />
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </>
              ) : (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <BookMarked className="h-16 w-16 text-muted-foreground mb-4" />
                    <h3 className="text-xl font-medium mb-2">No recommendations found</h3>
                    <p className="text-muted-foreground text-center max-w-md mb-6">
                      We couldn't find any recommendations matching your current filters. 
                      Try changing your filters or complete more activities to get personalized recommendations.
                    </p>
                    <Button onClick={() => {
                      setActiveTab('all');
                      setDifficultyFilter('all');
                      setLanguageFilter('all');
                    }}>
                      Clear Filters
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default RecommendationsPage;
