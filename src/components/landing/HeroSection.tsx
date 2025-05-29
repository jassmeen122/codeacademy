
import React from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Code2, Sparkles, Zap, Bot, Cpu, CircuitBoard } from "lucide-react";

export const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <section className="relative py-20 overflow-hidden">
      {/* Background effects futuristes */}
      <div className="absolute inset-0 cyber-grid opacity-20" />
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10" />
      <div className="absolute inset-0 circuit-pattern opacity-10" />
      
      {/* Particules flottantes cyber */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-3 h-3 bg-primary rounded-full animate-cyber-pulse" />
        <div className="absolute top-3/4 right-1/4 w-2 h-2 bg-accent rounded-full animate-cyber-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-3/4 w-4 h-4 bg-neon-cyan rounded-full animate-cyber-pulse" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/3 right-1/3 w-2 h-2 bg-primary rounded-full animate-cyber-pulse" style={{ animationDelay: '3s' }} />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center max-w-5xl mx-auto">
          {/* Badge futuriste */}
          <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full border-2 border-primary/30 bg-gradient-to-r from-primary/10 to-accent/10 backdrop-blur-sm mb-8 hover:scale-105 transition-all duration-300">
            <Bot className="h-5 w-5 text-primary animate-cyber-pulse" />
            <span className="text-sm font-cyber text-primary">Intelligence Artificielle × Apprentissage Futuriste</span>
            <CircuitBoard className="h-5 w-5 text-accent animate-hologram" />
          </div>

          {/* Titre principal avec effet holographique */}
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-cyber font-bold mb-8 relative">
            <span className="bg-gradient-to-r from-primary via-accent to-neon-cyan bg-clip-text text-transparent animate-hologram">
              CodeAcademy
            </span>
            <br />
            <span className="text-4xl md:text-5xl lg:text-6xl bg-gradient-to-r from-accent via-primary to-neon-cyan bg-clip-text text-transparent relative">
              Intelligence AI
              <div className="absolute -top-3 -right-6 w-8 h-8 border-2 border-accent rounded-full animate-cyber-pulse">
                <div className="absolute inset-1 bg-accent rounded-full animate-cyber-pulse"></div>
              </div>
            </span>
          </h1>

          {/* Sous-titre */}
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-4xl mx-auto font-body leading-relaxed">
            Rejoignez l'<span className="text-primary font-cyber">Académie Numérique du Futur</span> et maîtrisez les technologies qui 
            façonnent demain avec votre <span className="text-accent font-cyber animate-cyber-pulse">Assistant IA Personnel</span>
          </p>

          {/* Description avec style terminal */}
          <div className="bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/30 rounded-lg p-6 mb-12 max-w-3xl mx-auto backdrop-blur-sm">
            <div className="font-display text-sm text-accent mb-2">// Mission.Académie.Futuriste</div>
            <p className="text-lg text-foreground font-body">
              <span className="text-primary font-cyber">Python</span>, <span className="text-accent font-cyber">JavaScript</span>, 
              <span className="text-neon-cyan font-cyber"> Java</span> et bien plus avec des cours interactifs,
              des projets pratiques et un écosystème d'apprentissage alimenté par l'IA.
            </p>
          </div>

          {/* Boutons CTA futuristes */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
            <Button
              size="lg"
              variant="cyber"
              className="text-lg px-10 py-6 group"
              onClick={() => navigate("/auth")}
            >
              <Zap className="h-6 w-6 mr-3 group-hover:animate-cyber-pulse" />
              Démarrer la Mission
            </Button>
            
            <Button
              size="lg"
              variant="outline"
              className="text-lg px-10 py-6 group"
              onClick={() => navigate("/auth")}
            >
              <Code2 className="h-6 w-6 mr-3 group-hover:animate-hologram" />
              Explorer l'Académie
            </Button>
          </div>

          {/* Statistiques cyber */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              { number: "10+", label: "Langages de Programmation", icon: Code2, color: "primary" },
              { number: "50+", label: "Projets Interactifs", icon: Cpu, color: "accent" },
              { number: "24/7", label: "Assistant IA Disponible", icon: Bot, color: "neon-cyan" }
            ].map((stat, index) => (
              <div 
                key={index} 
                className="group cursor-pointer"
              >
                <div className="hologram-card p-8 hover:scale-105 transition-all duration-500 relative overflow-hidden">
                  {/* Icon avec effet glow */}
                  <div className={`mb-6 relative inline-block p-4 rounded-full bg-gradient-to-r from-${stat.color}/20 to-${stat.color}/10 border border-${stat.color}/30`}>
                    <stat.icon className={`h-10 w-10 text-${stat.color} group-hover:animate-cyber-pulse`} />
                    <div className={`absolute inset-0 bg-${stat.color}/20 rounded-full animate-cyber-pulse`}></div>
                  </div>
                  
                  {/* Nombre avec effet cyber */}
                  <div className={`text-4xl font-cyber font-bold text-${stat.color} mb-3 group-hover:animate-hologram`}>
                    {stat.number}
                  </div>
                  
                  {/* Label */}
                  <div className="text-sm text-muted-foreground group-hover:text-foreground transition-colors font-body">
                    {stat.label}
                  </div>
                  
                  {/* Scan line effect */}
                  <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-0 group-hover:opacity-100 group-hover:animate-scan-line"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Effets de fond additionnels */}
      <div className="absolute top-10 right-10 opacity-20">
        <div className="text-primary text-xs font-display animate-matrix-rain">
          01000001<br/>
          01001001<br/>
          01000101<br/>
          01100100<br/>
          01110101<br/>
          01100011
        </div>
      </div>
      
      <div className="absolute bottom-10 left-10 opacity-20">
        <div className="text-accent text-xs font-display animate-matrix-rain" style={{ animationDelay: '1s' }}>
          01000011<br/>
          01101111<br/>
          01100100<br/>
          01100101<br/>
          01000001<br/>
          01001001
        </div>
      </div>
    </section>
  );
};
