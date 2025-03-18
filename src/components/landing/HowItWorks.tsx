
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { BookOpen, User, Code } from "lucide-react";

export const HowItWorks = () => {
  const steps = [
    {
      icon: <User className="h-12 w-12 text-primary" />,
      title: "S'inscrire ou se connecter",
      description: "Créez un compte pour suivre votre progression et accéder à tous nos cours."
    },
    {
      icon: <BookOpen className="h-12 w-12 text-primary" />,
      title: "Choisir un cours",
      description: "Parcourez notre sélection de cours et choisissez celui qui correspond à vos objectifs."
    },
    {
      icon: <Code className="h-12 w-12 text-primary" />,
      title: "Commencer à apprendre",
      description: "Accédez aux vidéos, PDFs et exercices interactifs pour maîtriser votre langage de programmation."
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Comment ça marche</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Notre plateforme d'apprentissage est conçue pour vous permettre d'apprendre facilement et efficacement.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <Card key={index} className="text-center hover:shadow-md transition-shadow">
              <CardContent className="pt-6">
                <div className="flex justify-center mb-4">
                  {step.icon}
                </div>
                <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
