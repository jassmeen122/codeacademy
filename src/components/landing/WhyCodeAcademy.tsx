
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
  Shield,
  Code2,
  BookOpen
} from "lucide-react";

export const WhyCodeAcademy = () => {
  const advantages = [
    {
      icon: <Brain className="h-12 w-12 text-primary" />,
      title: "Formation Structurée",
      description: "Curriculum professionnel conçu par des experts de l'industrie tech pour une progression optimale.",
      color: "bg-primary/10"
    },
    {
      icon: <Code2 className="h-12 w-12 text-indigo-600" />,
      title: "Projets Concrets",
      description: "Développez des applications réelles utilisées par de vraies entreprises pour enrichir votre portfolio.",
      color: "bg-indigo-100"
    },
    {
      icon: <Users className="h-12 w-12 text-slate-600" />,
      title: "Mentorat Expert",
      description: "Accompagnement personnalisé par des développeurs seniors expérimentés de l'industrie.",
      color: "bg-slate-100"
    },
    {
      icon: <Trophy className="h-12 w-12 text-cyan-600" />,
      title: "Certifications Reconnues",
      description: "Obtenez des certifications valorisées par les employeurs dans le secteur technologique.",
      color: "bg-cyan-100"
    },
    {
      icon: <Target className="h-12 w-12 text-success" />,
      title: "Objectifs Mesurables",
      description: "Suivez votre progression avec des jalons clairs et des compétences évaluables.",
      color: "bg-green-100"
    },
    {
      icon: <Shield className="h-12 w-12 text-blue-600" />,
      title: "Garantie Placement",
      description: "90% de nos diplômés trouvent un emploi dans les 6 mois suivant la formation.",
      color: "bg-blue-100"
    }
  ];

  return (
    <section className="py-20 bg-slate-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/20 bg-primary/10 mb-6">
            <Heart className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-primary">
              Excellence pédagogique
            </span>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-slate-900">
            Pourquoi choisir Code Academy ?
          </h2>
          
          <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            Une approche professionnelle et structurée pour maîtriser les technologies 
            modernes et réussir votre transition vers une carrière dans l'informatique.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {advantages.map((advantage, index) => (
            <Card key={index} className="group hover:shadow-xl transition-all duration-300 border-0 bg-white hover:-translate-y-2">
              <CardContent className="p-8 text-center h-full flex flex-col">
                <div className={`${advantage.color} rounded-2xl p-4 w-fit mx-auto mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  {advantage.icon}
                </div>
                
                <h3 className="text-xl font-bold mb-4 text-slate-900 group-hover:text-primary transition-colors">
                  {advantage.title}
                </h3>
                
                <p className="text-slate-600 leading-relaxed flex-grow">
                  {advantage.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Call to action professionnel */}
        <div className="text-center mt-16">
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-slate-100 max-w-2xl mx-auto tech-border">
            <div className="code-academy-gradient rounded-xl p-6 mb-6">
              <Rocket className="h-12 w-12 text-white mx-auto mb-4" />
              <h3 className="text-2xl font-bold mb-4 text-white">
                Lancez votre carrière tech
              </h3>
              <p className="text-blue-100 mb-6">
                Rejoignez les milliers de développeurs formés chez Code Academy
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <BookOpen className="h-4 w-4 text-primary" />
                <span>Formation complète</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <Users className="h-4 w-4 text-primary" />
                <span>Support expert 24/7</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <Trophy className="h-4 w-4 text-primary" />
                <span>Certificat professionnel</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
