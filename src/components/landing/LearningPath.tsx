
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { 
  BookOpen, 
  Code, 
  Users, 
  Award, 
  ArrowRight,
  CheckCircle,
  PlayCircle,
  Target
} from "lucide-react";

export const LearningPath = () => {
  const steps = [
    {
      step: "01",
      icon: <BookOpen className="h-8 w-8 text-primary" />,
      title: "Fondamentaux",
      description: "Apprenez les bases de la programmation avec des concepts clairs et des exemples pratiques",
      duration: "2-4 semaines",
      color: "bg-blue-50 border-blue-200"
    },
    {
      step: "02",
      icon: <Code className="h-8 w-8 text-blue-600" />,
      title: "Pratique intensive",
      description: "Développez vos compétences avec des exercices progressifs et des projets guidés",
      duration: "4-6 semaines",
      color: "bg-blue-100 border-blue-300"
    },
    {
      step: "03",
      icon: <Target className="h-8 w-8 text-blue-700" />,
      title: "Projets avancés",
      description: "Créez des applications complètes et construisez votre portfolio professionnel",
      duration: "6-8 semaines",
      color: "bg-blue-50 border-blue-200"
    },
    {
      step: "04",
      icon: <Award className="h-8 w-8 text-blue-800" />,
      title: "Certification",
      description: "Obtenez votre certification et accédez à notre réseau d'entreprises partenaires",
      duration: "1-2 semaines",
      color: "bg-blue-100 border-blue-300"
    }
  ];

  const benefits = [
    "Accompagnement personnalisé 24/7",
    "Projets basés sur des cas réels",
    "Communauté active de développeurs",
    "Accès à vie aux contenus",
    "Certification reconnue par l'industrie",
    "Support pour l'insertion professionnelle"
  ];

  return (
    <section className="py-20 bg-slate-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-slate-900">
            Votre parcours d'apprentissage
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            Un programme structuré et progressif pour vous mener de débutant à développeur professionnel. 
            Chaque étape est conçue pour maximiser votre apprentissage et votre réussite.
          </p>
        </div>

        {/* Learning Steps */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              <Card className={`${step.color} hover:shadow-xl transition-all duration-300 border-2 group hover:-translate-y-2`}>
                <CardContent className="p-8 text-center">
                  <div className="text-6xl font-bold text-blue-200 mb-4">
                    {step.step}
                  </div>
                  
                  <div className="bg-white rounded-xl p-4 w-fit mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-sm">
                    {step.icon}
                  </div>
                  
                  <h3 className="text-xl font-bold mb-3 text-slate-900">
                    {step.title}
                  </h3>
                  
                  <p className="text-slate-600 mb-4 leading-relaxed">
                    {step.description}
                  </p>
                  
                  <div className="bg-white rounded-lg px-3 py-1 text-sm font-medium text-slate-700">
                    {step.duration}
                  </div>
                </CardContent>
              </Card>
              
              {/* Arrow connector */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                  <ArrowRight className="h-8 w-8 text-blue-300" />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Benefits Section */}
        <div className="bg-white rounded-2xl p-8 blue-shadow-lg border border-blue-100">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-3xl font-bold mb-6 text-slate-900">
                Avantages de notre méthode
              </h3>
              <p className="text-lg text-slate-600 mb-8 leading-relaxed">
                Notre approche pédagogique unique combine théorie solide et pratique intensive. 
                Vous apprenez en construisant des projets réels avec l'accompagnement d'experts.
              </p>
              
              <div className="grid grid-cols-1 gap-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-blue-600 flex-shrink-0" />
                    <span className="text-slate-700 font-medium">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="relative">
              <div className="bg-slate-900 rounded-xl p-6 text-white font-mono text-sm">
                <div className="flex items-center gap-2 mb-4">
                  <PlayCircle className="h-5 w-5 text-blue-400" />
                  <span className="text-slate-400">Code Academy Learning Platform</span>
                </div>
                <div className="space-y-2">
                  <div><span className="text-blue-400">class</span> <span className="text-white">Student</span>:</div>
                  <div className="ml-4"><span className="text-blue-400">def</span> <span className="text-white">learn</span>(<span className="text-blue-300">self</span>):</div>
                  <div className="ml-8"><span className="text-blue-500"># Étude des concepts</span></div>
                  <div className="ml-8"><span className="text-blue-300">self</span>.<span className="text-white">practice</span>()</div>
                  <div className="ml-8"><span className="text-blue-300">self</span>.<span className="text-white">build_projects</span>()</div>
                  <div className="ml-8"><span className="text-blue-400">return</span> <span className="text-blue-200">"Développeur professionnel"</span></div>
                </div>
              </div>
              
              <div className="absolute -bottom-4 -right-4 bg-primary text-white p-3 rounded-xl shadow-lg">
                <Code className="h-6 w-6" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
