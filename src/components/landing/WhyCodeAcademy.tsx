
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Brain, 
  Clock, 
  Users, 
  Trophy, 
  Target, 
  Rocket,
  Heart,
  Shield
} from "lucide-react";

export const WhyCodeAcademy = () => {
  const advantages = [
    {
      icon: <Brain className="h-12 w-12 text-primary" />,
      title: "Apprentissage Adaptatif",
      description: "Notre IA personnalise votre parcours selon votre rythme et style d'apprentissage pour maximiser vos résultats.",
      color: "bg-primary/10"
    },
    {
      icon: <Clock className="h-12 w-12 text-accent" />,
      title: "Formation Flexible",
      description: "Apprenez à votre rythme, 24h/24 et 7j/7, avec un accès illimité à tous nos contenus et exercices.",
      color: "bg-accent/10"
    },
    {
      icon: <Users className="h-12 w-12 text-blue-600" />,
      title: "Mentorat Expert",
      description: "Bénéficiez de l'accompagnement de développeurs expérimentés pour accélérer votre progression.",
      color: "bg-blue-100"
    },
    {
      icon: <Trophy className="h-12 w-12 text-yellow-600" />,
      title: "Projets Professionnels",
      description: "Construisez un portfolio impressionnant avec des projets utilisés par de vraies entreprises.",
      color: "bg-yellow-100"
    },
    {
      icon: <Target className="h-12 w-12 text-purple-600" />,
      title: "Objectifs Clairs",
      description: "Suivez votre progression avec des objectifs précis et des jalons mesurables vers l'emploi.",
      color: "bg-purple-100"
    },
    {
      icon: <Shield className="h-12 w-12 text-green-600" />,
      title: "Garantie Emploi",
      description: "92% de nos diplômés trouvent un emploi dans les 6 mois ou nous remboursons votre formation.",
      color: "bg-green-100"
    }
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/20 bg-primary/10 mb-6">
            <Heart className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-primary">
              Pourquoi nous choisir
            </span>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">
            Code Academy fait la différence
          </h2>
          
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Nous ne sommes pas juste une plateforme de cours en ligne. 
            Nous sommes votre partenaire pour réussir votre transition vers une carrière tech.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {advantages.map((advantage, index) => (
            <Card key={index} className="group hover:shadow-xl transition-all duration-300 border-0 bg-white hover:-translate-y-2">
              <CardContent className="p-8 text-center h-full flex flex-col">
                <div className={`${advantage.color} rounded-2xl p-4 w-fit mx-auto mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  {advantage.icon}
                </div>
                
                <h3 className="text-xl font-bold mb-4 text-gray-900 group-hover:text-primary transition-colors">
                  {advantage.title}
                </h3>
                
                <p className="text-gray-600 leading-relaxed flex-grow">
                  {advantage.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Call to action */}
        <div className="text-center mt-16">
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 max-w-2xl mx-auto">
            <Rocket className="h-12 w-12 text-primary mx-auto mb-4" />
            <h3 className="text-2xl font-bold mb-4 text-gray-900">
              Prêt à transformer votre avenir ?
            </h3>
            <p className="text-gray-600 mb-6">
              Rejoignez les milliers d'étudiants qui ont déjà changé leur vie avec Code Academy.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <div className="text-sm text-gray-500">
                ✓ Essai gratuit de 7 jours
              </div>
              <div className="text-sm text-gray-500">
                ✓ Support 24/7
              </div>
              <div className="text-sm text-gray-500">
                ✓ Certificat inclus
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
