
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
import type { CourseLevel } from "@/types/course";

const CreateExercisePage = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [difficulty, setDifficulty] = useState<CourseLevel>("Beginner");
  const [type, setType] = useState<"mcq" | "open_ended" | "coding" | "file_upload">("coding");
  const [timeLimit, setTimeLimit] = useState<number>(30);
  const [loading, setLoading] = useState(false);
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
      
      const { data, error } = await supabase.from('exercises').insert({
        title,
        description,
        difficulty,
        type,
        time_limit: timeLimit,
        teacher_id: user?.id,
        status: 'draft'
      }).select();

      if (error) throw error;
      
      toast.success("Exercise created successfully");
      navigate("/teacher/exercises");
    } catch (error: any) {
      toast.error(`Failed to create exercise: ${error.message}`);
      console.error("Error creating exercise:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Create New Exercise</h1>

        <Card className="max-w-3xl mx-auto">
          <CardHeader>
            <CardTitle>Exercise Details</CardTitle>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Exercise Title</Label>
                <Input 
                  id="title" 
                  value={title} 
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter a descriptive title" 
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Exercise Description</Label>
                <Textarea 
                  id="description" 
                  value={description} 
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Provide detailed instructions for the exercise" 
                  className="min-h-[120px]"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="difficulty">Difficulty Level</Label>
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
                  <Label htmlFor="type">Exercise Type</Label>
                  <Select
                    value={type}
                    onValueChange={(value) => setType(value as "mcq" | "open_ended" | "coding" | "file_upload")}
                  >
                    <SelectTrigger id="type">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="mcq">Multiple Choice</SelectItem>
                      <SelectItem value="open_ended">Open Ended</SelectItem>
                      <SelectItem value="coding">Coding Exercise</SelectItem>
                      <SelectItem value="file_upload">File Upload</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="timeLimit">Time Limit (minutes)</Label>
                <Input 
                  id="timeLimit" 
                  type="number" 
                  min="1"
                  max="180"
                  value={timeLimit}
                  onChange={(e) => setTimeLimit(parseInt(e.target.value))}
                />
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => navigate("/teacher/exercises")}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? "Creating..." : "Create Exercise"}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default CreateExercisePage;
