
import React from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { 
  Terminal, 
  Code2, 
  Cpu, 
  Database, 
  GitBranch, 
  Zap,
  Binary,
  Braces
} from "lucide-react";

export const TechHeroSection = () => {
  const navigate = useNavigate();

  return (
    <section className="relative py-20 overflow-hidden matrix-bg">
      {/* Matrix background effect */}
      <div className="absolute inset-0 opacity-30">
        <div className="matrix-rain absolute top-0 left-1/4 text-accent text-xs font-mono animate-matrix-rain">
          01010011<br/>01100101<br/>01100001<br/>01110010<br/>01100011<br/>01101000
        </div>
        <div className="matrix-rain absolute top-0 right-1/4 text-primary text-xs font-mono animate-matrix-rain animation-delay-1000">
          01000011<br/>01101111<br/>01100100<br/>01100101<br/>01010010<br/>01101111
        </div>
        <div className="matrix-rain absolute top-0 left-3/4 text-info text-xs font-mono animate-matrix-rain animation-delay-2000">
          01001100<br/>01100101<br/>01100001<br/>01110010<br/>01101110<br/>01001001
        </div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center max-w-5xl mx-auto">
          {/* Terminal Header */}
          <div className="neon-card cyber-border p-6 mb-12 bg-card/50 backdrop-blur-sm">
            <div className="flex items-center gap-4 mb-4">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
              </div>
              <span className="font-mono text-sm text-muted-foreground">developer@academy:~$</span>
            </div>
            
            <div className="code-block text-left">
              <span className="comment-text">// Bienvenue dans l'environnement de développement</span><br/>
              <span className="keyword-text">class</span> <span className="function-text">DevAcademy</span> {"{"}
              <br/>
              &nbsp;&nbsp;<span className="keyword-text">constructor</span>() {"{"}
              <br/>
              &nbsp;&nbsp;&nbsp;&nbsp;<span className="keyword-text">this</span>.<span className="variable-text">mission</span> = <span className="string-text">"Forger les développeurs de demain"</span>;
              <br/>
              &nbsp;&nbsp;&nbsp;&nbsp;<span className="keyword-text">this</span>.<span className="variable-text">stack</span> = [<span className="string-text">"Python"</span>, <span className="string-text">"JavaScript"</span>, <span className="string-text">"Java"</span>, <span className="string-text">"C++"</span>];
              <br/>
              &nbsp;&nbsp;{"}"}
              <br/>
              {"}"}
            </div>
          </div>

          {/* Main Title */}
          <div className="relative mb-8">
            <h1 className="text-6xl md:text-8xl font-bold mb-6 font-mono">
              <span className="text-gradient">&lt;</span>
              <span className="text-neon">DEV</span>
              <span className="text-gradient">.</span>
              <span className="text-matrix">ACADEMY</span>
              <span className="text-gradient">/&gt;</span>
              <span className="terminal-cursor"></span>
            </h1>
            
            {/* Floating Tech Icons */}
            <div className="absolute -top-10 -left-10 animate-data-flow opacity-60">
              <Terminal className="h-12 w-12 text-primary" />
            </div>
            <div className="absolute -top-6 -right-8 animate-hologram opacity-60">
              <Code2 className="h-10 w-10 text-accent" />
            </div>
            <div className="absolute -bottom-8 left-1/4 animate-neon-pulse opacity-60">
              <Cpu className="h-8 w-8 text-info" />
            </div>
          </div>

          {/* Subtitle */}
          <div className="neon-card p-6 mb-12 max-w-3xl mx-auto">
            <p className="text-2xl text-foreground mb-4 font-mono">
              <span className="text-accent">></span> École de programmation immersive
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Apprenez à coder comme un professionnel. Maîtrisez les langages, 
              frameworks et outils utilisés par les meilleurs développeurs de l'industrie.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
            <Button
              size="lg"
              className="dev-btn bg-primary hover:bg-primary/90 text-primary-foreground font-mono text-lg px-8 py-4 animate-neon-pulse"
              onClick={() => navigate("/auth")}
            >
              <Terminal className="h-6 w-6 mr-3" />
              <span>INITIALISER_SESSION()</span>
            </Button>
            
            <Button
              size="lg"
              variant="outline"
              className="dev-btn border-accent text-accent hover:bg-accent/10 font-mono text-lg px-8 py-4"
              onClick={() => navigate("/auth")}
            >
              <GitBranch className="h-6 w-6 mr-3" />
              <span>EXPLORER_REPO()</span>
            </Button>
          </div>

          {/* Tech Stack Preview */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {[
              { name: "PYTHON", icon: <Binary className="h-8 w-8" />, color: "text-primary" },
              { name: "JAVASCRIPT", icon: <Braces className="h-8 w-8" />, color: "text-accent" },
              { name: "DATABASE", icon: <Database className="h-8 w-8" />, color: "text-info" },
              { name: "FRAMEWORK", icon: <Zap className="h-8 w-8" />, color: "text-warning" }
            ].map((tech, i) => (
              <div key={i} className="neon-card cyber-border p-6 group cursor-pointer">
                <div className={`mb-4 ${tech.color} group-hover:animate-hologram transition-all duration-300`}>
                  {tech.icon}
                </div>
                <div className="font-mono font-bold text-sm text-neon group-hover:animate-terminal-typing">
                  {tech.name}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
