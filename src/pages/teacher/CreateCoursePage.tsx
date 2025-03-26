
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuthState } from "@/hooks/useAuthState";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PlusCircle, Book, Image as ImageIcon, Clock, Users } from "lucide-react";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import type { CourseLevel, CoursePath, CourseCategory } from "@/types/course";

const CreateCoursePage = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [difficulty, setDifficulty] = useState<CourseLevel>("Beginner");
  const [path, setPath] = useState<CoursePath>("Web Development");
  const [category, setCategory] = useState<CourseCategory>("Programming Fundamentals");
  const [duration, setDuration] = useState("8 weeks");
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("general");
  const navigate = useNavigate();
  const { user } = useAuthState();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim() || !description.trim()) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      setLoading(true);
      
      // Create a properly typed object for Supabase
      const courseData = {
        title,
        description,
        difficulty,
        path,
        category,
        teacher_id: user?.id
      };
      
      const { data, error } = await supabase
        .from('courses')
        .insert(courseData)
        .select();

      if (error) throw error;
      
      toast.success("Course created successfully");
      navigate("/teacher/courses");
    } catch (error: any) {
      toast.error(`Failed to create course: ${error.message}`);
      console.error("Error creating course:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Create New Course</h1>
          <Button variant="outline" onClick={() => navigate("/teacher/courses")}>
            Back to Courses
          </Button>
        </div>

        <Card className="max-w-4xl mx-auto border-t-4 border-primary shadow-md animate-fade-in">
          <CardHeader className="bg-gradient-to-r from-slate-50 to-slate-100">
            <CardTitle className="flex items-center text-2xl text-primary">
              <Book className="mr-2 h-6 w-6" />
              Course Details
            </CardTitle>
          </CardHeader>
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="px-6 pt-4">
              <TabsList className="w-full grid grid-cols-3 mb-4">
                <TabsTrigger value="general">General Information</TabsTrigger>
                <TabsTrigger value="content">Course Content</TabsTrigger>
                <TabsTrigger value="preview">Preview</TabsTrigger>
              </TabsList>
            </div>
            
            <form onSubmit={handleSubmit}>
              <TabsContent value="general">
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="title" className="text-base font-medium">Course Title</Label>
                    <Input 
                      id="title" 
                      value={title} 
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Enter a descriptive title" 
                      className="text-base"
                      required
                    />
                    <p className="text-sm text-muted-foreground">Choose a clear and engaging title that summarizes what students will learn.</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description" className="text-base font-medium">Course Description</Label>
                    <Textarea 
                      id="description" 
                      value={description} 
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Provide a detailed description of the course" 
                      className="min-h-[160px] text-base"
                      required
                    />
                    <p className="text-sm text-muted-foreground">Explain what this course covers, its objectives, and who it's designed for.</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="difficulty" className="text-base font-medium">Difficulty Level</Label>
                      <Select
                        value={difficulty}
                        onValueChange={(value) => setDifficulty(value as CourseLevel)}
                      >
                        <SelectTrigger id="difficulty">
                          <SelectValue placeholder="Select difficulty" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Beginner">Beginner</SelectItem>
                          <SelectItem value="Intermediate">Intermediate</SelectItem>
                          <SelectItem value="Advanced">Advanced</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="path" className="text-base font-medium">Learning Path</Label>
                      <Select
                        value={path}
                        onValueChange={(value) => setPath(value as CoursePath)}
                      >
                        <SelectTrigger id="path">
                          <SelectValue placeholder="Select path" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Web Development">Web Development</SelectItem>
                          <SelectItem value="Data Science">Data Science</SelectItem>
                          <SelectItem value="Artificial Intelligence">Artificial Intelligence</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="category" className="text-base font-medium">Category</Label>
                      <Select
                        value={category}
                        onValueChange={(value) => setCategory(value as CourseCategory)}
                      >
                        <SelectTrigger id="category">
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Programming Fundamentals">Programming Fundamentals</SelectItem>
                          <SelectItem value="Frontend Development">Frontend Development</SelectItem>
                          <SelectItem value="Backend Development">Backend Development</SelectItem>
                          <SelectItem value="Data Analysis">Data Analysis</SelectItem>
                          <SelectItem value="Machine Learning">Machine Learning</SelectItem>
                          <SelectItem value="AI Applications">AI Applications</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="duration" className="text-base font-medium">Estimated Duration</Label>
                      <Input
                        id="duration"
                        value={duration}
                        onChange={(e) => setDuration(e.target.value)}
                        placeholder="e.g., 8 weeks, 10 hours"
                        className="text-base"
                      />
                      <p className="text-sm text-muted-foreground">How long will it take to complete this course?</p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="thumbnail" className="text-base font-medium">Course Thumbnail</Label>
                      <div className="border-2 border-dashed rounded-md p-6 text-center cursor-pointer hover:bg-gray-50 transition-all">
                        <ImageIcon className="h-10 w-10 mx-auto text-gray-400" />
                        <p className="mt-2 text-sm text-muted-foreground">Drag and drop an image here, or click to browse</p>
                        <p className="mt-1 text-xs text-muted-foreground">Recommended size: 1200 x 800 pixels</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </TabsContent>

              <TabsContent value="content">
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-semibold">Course Modules</h3>
                      <Button type="button" size="sm" variant="outline">
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Add Module
                      </Button>
                    </div>
                    
                    <div className="bg-muted/50 rounded-md p-6 text-center">
                      <Book className="h-10 w-10 mx-auto text-muted-foreground" />
                      <h3 className="mt-2 font-medium">No modules yet</h3>
                      <p className="mt-1 text-sm text-muted-foreground">Start creating your course by adding modules and lessons</p>
                      <Button className="mt-4" size="sm">
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Create First Module
                      </Button>
                    </div>
                  </div>

                  <div className="pt-4 border-t">
                    <h3 className="text-lg font-semibold mb-4">Course Resources</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Card className="bg-muted/30">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-base">Attachment Options</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2">
                            <Button type="button" variant="outline" size="sm" className="w-full justify-start">
                              <PlusCircle className="mr-2 h-4 w-4" /> Add PDF Document
                            </Button>
                            <Button type="button" variant="outline" size="sm" className="w-full justify-start">
                              <PlusCircle className="mr-2 h-4 w-4" /> Add Video Link
                            </Button>
                            <Button type="button" variant="outline" size="sm" className="w-full justify-start">
                              <PlusCircle className="mr-2 h-4 w-4" /> Add Presentation
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                      
                      <Card className="bg-muted/30">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-base">Resource List</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-center py-4 text-muted-foreground">
                            <p className="text-sm">No resources added yet</p>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </CardContent>
              </TabsContent>

              <TabsContent value="preview">
                <CardContent className="space-y-6">
                  <div className="rounded-md overflow-hidden border">
                    <div className="aspect-video bg-muted relative">
                      <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                        <p>Course thumbnail preview</p>
                      </div>
                    </div>
                    <div className="p-4 bg-white">
                      <h2 className="text-xl font-semibold">{title || "Course Title"}</h2>
                      <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          {duration}
                        </div>
                        <div className="flex items-center">
                          <Users className="h-4 w-4 mr-1" />
                          0 students
                        </div>
                      </div>
                      <p className="mt-4 text-muted-foreground">
                        {description || "Course description will appear here."}
                      </p>
                      
                      <div className="mt-4 flex flex-wrap gap-2">
                        <span className="px-2 py-1 bg-primary/10 text-primary rounded text-xs">
                          {difficulty}
                        </span>
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                          {path}
                        </span>
                        <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded text-xs">
                          {category}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </TabsContent>

              <CardFooter className="flex justify-between border-t bg-muted/20 px-6 py-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => navigate("/teacher/courses")}
                  disabled={loading}
                >
                  Cancel
                </Button>
                <div className="flex gap-2">
                  <Button 
                    type="button"
                    variant="outline"
                    disabled={loading}
                    onClick={() => toast.info("Course saved as draft")}
                  >
                    Save as Draft
                  </Button>
                  <Button 
                    type="submit" 
                    className="px-6" 
                    disabled={loading || !title.trim() || !description.trim()}
                  >
                    {loading ? "Creating..." : "Publish Course"}
                  </Button>
                </div>
              </CardFooter>
            </form>
          </Tabs>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default CreateCoursePage;
