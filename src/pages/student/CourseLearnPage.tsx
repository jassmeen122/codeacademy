import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CourseLearnResponse, CourseResource, CourseResourceType } from "@/types/course";
import { toast } from "sonner";
import { FileText, Video, Presentation, Book, CheckCircle, Circle } from "lucide-react";

const CourseLearnPage = () => {
  const { courseId } = useParams();
  const [loading, setLoading] = useState(true);
  const [courseModules, setCourseModules] = useState<CourseLearnResponse[]>([]);
  const [courseResources, setCourseResources] = useState<CourseResource[]>([]);
  const [activeModule, setActiveModule] = useState<CourseLearnResponse | null>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (courseId) {
      fetchCourseContent();
      fetchCourseResources();
    }
  }, [courseId]);

  const fetchCourseContent = async () => {
    try {
      setLoading(true);
      // In a real implementation, this would fetch actual course modules
      const mockModules: CourseLearnResponse[] = [
        {
          id: "1",
          course_id: courseId || "",
          module_id: "module1",
          module_title: "Introduction to the Course",
          title: "Welcome to the Course",
          description: "An overview of what you'll learn in this course",
          video_url: "https://example.com/intro-video.mp4",
          order: 1,
          completed: true,
          content: "Welcome to the course content",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: "2",
          course_id: courseId || "",
          module_id: "module2",
          module_title: "Getting Started",
          title: "Setting Up Your Environment",
          description: "Learn how to set up your development environment",
          video_url: "https://example.com/setup-video.mp4",
          order: 2,
          completed: false,
          content: "Setting up your environment content",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ];
      
      setCourseModules(mockModules);
      setActiveModule(mockModules[0]);
      
      // Calculate progress
      const completedModules = mockModules.filter(module => module.completed).length;
      setProgress(Math.round((completedModules / mockModules.length) * 100));
    } catch (error) {
      console.error("Error fetching course content:", error);
      toast.error("Failed to load course content");
    } finally {
      setLoading(false);
    }
  };

  const fetchCourseResources = async () => {
    try {
      if (!courseId) return;
      
      const { data, error } = await supabase
        .from('course_resources')
        .select('*')
        .eq('course_id', courseId)
        .order('order_index', { ascending: true });
        
      if (error) throw error;
      
      // Cast the type properly to match CourseResourceType
      const typedResources = (data || []).map(resource => ({
        ...resource,
        type: resource.type as CourseResourceType
      }));
      
      setCourseResources(typedResources);
    } catch (error) {
      console.error("Error fetching course resources:", error);
      toast.error("Failed to load course resources");
    }
  };

  const markModuleAsCompleted = async (moduleId: string) => {
    try {
      // In a real implementation, this would update the database
      const updatedModules = courseModules.map(module => 
        module.module_id === moduleId ? { ...module, completed: true } : module
      );
      
      setCourseModules(updatedModules);
      
      // Recalculate progress
      const completedModules = updatedModules.filter(module => module.completed).length;
      setProgress(Math.round((completedModules / updatedModules.length) * 100));
      
      toast.success("Module marked as completed");
    } catch (error) {
      console.error("Error marking module as completed:", error);
      toast.error("Failed to update progress");
    }
  };

  const getResourceIcon = (type: string) => {
    switch (type) {
      case 'pdf':
        return <FileText className="h-5 w-5 text-red-500" />;
      case 'video':
        return <Video className="h-5 w-5 text-blue-500" />;
      case 'presentation':
        return <Presentation className="h-5 w-5 text-green-500" />;
      default:
        return <Book className="h-5 w-5 text-gray-500" />;
    }
  };

  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Course Learning</h1>
        <p className="text-gray-600 mb-8">Course ID: {courseId}</p>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Left Sidebar - Course Modules */}
          <div className="md:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Course Modules</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {courseModules.map(module => (
                    <div 
                      key={module.module_id}
                      className={`flex items-start p-2 rounded-md cursor-pointer transition-colors ${
                        activeModule?.module_id === module.module_id 
                          ? 'bg-primary/10' 
                          : 'hover:bg-gray-100'
                      }`}
                      onClick={() => setActiveModule(module)}
                    >
                      {module.completed ? (
                        <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                      ) : (
                        <Circle className="h-5 w-5 text-gray-300 mr-2 flex-shrink-0" />
                      )}
                      <div>
                        <p className="font-medium text-sm">{module.module_title}</p>
                        <p className="text-xs text-gray-500">{module.title}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            <Card className="mt-4">
              <CardHeader>
                <CardTitle className="text-lg">Resources</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {courseResources.length > 0 ? (
                    courseResources.map(resource => (
                      <a 
                        key={resource.id}
                        href={resource.url || '#'}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center p-2 rounded-md hover:bg-gray-100 transition-colors"
                      >
                        {getResourceIcon(resource.type)}
                        <span className="ml-2 text-sm">{resource.title}</span>
                      </a>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500">No additional resources available</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Main Content Area */}
          <div className="md:col-span-3">
            {loading ? (
              <div className="h-64 flex items-center justify-center">
                <p>Loading course content...</p>
              </div>
            ) : activeModule ? (
              <Card>
                <CardHeader>
                  <CardTitle>{activeModule.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {activeModule.video_url && (
                      <div className="aspect-video bg-black rounded-lg flex items-center justify-center">
                        <p className="text-white">Video Player would be here</p>
                      </div>
                    )}
                    
                    <p>{activeModule.description}</p>
                    
                    {!activeModule.completed && (
                      <Button 
                        onClick={() => markModuleAsCompleted(activeModule.module_id)}
                        className="mt-4"
                      >
                        Mark as Completed
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="bg-yellow-100 border-l-4 border-yellow-500 p-4 mb-8">
                <p className="text-yellow-700">
                  Please select a module from the sidebar to start learning.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CourseLearnPage;
