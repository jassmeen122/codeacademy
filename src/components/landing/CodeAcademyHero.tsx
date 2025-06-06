
import React from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { 
  Code, 
  BookOpen, 
  Users, 
  Award, 
  Play, 
  CheckCircle,
  Star,
  TrendingUp,
  Globe,
  Zap
} from "lucide-react";

export const CodeAcademyHero = () => {
  const navigate = useNavigate();

  const stats = [
    { number: "50,000+", label: "Étudiants actifs", icon: Users },
    { number: "12", label: "Langages enseignés", icon: Code },
    { number: "95%", label: "Taux de réussite", icon: Award },
    { number: "4.8/5", label: "Note moyenne", icon: Star }
  ];

  const features = [
    "Projets pratiques réels",
    "Mentorat personnalisé",
    "Certification reconnue",
    "Communauté active"
  ];

  return (
    <section className="relative py-20 code-academy-hero overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 left-10 text-primary">
          <Code className="h-8 w-8" />
        </div>
        <div className="absolute top-20 right-20 text-accent">
          <BookOpen className="h-6 w-6" />
        </div>
        <div className="absolute bottom-20 left-20 text-primary">
          <Zap className="h-10 w-10" />
        </div>
        <div className="absolute bottom-10 right-10 text-accent">
          <Globe className="h-7 w-7" />
        </div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-7xl mx-auto">
          {/* Section principale */}
          <div className="grid lg:grid-cols-2 gap-12 items-center mb-20">
            {/* Contenu gauche */}
            <div className="space-y-8">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/20 bg-primary/10">
                <TrendingUp className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium text-primary">
                  #1 Plateforme de programmation en France
                </span>
              </div>

              {/* Titre principal */}
              <div>
                <h1 className="text-5xl md:text-6xl font-bold mb-6 text-gray-900">
                  <span className="text-primary">Code</span> Academy
                </h1>
                <h2 className="text-2xl md:text-3xl font-semibold text-gray-700 mb-6">
                  Apprenez à coder comme un professionnel
                </h2>
                <p className="text-xl text-gray-600 leading-relaxed">
                  Maîtrisez la programmation avec notre méthode éprouvée : 
                  cours interactifs, projets concrets et accompagnement personnalisé 
                  pour transformer votre passion en carrière.
                </p>
              </div>

              {/* Features list */}
              <div className="grid grid-cols-2 gap-4">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-primary" />
                    <span className="text-gray-700 font-medium">{feature}</span>
                  </div>
                ))}
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  size="lg"
                  className="text-lg px-8 py-4 code-academy-gradient text-white rounded-xl hover:opacity-90 transition-all"
                  onClick={() => navigate("/auth")}
                >
                  <Play className="h-5 w-5 mr-2" />
                  Commencer gratuitement
                </Button>
                
                <Button
                  size="lg"
                  variant="outline"
                  className="text-lg px-8 py-4 border-primary text-primary hover:bg-primary/5 rounded-xl"
                  onClick={() => navigate("/auth")}
                >
                  <BookOpen className="h-5 w-5 mr-2" />
                  Découvrir les cours
                </Button>
              </div>

              {/* Trust indicators */}
              <div className="flex items-center gap-6 text-sm text-gray-500">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-primary" />
                  <span>100% gratuit pour commencer</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-primary" />
                  <span>Aucune carte requise</span>
                </div>
              </div>
            </div>

            {/* Contenu droite - Illustration */}
            <div className="relative">
              <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-100">
                <div className="space-y-6">
                  {/* Code Editor Mockup */}
                  <div className="bg-gray-900 rounded-lg p-4 text-white font-mono text-sm">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-3 h-3 rounded-full bg-red-500"></div>
                      <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                      <div className="w-3 h-3 rounded-full bg-green-500"></div>
                      <span className="ml-4 text-gray-400">main.py</span>
                    </div>
                    <div className="space-y-2">
                      <div><span className="text-blue-400">def</span> <span className="text-yellow-300">learn_programming</span>():</div>
                      <div className="ml-4"><span className="text-green-400"># Votre voyage commence ici</span></div>
                      <div className="ml-4"><span className="text-purple-400">skills</span> = [<span className="text-orange-400">"Python"</span>, <span className="text-orange-400">"JavaScript"</span>]</div>
                      <div className="ml-4"><span className="text-blue-400">return</span> <span className="text-orange-400">"Nouvelle carrière !"</span></div>
                    </div>
                  </div>
                  
                  {/* Progress indicator */}
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Progression du cours</span>
                      <span className="text-primary font-semibold">75%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-primary h-2 rounded-full" style={{ width: '75%' }}></div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Floating elements */}
              <div className="absolute -top-4 -right-4 bg-accent text-white p-3 rounded-xl shadow-lg">
                <Award className="h-6 w-6" />
              </div>
              <div className="absolute -bottom-4 -left-4 bg-primary text-white p-3 rounded-xl shadow-lg">
                <Code className="h-6 w-6" />
              </div>
            </div>
          </div>

          {/* Statistiques */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center group">
                <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                  <div className="mb-4 inline-block p-3 bg-primary/10 rounded-xl">
                    <stat.icon className="h-8 w-8 text-primary" />
                  </div>
                  <div className="text-3xl font-bold text-gray-900 mb-2">
                    {stat.number}
                  </div>
                  <div className="text-gray-600 font-medium">
                    {stat.label}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
