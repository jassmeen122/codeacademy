
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { MessageSquare, Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";

interface ForumTopic {
  id: string;
  title: string;
  content: string;
  created_at: string;
  author: {
    full_name: string;
  };
  replies: ForumReply[];
}

interface ForumReply {
  id: string;
  content: string;
  created_at: string;
  author: {
    full_name: string;
  };
}

export default function DiscussionPage() {
  const [topics, setTopics] = useState<ForumTopic[]>([]);
  const [loading, setLoading] = useState(true);
  const [newTopic, setNewTopic] = useState({ title: "", content: "" });
  const [selectedTopic, setSelectedTopic] = useState<ForumTopic | null>(null);
  const [newReply, setNewReply] = useState("");

  useEffect(() => {
    fetchTopics();
  }, []);

  const fetchTopics = async () => {
    try {
      const { data, error } = await supabase
        .from('forum_topics')
        .select(`
          *,
          author:profiles(full_name),
          replies:forum_replies(
            id,
            content,
            created_at,
            author:profiles(full_name)
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTopics(data || []);
    } catch (error) {
      console.error('Error fetching topics:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTopic = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { error } = await supabase
        .from('forum_topics')
        .insert({
          title: newTopic.title,
          content: newTopic.content,
          author_id: user.id
        });

      if (error) throw error;

      toast.success("Topic created successfully");
      setNewTopic({ title: "", content: "" });
      fetchTopics();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleCreateReply = async () => {
    if (!selectedTopic) return;

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { error } = await supabase
        .from('forum_replies')
        .insert({
          content: newReply,
          topic_id: selectedTopic.id,
          author_id: user.id
        });

      if (error) throw error;

      toast.success("Reply posted successfully");
      setNewReply("");
      fetchTopics();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  if (loading) {
    return <DashboardLayout>Loading...</DashboardLayout>;
  }

  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Discussion Forum</h1>
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                New Topic
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Topic</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <Input
                  placeholder="Topic Title"
                  value={newTopic.title}
                  onChange={(e) => setNewTopic({ ...newTopic, title: e.target.value })}
                />
                <Input
                  placeholder="Topic Content"
                  value={newTopic.content}
                  onChange={(e) => setNewTopic({ ...newTopic, content: e.target.value })}
                />
                <Button onClick={handleCreateTopic}>Create Topic</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="space-y-4">
          {topics.map((topic) => (
            <Card key={topic.id} className="cursor-pointer hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="text-xl">{topic.title}</CardTitle>
                <div className="text-sm text-muted-foreground">
                  Posted by {topic.author?.full_name} on{" "}
                  {new Date(topic.created_at).toLocaleDateString()}
                </div>
              </CardHeader>
              <CardContent>
                <p className="mb-4">{topic.content}</p>
                <div className="space-y-4">
                  {topic.replies?.map((reply) => (
                    <div key={reply.id} className="pl-4 border-l-2">
                      <p>{reply.content}</p>
                      <div className="text-sm text-muted-foreground mt-1">
                        {reply.author?.full_name} -{" "}
                        {new Date(reply.created_at).toLocaleDateString()}
                      </div>
                    </div>
                  ))}
                  <div className="flex gap-2 mt-4">
                    <Input
                      placeholder="Write a reply..."
                      value={newReply}
                      onChange={(e) => setNewReply(e.target.value)}
                      onFocus={() => setSelectedTopic(topic)}
                    />
                    <Button onClick={handleCreateReply}>
                      <MessageSquare className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
