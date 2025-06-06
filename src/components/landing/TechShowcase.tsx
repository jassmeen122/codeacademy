
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Terminal, 
  Code2, 
  Database, 
  Globe, 
  Smartphone, 
  Brain,
  Rocket,
  Shield
} from "lucide-react";

export const TechShowcase = () => {
  const technologies = [
    {
      icon: <Terminal className="h-10 w-10 text-blue-600" />,
      title: "Python",
      description: "Intelligence artificielle et data science",
      level: "Débutant à Expert",
      projects: "15+ projets",
      gradient: "from-blue-500 to-blue-600"
    },
    {
      icon: <Code2 className="h-10 w-10 text-indigo-600" />,
      title: "JavaScript",
      description: "Développement web moderne",
      level: "Tous niveaux",
      projects: "20+ projets",
      gradient: "from-indigo-500 to-indigo-600"
    },
    {
      icon: <Database className="h-10 w-10 text-green-600" />,
      title: "Bases de données",
      description: "SQL, NoSQL et gestion des données",
      level: "Intermédiaire",
      projects: "10+ projets",
      gradient: "from-green-500 to-green-600"
    },
    {
      icon: <Globe className="h-10 w-10 text-purple-600" />,
      title: "Développement Web",
      description: "Frontend et backend complets",
      level: "Tous niveaux",
      projects: "25+ projets",
      gradient: "from-purple-500 to-purple-600"
    },
    {
      icon: <Smartphone className="h-10 w-10 text-cyan-600" />,
      title: "Applications mobiles",
      description: "React Native et développement mobile",
      level: "Avancé",
      projects: "8+ projets",
      gradient: "from-cyan-500 to-cyan-600"
    },
    {
      icon: <Brain className="h-10 w-10 text-orange-600" />,
      title: "Intelligence artificielle",
      description: "Machine Learning et Deep Learning",
      level: "Expert",
      projects: "12+ projets",
      gradient: "from-orange-500 to-orange-600"
    }
  ];

  const highlights = [
    {
      icon: <Rocket className="h-8 w-8 text-primary" />,
      title: "Projets concrets",
      description: "Développez des applications réelles utilisées en entreprise"
    },
    {
      icon: <Shield className="h-8 w-8 text-success" />,
      title: "Certification reconnue",
      description: "Obtenez des certificats valorisés par les employeurs tech"
    },
    {
      icon: <Brain className="h-8 w-8 text-accent" />,
      title: "Mentorat expert",
      description: "Accompagnement par des développeurs seniors expérimentés"
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-slate-50 to-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-slate-900">
            Technologies de pointe
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            Maîtrisez les langages et frameworks les plus demandés par l'industrie tech. 
            Notre curriculum est constamment mis à jour selon les besoins du marché.
          </p>
        </div>

        {/* Technologies Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {technologies.map((tech, index) => (
            <Card key={index} className="group hover:shadow-xl transition-all duration-300 border-0 bg-white hover:-translate-y-2">
              <CardContent className="p-8">
                <div className={`bg-gradient-to-r ${tech.gradient} rounded-xl p-4 w-fit mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <div className="text-white">
                    {tech.icon}
                  </div>
                </div>
                
                <h3 className="text-xl font-bold mb-3 text-slate-900 group-hover:text-primary transition-colors">
                  {tech.title}
                </h3>
                
                <p className="text-slate-600 mb-4 leading-relaxed">
                  {tech.description}
                </p>
                
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500">Niveau:</span>
                    <span className="font-medium text-slate-700">{tech.level}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500">Projets:</span>
                    <span className="font-medium text-primary">{tech.projects}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Highlights Section */}
        <div className="bg-white rounded-2xl p-8 shadow-lg border border-slate-100">
          <h3 className="text-2xl font-bold text-center mb-8 text-slate-900">
            Pourquoi choisir Code Academy ?
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {highlights.map((highlight, index) => (
              <div key={index} className="text-center">
                <div className="bg-slate-50 rounded-xl p-4 w-fit mx-auto mb-4">
                  {highlight.icon}
                </div>
                <h4 className="text-lg font-semibold mb-2 text-slate-900">
                  {highlight.title}
                </h4>
                <p className="text-slate-600 leading-relaxed">
                  {highlight.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
