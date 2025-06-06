
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Code, 
  Terminal, 
  Brain, 
  Users, 
  BookOpen, 
  Award,
  Zap,
  Target
} from "lucide-react";

export const TechFeaturesSection: React.FC = () => {
  const features = [
    {
      icon: <Terminal className="h-12 w-12 text-blue-600" />,
      title: "Éditeur de Code Interactif",
      description: "Écrivez et testez votre code en temps réel avec notre environnement de développement intégré"
    },
    {
      icon: <Brain className="h-12 w-12 text-green-600" />,
      title: "Assistant IA Personnalisé",
      description: "Obtenez de l'aide instantanée et des conseils personnalisés grâce à notre intelligence artificielle"
    },
    {
      icon: <BookOpen className="h-12 w-12 text-purple-600" />,
      title: "Projets Concrets",
      description: "Construisez des applications réelles qui enrichiront votre portfolio professionnel"
    },
    {
      icon: <Users className="h-12 w-12 text-orange-600" />,
      title: "Communauté Active",
      description: "Rejoignez une communauté de développeurs passionnés et partagez vos expériences"
    },
    {
      icon: <Award className="h-12 w-12 text-red-600" />,
      title: "Certifications",
      description: "Obtenez des certificats reconnus pour valider vos compétences acquises"
    },
    {
      icon: <Target className="h-12 w-12 text-indigo-600" />,
      title: "Suivi Personnalisé",
      description: "Suivez vos progrès avec des statistiques détaillées et des recommandations adaptées"
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center p-2 bg-blue-50 rounded-xl mb-4 border border-blue-200">
            <Code className="text-blue-600 mr-2 h-5 w-5" /> 
            <span className="font-medium text-blue-700">Plateforme Complète</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
            Tout ce dont vous avez besoin pour apprendre
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Notre plateforme offre tous les outils et ressources nécessaires pour maîtriser 
            la programmation de manière efficace et structurée.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <Card key={index} className="edu-card group bg-white border-gray-200 hover:border-blue-300">
              <CardContent className="p-8 text-center">
                <div className="flex justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-4 text-gray-900 group-hover:text-blue-600 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
