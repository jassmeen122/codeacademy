
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain, Code, MessageSquare, Bot, Book, Terminal } from "lucide-react";

export const AIAssistantInfo = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-primary" />
            À propos de l'Assistant IA
          </CardTitle>
          <CardDescription>
            Découvrez comment notre assistant IA peut vous aider à apprendre la programmation
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>
            Notre assistant IA est conçu pour vous aider dans votre parcours d'apprentissage en programmation. 
            Posez-lui des questions sur n'importe quel langage de programmation, demandez de l'aide pour déboguer 
            votre code, ou obtenez des explications sur des concepts techniques.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <FeatureCard 
              icon={<Code />} 
              title="Aide au code" 
              description="Partagez votre code pour obtenir de l'aide au débogage ou des suggestions d'amélioration" 
            />
            <FeatureCard 
              icon={<MessageSquare />} 
              title="Questions techniques" 
              description="Posez des questions sur des concepts, des syntaxes ou des bibliothèques" 
            />
            <FeatureCard 
              icon={<Terminal />} 
              title="Exemples de code" 
              description="Obtenez des exemples pratiques pour illustrer des concepts" 
            />
            <FeatureCard 
              icon={<Book />} 
              title="Apprentissage guidé" 
              description="Recevez des explications adaptées à votre niveau" 
            />
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bot className="h-5 w-5 text-primary" />
            Comment utiliser l'assistant
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>Pour tirer le meilleur parti de l'assistant IA :</p>
          
          <ol className="list-decimal ml-6 space-y-2">
            <li>Soyez spécifique dans vos questions</li>
            <li>Pour les problèmes de code, partagez le contexte et le code concerné</li>
            <li>Utilisez le bouton "Ajouter Code" pour partager des extraits de code avec la syntaxe appropriée</li>
            <li>Précisez le langage de programmation concerné</li>
            <li>Si une réponse n'est pas claire, n'hésitez pas à demander des clarifications</li>
          </ol>
          
          <div className="p-4 border rounded-md bg-muted/50 mt-4">
            <h4 className="font-medium mb-2">Exemples de questions efficaces :</h4>
            <ul className="list-disc ml-6 space-y-1">
              <li>"Comment déclarer une fonction récursive en JavaScript?"</li>
              <li>"Pourquoi mon code Python génère-t-il une erreur 'IndexError: list index out of range'?"</li>
              <li>"Quelle est la différence entre let, const et var en JavaScript?"</li>
              <li>"Comment optimiser cette boucle for dans mon code Java?"</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const FeatureCard = ({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) => (
  <div className="p-4 border rounded-md flex gap-3 items-start">
    <div className="bg-primary/10 p-2 rounded-md text-primary">
      {icon}
    </div>
    <div>
      <h3 className="font-medium">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  </div>
);
