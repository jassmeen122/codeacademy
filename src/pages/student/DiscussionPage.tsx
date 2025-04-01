
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { MessageSquare, Plus, Send } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useNavigate } from "react-router-dom";
import { useAuthState } from "@/hooks/useAuthState";
import { usePrivateMessages } from "@/hooks/usePrivateMessages";

interface ForumTopic {
  id: string;
  title: string;
  content: string;
  created_at: string;
  author: {
    full_name: string;
    id: string;
    avatar_url: string | null;
  };
  replies: ForumReply[];
}

interface ForumReply {
  id: string;
  content: string;
  created_at: string;
  author: {
    full_name: string;
    id: string;
    avatar_url: string | null;
  };
}

export default function DiscussionPage() {
  const [topics, setTopics] = useState<ForumTopic[]>([]);
  const [loading, setLoading] = useState(true);
  const [newTopic, setNewTopic] = useState({ title: "", content: "" });
  const [selectedTopic, setSelectedTopic] = useState<ForumTopic | null>(null);
  const [newReply, setNewReply] = useState("");
  const [messageDialogOpen, setMessageDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<{ id: string; name: string; avatar_url: string | null } | null>(null);
  const [privateMessage, setPrivateMessage] = useState("");
  const { user } = useAuthState();
  const navigate = useNavigate();
  const { sendMessage } = usePrivateMessages();

  useEffect(() => {
    fetchTopics();
  }, []);

  const fetchTopics = async () => {
    try {
      const { data, error } = await supabase
        .from('forum_topics')
        .select(`
          *,
          author:profiles(
            full_name,
            id,
            avatar_url
          ),
          replies:forum_replies(
            id,
            content,
            created_at,
            author:profiles(
              full_name,
              id,
              avatar_url
            )
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

  const handleSendPrivateMessage = async () => {
    if (!selectedUser || !privateMessage.trim() || !user) {
      toast.error("Please enter a message");
      return;
    }

    try {
      const message = await sendMessage(selectedUser.id, privateMessage);
      
      if (message) {
        toast.success(`Message sent to ${selectedUser.name}`);
        setPrivateMessage("");
        setMessageDialogOpen(false);
        
        // Ask if they want to go to messages page
        const goToMessages = window.confirm("Message sent! Would you like to go to your messages page?");
        if (goToMessages) {
          navigate("/student/messages");
        }
      }
    } catch (error: any) {
      toast.error(`Failed to send message: ${error.message}`);
    }
  };

  const openPrivateMessageDialog = (userData: { id: string; name: string; avatar_url: string | null }) => {
    if (!user) {
      toast.error("You need to be logged in to send messages");
      return;
    }
    
    if (userData.id === user.id) {
      toast.error("You can't send messages to yourself");
      return;
    }
    
    setSelectedUser(userData);
    setMessageDialogOpen(true);
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
            <Card key={topic.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-xl">{topic.title}</CardTitle>
                    <div className="flex items-center mt-2 space-x-2">
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={topic.author?.avatar_url || ''} alt={topic.author?.full_name} />
                        <AvatarFallback>{topic.author?.full_name?.charAt(0) || 'U'}</AvatarFallback>
                      </Avatar>
                      <div className="text-sm text-muted-foreground">
                        {topic.author?.full_name} • {new Date(topic.created_at).toLocaleDateString()}
                      </div>
                      {topic.author?.id && topic.author?.id !== user?.id && (
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => openPrivateMessageDialog({
                            id: topic.author.id,
                            name: topic.author.full_name,
                            avatar_url: topic.author.avatar_url
                          })}
                          className="text-xs"
                        >
                          <MessageSquare className="h-3 w-3 mr-1" />
                          Message
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="mb-4">{topic.content}</p>
                <div className="space-y-4">
                  {topic.replies?.map((reply) => (
                    <div key={reply.id} className="pl-4 border-l-2">
                      <div className="flex items-center mb-2 space-x-2">
                        <Avatar className="h-6 w-6">
                          <AvatarImage src={reply.author?.avatar_url || ''} alt={reply.author?.full_name} />
                          <AvatarFallback>{reply.author?.full_name?.charAt(0) || 'U'}</AvatarFallback>
                        </Avatar>
                        <div className="text-sm text-muted-foreground">
                          {reply.author?.full_name} • {new Date(reply.created_at).toLocaleDateString()}
                        </div>
                        {reply.author?.id && reply.author?.id !== user?.id && (
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => openPrivateMessageDialog({
                              id: reply.author.id,
                              name: reply.author.full_name,
                              avatar_url: reply.author.avatar_url
                            })}
                            className="text-xs"
                          >
                            <MessageSquare className="h-3 w-3 mr-1" />
                            Message
                          </Button>
                        )}
                      </div>
                      <p>{reply.content}</p>
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

          {topics.length === 0 && (
            <Card>
              <CardContent className="p-6 text-center">
                <p className="text-muted-foreground">No topics yet. Be the first to start a discussion!</p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Private Message Dialog */}
        <Dialog open={messageDialogOpen} onOpenChange={setMessageDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Message to {selectedUser?.name}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-2">
              <div className="flex items-center space-x-2">
                <Avatar>
                  <AvatarImage src={selectedUser?.avatar_url || ''} alt={selectedUser?.name || 'User'} />
                  <AvatarFallback>{selectedUser?.name?.charAt(0) || 'U'}</AvatarFallback>
                </Avatar>
                <div>{selectedUser?.name}</div>
              </div>
              <div className="flex flex-col space-y-4">
                <Input
                  placeholder="Type your message here..."
                  value={privateMessage}
                  onChange={(e) => setPrivateMessage(e.target.value)}
                  className="flex-1"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendPrivateMessage();
                    }
                  }}
                />
                <Button onClick={handleSendPrivateMessage} className="self-end">
                  <Send className="h-4 w-4 mr-2" />
                  Send Message
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}
