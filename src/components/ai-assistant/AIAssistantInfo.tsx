
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Code, BookOpen, CheckCircle, XCircle } from "lucide-react";

export const AIAssistantInfo = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Code className="h-5 w-5 text-primary" />
            À propos de l'assistant IA de programmation
          </CardTitle>
          <CardDescription>
            Votre assistant personnel pour l'apprentissage et la résolution de problèmes de programmation
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>
            Cet assistant IA est spécialement conçu pour vous aider avec les langages de programmation 
            suivants : Python, Java, JavaScript, C, C++, PHP et SQL. Posez des questions sur la syntaxe, 
            demandez des exemples de code, ou obtenez de l'aide pour déboguer votre code.
          </p>
          
          <div className="mt-4">
            <h3 className="text-lg font-medium mb-2 flex items-center">
              <BookOpen className="h-4 w-4 mr-2 text-primary" />
              Comment utiliser l'assistant
            </h3>
            <ul className="list-disc pl-5 space-y-2">
              <li>Posez une question spécifique sur un des langages supportés</li>
              <li>Collez votre code pour obtenir des explications ou des corrections</li>
              <li>Demandez des exemples pour illustrer des concepts de programmation</li>
              <li>Utilisez l'option "Ajouter Code" pour inclure du code dans votre question</li>
            </ul>
          </div>
          
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="text-lg font-medium mb-2 flex items-center">
                <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                Ce que l'assistant peut faire
              </h3>
              <ul className="list-disc pl-5 space-y-1">
                <li>Expliquer des concepts de programmation</li>
                <li>Fournir des exemples de code</li>
                <li>Aider au débogage</li>
                <li>Expliquer des erreurs courantes</li>
                <li>Suggérer des bonnes pratiques</li>
                <li>Répondre aux questions sur la syntaxe</li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-2 flex items-center">
                <XCircle className="h-4 w-4 mr-2 text-red-500" />
                Limitations de l'assistant
              </h3>
              <ul className="list-disc pl-5 space-y-1">
                <li>Ne répond qu'aux questions sur les 7 langages supportés</li>
                <li>Ne peut pas exécuter de code</li>
                <li>N'a pas accès à Internet</li>
                <li>Connaissances limitées sur les frameworks récents</li>
                <li>Ne peut pas aider avec des langages non supportés</li>
                <li>N'a pas accès à votre environnement de développement</li>
              </ul>
            </div>
          </div>
          
          <div className="mt-4 p-4 bg-amber-50 rounded-md border border-amber-200">
            <h3 className="font-medium text-amber-800 mb-1">Langages supportés</h3>
            <div className="flex flex-wrap gap-2">
              {["Python", "Java", "JavaScript", "C", "C++", "PHP", "SQL"].map((lang) => (
                <span key={lang} className="px-2 py-1 bg-amber-100 text-amber-800 rounded text-sm">
                  {lang}
                </span>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
