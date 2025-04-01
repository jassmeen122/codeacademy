
import React from "react";
import { Card } from "@/components/ui/card";
import { Brain, Code, Terminal, Info, Check } from "lucide-react";

export const AIAssistantInfo: React.FC = () => {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-medium flex items-center gap-2 mb-2">
          <Brain className="h-5 w-5 text-primary" />
          Assistant IA de Programmation
        </h3>
        <p className="text-sm text-muted-foreground">
          Un assistant spécialisé en programmation pour vous aider avec votre code et répondre à vos questions techniques.
        </p>
      </div>
      
      <div className="space-y-2">
        <h4 className="font-medium">Capacités:</h4>
        <div className="space-y-2">
          <div className="flex items-start gap-2">
            <Check className="h-4 w-4 text-green-500 mt-0.5" />
            <div className="text-sm">
              <span className="font-medium">Questions sur le code</span>
              <p className="text-muted-foreground">Posez des questions sur Python, JavaScript, Java, C/C++, PHP et SQL.</p>
            </div>
          </div>
          
          <div className="flex items-start gap-2">
            <Check className="h-4 w-4 text-green-500 mt-0.5" />
            <div className="text-sm">
              <span className="font-medium">Analyse de code</span>
              <p className="text-muted-foreground">Partagez votre code pour recevoir des suggestions d'amélioration.</p>
            </div>
          </div>
          
          <div className="flex items-start gap-2">
            <Check className="h-4 w-4 text-green-500 mt-0.5" />
            <div className="text-sm">
              <span className="font-medium">Explication des erreurs</span>
              <p className="text-muted-foreground">Comprenez les erreurs dans votre code avec des explications claires.</p>
            </div>
          </div>
          
          <div className="flex items-start gap-2">
            <Check className="h-4 w-4 text-green-500 mt-0.5" />
            <div className="text-sm">
              <span className="font-medium">Concepts de programmation</span>
              <p className="text-muted-foreground">Apprenez sur les algorithmes, les structures de données et les bonnes pratiques.</p>
            </div>
          </div>
        </div>
      </div>
      
      <Card className="bg-muted/50 p-3">
        <div className="flex items-start gap-2">
          <Info className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
          <p className="text-xs text-muted-foreground">
            Pour de meilleurs résultats, soyez précis dans vos questions et fournissez des contextes clairs. Si l'assistant ne répond pas correctement, essayez de reformuler votre question ou utilisez le bouton "Changer de modèle".
          </p>
        </div>
      </Card>
      
      <div className="border-t pt-4">
        <h4 className="font-medium mb-2">Exemples de questions:</h4>
        <ul className="space-y-2 text-sm">
          <li className="flex items-center gap-2">
            <Terminal className="h-4 w-4 text-primary" />
            "Comment créer une fonction récursive en Python?"
          </li>
          <li className="flex items-center gap-2">
            <Terminal className="h-4 w-4 text-primary" />
            "Explique-moi les closures en JavaScript."
          </li>
          <li className="flex items-center gap-2">
            <Terminal className="h-4 w-4 text-primary" />
            "Quelle est la différence entre un tableau et une liste chaînée?"
          </li>
          <li className="flex items-center gap-2">
            <Terminal className="h-4 w-4 text-primary" />
            "Comment optimiser une requête SQL qui est lente?"
          </li>
        </ul>
      </div>
    </div>
  );
};
