
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
  Zap,
  Terminal,
  Cpu,
  Database
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

  const techStack = [
    { name: "Python", icon: Terminal, color: "text-blue-600" },
    { name: "JavaScript", icon: Code, color: "text-indigo-600" },
    { name: "Java", icon: Cpu, color: "text-slate-600" },
    { name: "SQL", icon: Database, color: "text-cyan-600" }
  ];

  return (
    <section className="relative py-20 code-academy-hero overflow-hidden">
      {/* Background Tech Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 left-10 text-primary">
          <Code className="h-8 w-8" />
        </div>
        <div className="absolute top-20 right-20 text-accent">
          <Terminal className="h-6 w-6" />
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
                  Plateforme d'apprentissage tech #1 au Maroc
                </span>
              </div>

              {/* Titre principal */}
              <div>
                <h1 className="text-5xl md:text-6xl font-bold mb-6 text-slate-900">
                  <span className="text-primary">Code</span> Academy
                </h1>
                <h2 className="text-2xl md:text-3xl font-semibold text-slate-700 mb-6">
                  Maîtrisez la programmation professionnelle
                </h2>
                <p className="text-xl text-slate-600 leading-relaxed">
                  Formation complète en développement logiciel avec une approche pratique, 
                  des projets concrets et un accompagnement expert pour réussir votre carrière tech.
                </p>
              </div>

              {/* Tech Stack Preview */}
              <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">Technologies enseignées</h3>
                <div className="grid grid-cols-2 gap-4">
                  {techStack.map((tech, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors">
                      <tech.icon className={`h-5 w-5 ${tech.color}`} />
                      <span className="font-medium text-slate-700">{tech.name}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Features list */}
              <div className="grid grid-cols-2 gap-4">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-success" />
                    <span className="text-slate-700 font-medium">{feature}</span>
                  </div>
                ))}
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  size="lg"
                  className="text-lg px-8 py-4 bg-primary hover:bg-primary/90 text-white rounded-lg shadow-lg hover:shadow-xl transition-all"
                  onClick={() => navigate("/auth")}
                >
                  <Play className="h-5 w-5 mr-2" />
                  Commencer gratuitement
                </Button>
                
                <Button
                  size="lg"
                  variant="outline"
                  className="text-lg px-8 py-4 border-primary text-primary hover:bg-primary/5 rounded-lg"
                  onClick={() => navigate("/auth")}
                >
                  <BookOpen className="h-5 w-5 mr-2" />
                  Explorer les formations
                </Button>
              </div>

              {/* Trust indicators */}
              <div className="flex items-center gap-6 text-sm text-slate-500">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-success" />
                  <span>Accès gratuit aux bases</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-success" />
                  <span>Certificats reconnus</span>
                </div>
              </div>
            </div>

            {/* Contenu droite - Illustration */}
            <div className="relative">
              <div className="bg-white rounded-xl shadow-2xl p-8 border border-slate-100">
                <div className="space-y-6">
                  {/* Code Editor Mockup */}
                  <div className="bg-slate-900 rounded-lg p-4 text-white font-mono text-sm">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-3 h-3 rounded-full bg-red-500"></div>
                      <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                      <div className="w-3 h-3 rounded-full bg-green-500"></div>
                      <span className="ml-4 text-slate-400">main.py</span>
                    </div>
                    <div className="space-y-2">
                      <div><span className="text-blue-400">def</span> <span className="text-white">learn_programming</span>():</div>
                      <div className="ml-4"><span className="text-green-400"># Votre parcours commence ici</span></div>
                      <div className="ml-4"><span className="text-purple-400">skills</span> = [<span className="text-orange-400">"Python"</span>, <span className="text-orange-400">"JavaScript"</span>]</div>
                      <div className="ml-4"><span className="text-blue-400">return</span> <span className="text-orange-400">"Carrière tech réussie!"</span></div>
                    </div>
                  </div>
                  
                  {/* Progress indicator */}
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600">Progression du module</span>
                      <span className="text-primary font-semibold">85%</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2">
                      <div className="bg-primary h-2 rounded-full" style={{ width: '85%' }}></div>
                    </div>
                  </div>

                  {/* Achievement badges */}
                  <div className="flex gap-3">
                    <div className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-medium">
                      Python Maîtrisé
                    </div>
                    <div className="bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full text-xs font-medium">
                      5 Projets complétés
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Floating elements */}
              <div className="absolute -top-4 -right-4 bg-success text-white p-3 rounded-xl shadow-lg">
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
                <div className="bg-white rounded-xl p-6 shadow-lg border border-slate-100 hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                  <div className="mb-4 inline-block p-3 bg-primary/10 rounded-xl">
                    <stat.icon className="h-8 w-8 text-primary" />
                  </div>
                  <div className="text-3xl font-bold text-slate-900 mb-2">
                    {stat.number}
                  </div>
                  <div className="text-slate-600 font-medium">
                    {stat.label}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Section sur le Maroc placée en bas */}
      <div className="mt-20 py-16 bg-gradient-to-r from-blue-50 to-white">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold text-slate-900 mb-6">
              Plateforme 100% marocaine pour votre réussite
            </h3>
            <p className="text-lg text-slate-600 leading-relaxed">
              Notre plateforme est spécialement conçue pour répondre aux besoins des apprenants locaux 
              en proposant des contenus pédagogiques innovants et adaptés aux réalités du marché du travail marocain. 
              Grâce à une technologie moderne et une interface intuitive, nous facilitons l'accès à un apprentissage 
              de qualité, accessible à tous, et encourageons le développement des compétences dans divers domaines 
              informatiques et technologiques.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
