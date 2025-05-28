
import React from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Code2, Sparkles, Zap } from "lucide-react";

export const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <section className="relative py-20 bg-gradient-to-br from-background via-background/95 to-background/90 overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-cyber-grid bg-[size:50px_50px] opacity-10" />
      <div className="absolute inset-0 bg-gradient-to-br from-neon-blue/5 via-transparent to-neon-purple/5" />
      
      {/* Floating particles effect */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-neon-blue rounded-full animate-pulse opacity-60" />
        <div className="absolute top-3/4 right-1/4 w-1 h-1 bg-neon-green rounded-full animate-pulse opacity-40 animation-delay-1000" />
        <div className="absolute top-1/2 left-3/4 w-3 h-3 bg-neon-purple rounded-full animate-pulse opacity-50 animation-delay-2000" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center max-w-4xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/20 bg-primary/5 backdrop-blur-sm mb-8 animate-fadeIn">
            <Sparkles className="h-4 w-4 text-primary animate-pulse" />
            <span className="text-sm font-medium terminal-text">Intelligence Artificielle × Apprentissage</span>
          </div>

          {/* Main title with typing effect */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 animate-fadeIn">
            <span className="text-gradient bg-gradient-to-r from-primary via-accent to-neon-purple bg-clip-text text-transparent animate-hologram">
              CodeAcademy
            </span>
            <br />
            <span className="text-neon relative">
              Intelligence AI
              <div className="absolute -top-2 -right-4 w-6 h-6 border-2 border-neon-cyan rounded-full animate-circuit-pulse" />
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto animate-fadeIn animation-delay-300">
            Plongez dans l'univers du développement avec notre plateforme d'apprentissage
            <span className="text-neon mx-2 animate-pulse">futuriste</span>
            alimentée par l'IA
          </p>

          {/* Description */}
          <p className="text-lg text-muted-foreground/80 mb-12 max-w-2xl mx-auto animate-fadeIn animation-delay-500">
            Apprenez Python, JavaScript, Java et bien plus avec des cours interactifs,
            des projets pratiques et un assistant IA personnel.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fadeIn animation-delay-700">
            <Button
              size="lg"
              variant="cyber"
              className="text-lg px-8 py-4 group scan-effect"
              onClick={() => navigate("/auth")}
            >
              <Zap className="h-5 w-5 mr-2 group-hover:animate-pulse" />
              Commencer l'aventure
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 group-hover:animate-data-flow" />
            </Button>
            
            <Button
              size="lg"
              variant="outline"
              className="text-lg px-8 py-4 group border-primary/30 hover:border-primary cyber-border"
              onClick={() => navigate("/auth")}
            >
              <Code2 className="h-5 w-5 mr-2 group-hover:animate-pulse" />
              Explorer les cours
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 max-w-3xl mx-auto animate-fadeIn animation-delay-1000">
            {[
              { number: "10+", label: "Langages de programmation", icon: Code2 },
              { number: "50+", label: "Projets pratiques", icon: Zap },
              { number: "24/7", label: "Assistant IA disponible", icon: Sparkles }
            ].map((stat, index) => (
              <div 
                key={index} 
                className="text-center group cursor-pointer"
              >
                <div className="neon-card p-6 hover:scale-105 transition-all duration-300">
                  <stat.icon className="h-8 w-8 text-primary mx-auto mb-3 group-hover:animate-pulse" />
                  <div className="text-3xl font-bold text-neon mb-2 group-hover:animate-neon-pulse">
                    {stat.number}
                  </div>
                  <div className="text-sm text-muted-foreground group-hover:text-foreground/80 transition-colors">
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
