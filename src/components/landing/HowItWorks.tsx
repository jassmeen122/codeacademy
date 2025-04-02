
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { UserPlus, BookOpen, Code, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

export const HowItWorks = () => {
  const steps = [
    {
      icon: <UserPlus className="h-12 w-12" />,
      title: "S'inscrire ou se connecter",
      description: "Créez un compte pour suivre votre progression et accéder à tous nos cours.",
      color: "from-blue-500 to-indigo-600",
      textColor: "text-blue-600"
    },
    {
      icon: <BookOpen className="h-12 w-12" />,
      title: "Choisir un cours",
      description: "Parcourez notre sélection de cours et choisissez celui qui correspond à vos objectifs.",
      color: "from-purple-500 to-pink-600",
      textColor: "text-purple-600"
    },
    {
      icon: <Code className="h-12 w-12" />,
      title: "Commencer à apprendre",
      description: "Accédez aux vidéos, PDFs et exercices interactifs pour maîtriser votre langage de programmation.",
      color: "from-amber-500 to-orange-600",
      textColor: "text-amber-600"
    }
  ];

  return (
    <section className="py-24 bg-gradient-to-b from-white to-blue-50 relative overflow-hidden">
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.05] pointer-events-none"></div>
      
      <div className="container mx-auto px-4 relative">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-6 bg-gradient-to-r from-indigo-700 via-purple-700 to-pink-700 bg-clip-text text-transparent">
            Comment ça marche
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            Notre plateforme d'apprentissage est conçue pour vous permettre d'apprendre facilement et efficacement, avec un parcours guidé en trois étapes simples.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {steps.map((step, index) => (
            <div key={index} className="relative group">
              <Card className="h-full transition-all duration-300 group-hover:shadow-xl border-0 overflow-hidden rounded-xl bg-white shadow-lg">
                <div className={cn("h-2 w-full bg-gradient-to-r", step.color)}></div>
                <CardContent className="pt-8 pb-8 px-8">
                  <div className="mb-6 flex justify-center">
                    <div className={cn("p-4 rounded-lg bg-gradient-to-br", step.color, "bg-opacity-10")}>
                      <div className="text-white">{step.icon}</div>
                    </div>
                  </div>
                  <h3 className={cn("text-2xl font-bold mb-4 text-center", step.textColor)}>
                    {step.title}
                  </h3>
                  <p className="text-gray-600 text-center">
                    {step.description}
                  </p>
                  
                  {index < steps.length - 1 && (
                    <div className="hidden md:block absolute top-1/2 -right-6 transform -translate-y-1/2 z-10">
                      <ArrowRight className="h-8 w-8 text-gray-300" />
                    </div>
                  )}
                  
                  <div 
                    className={cn(
                      "absolute -top-3 -left-3 rounded-full shadow-md h-8 w-8 flex items-center justify-center font-bold text-lg border border-gray-100",
                      "group-hover:text-white transition-all duration-300"
                    )}
                    style={{
                      background: index === 0 
                        ? "linear-gradient(to right, #4F46E5, #4338CA)"
                        : index === 1
                          ? "linear-gradient(to right, #9333EA, #C026D3)"
                          : "linear-gradient(to right, #F59E0B, #EA580C)"
                    }}
                  >
                    {index + 1}
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
