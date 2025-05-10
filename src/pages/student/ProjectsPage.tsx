
import { useState } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Loader2, Lightbulb, FileText } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuthState } from "@/hooks/useAuthState";

const ProjectsPage = () => {
  const { user } = useAuthState();
  const [projectIdea, setProjectIdea] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!projectIdea.trim()) {
      toast.error("Veuillez décrire votre idée de projet");
      return;
    }

    setIsSubmitting(true);
    setIsLoading(true);
    
    try {
      // Call the AI assistant edge function
      const { data, error } = await supabase.functions.invoke('ai-assistant', {
        body: { 
          prompt: `Je suis un développeur et j'ai besoin d'aide pour conceptualiser un projet. Voici mon cahier des charges: ${projectIdea}. 
          Crée un concept simple de page web qui répond à ce besoin. 
          Fournis une description détaillée de l'interface utilisateur et des fonctionnalités principales.
          Structuré en HTML sémantique basique avec des classes Tailwind CSS pour le style.`,
          messageHistory: [],
        }
      });

      if (error) throw new Error(error.message);
      
      // Process the AI response
      if (data?.reply?.content) {
        setAiResponse(data.reply.content);
      } else {
        throw new Error("Le service d'IA n'a pas pu générer de réponse");
      }
      
      // Success message
      toast.success("Votre projet a été conceptualisé avec succès!");
      
    } catch (error) {
      console.error("Error generating project concept:", error);
      toast.error("Une erreur s'est produite lors de la génération du concept");
    } finally {
      setIsSubmitting(false);
      setIsLoading(false);
    }
  };

  // Function to extract HTML from AI response if it contains code blocks
  const getHtmlPreview = (response: string) => {
    // Check if the response contains code blocks
    const htmlMatch = response.match(/```html([\s\S]*?)```/);
    if (htmlMatch && htmlMatch[1]) {
      return htmlMatch[1].trim();
    }
    return null;
  };

  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Projets</h1>
          
          <div className="mb-8">
            <p className="text-muted-foreground mb-4">
              Décrivez votre idée de projet ou votre besoin, et notre assistant IA vous aidera à le conceptualiser.
            </p>
            
            <Card className={aiResponse ? "mb-8" : ""}>
              <CardContent className="pt-6">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <Textarea 
                    placeholder="Décrivez votre projet, ses fonctionnalités, son public cible, et tout autre détail pertinent..."
                    value={projectIdea}
                    onChange={(e) => setProjectIdea(e.target.value)}
                    className="min-h-[200px] resize-none"
                    disabled={isSubmitting}
                  />
                  
                  <div className="flex justify-end">
                    <Button 
                      type="submit" 
                      disabled={isSubmitting || !projectIdea.trim()}
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Génération en cours...
                        </>
                      ) : (
                        <>
                          <Lightbulb className="mr-2 h-4 w-4" />
                          Générer un concept
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
            
            {isLoading && !aiResponse && (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
                <p className="text-lg font-medium">Conceptualisation en cours...</p>
                <p className="text-sm text-muted-foreground mt-2">Notre assistant IA transforme votre idée en concept</p>
              </div>
            )}
            
            {aiResponse && (
              <Card className="bg-gray-50 border-t-4 border-primary">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-2 mb-4 text-lg font-medium text-primary">
                    <Lightbulb className="h-5 w-5" />
                    <h2>Concept de projet</h2>
                  </div>
                  
                  <div className="prose max-w-none">
                    {/* Display formatted HTML if code blocks exist */}
                    {getHtmlPreview(aiResponse) ? (
                      <div className="mb-4">
                        <div className="bg-white rounded-md p-4 border mb-4">
                          <div dangerouslySetInnerHTML={{ 
                            __html: getHtmlPreview(aiResponse) || "" 
                          }} />
                        </div>
                        <div className="border-t pt-4 mt-4">
                          <h3 className="text-sm font-medium flex items-center gap-2 mb-2">
                            <FileText className="h-4 w-4" />
                            Description complète
                          </h3>
                          <div className="whitespace-pre-wrap text-sm">
                            {aiResponse.replace(/```html[\s\S]*?```/g, '')}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="whitespace-pre-wrap">
                        {aiResponse}
                      </div>
                    )}
                  </div>
                  
                  <div className="flex justify-end mt-4">
                    <Button 
                      variant="outline" 
                      onClick={() => setProjectIdea("")}
                    >
                      Nouveau projet
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ProjectsPage;
