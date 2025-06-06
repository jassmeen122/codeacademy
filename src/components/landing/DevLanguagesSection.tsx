
import React from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Code, Terminal, Braces, Database, Globe, Cpu } from "lucide-react";

export const DevLanguagesSection: React.FC = () => {
  const navigate = useNavigate();
  
  const languages = [
    { 
      name: "Python", 
      icon: <Terminal className="h-8 w-8 text-blue-400" />,
      description: "IA & Data Science",
      color: "from-blue-500/20 to-blue-600/20",
      code: "def learn(): return 'Python Master'"
    },
    { 
      name: "JavaScript", 
      icon: <Braces className="h-8 w-8 text-yellow-400" />,
      description: "Web Development",
      color: "from-yellow-500/20 to-yellow-600/20",
      code: "const skill = () => 'JS Expert';"
    },
    { 
      name: "Java", 
      icon: <Cpu className="h-8 w-8 text-red-400" />,
      description: "Applications Enterprise",
      color: "from-red-500/20 to-red-600/20",
      code: "public class Developer { }"
    },
    { 
      name: "PHP", 
      icon: <Globe className="h-8 w-8 text-purple-400" />,
      description: "Backend Web",
      color: "from-purple-500/20 to-purple-600/20",
      code: "<?php echo 'Web Master'; ?>"
    },
    { 
      name: "C++", 
      icon: <Code className="h-8 w-8 text-green-400" />,
      description: "Systèmes & Performance",
      color: "from-green-500/20 to-green-600/20",
      code: "#include <iostream>"
    },
    { 
      name: "SQL", 
      icon: <Database className="h-8 w-8 text-orange-400" />,
      description: "Bases de données",
      color: "from-orange-500/20 to-orange-600/20",
      code: "SELECT * FROM skills;"
    }
  ];
  
  return (
    <section className="py-20 relative overflow-hidden">
      {/* Background Matrix Effect */}
      <div className="absolute inset-0 matrix-bg opacity-40" />
      <div className="absolute inset-0 bg-gradient-to-br from-background/90 to-background/80" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col md:flex-row items-center gap-12 mb-16">
          <div className="relative group">
            {/* Animated tech icons */}
            <div className="absolute -top-6 -left-6 animate-pulse opacity-60">
              <Terminal className="h-10 w-10 text-neon-blue animate-matrix-rain" />
            </div>
            
            <div className="neon-card p-8 hover:scale-110 transition-all duration-500 cyber-border">
              <Code className="h-20 w-20 text-primary group-hover:animate-neon-pulse" />
            </div>
            
            <div className="absolute -bottom-6 -right-6 animate-pulse animation-delay-1000">
              <Braces className="h-10 w-10 text-neon-green animate-data-flow" />
            </div>
          </div>
          
          <div className="flex-1">
            <h2 className="text-4xl font-bold mb-6 text-gradient">
              Langages de Programmation
              <span className="terminal-cursor ml-2"></span>
            </h2>
            <p className="text-muted-foreground text-lg mb-6 leading-relaxed">
              Maîtrisez les technologies qui façonnent l'avenir. Nos cours couvrent tous les langages 
              essentiels de l'industrie tech, de l'intelligence artificielle au développement web.
            </p>
            <div className="code-block">
              <span className="comment-text">// Votre parcours commence ici</span><br/>
              <span className="keyword-text">for</span> (<span className="variable-text">language</span> <span className="keyword-text">of</span> <span className="variable-text">availableCourses</span>) {"{"}
              <br/>
              &nbsp;&nbsp;<span className="function-text">learn</span>(<span className="variable-text">language</span>);
              <br/>
              &nbsp;&nbsp;<span className="function-text">practice</span>(<span className="variable-text">projects</span>);
              <br/>
              &nbsp;&nbsp;<span className="function-text">master</span>(<span className="variable-text">skills</span>);
              <br/>
              {"}"}
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {languages.map((lang, i) => (
            <Card key={i} 
              className={`edu-card cursor-pointer group relative overflow-hidden bg-gradient-to-br ${lang.color} hover:scale-105 transition-all duration-500`}
              onClick={() => navigate("/auth")}
            >
              {/* Scan line effect */}
              <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent opacity-0 group-hover:opacity-100 group-hover:animate-scan-line" />
              
              <CardContent className="p-6 text-center relative z-10">
                <div className="mb-4 group-hover:animate-hologram transition-all duration-300">
                  {lang.icon}
                </div>
                <div className="font-mono font-bold text-lg mb-2 text-neon group-hover:animate-terminal-typing">
                  {lang.name}
                </div>
                <div className="text-xs text-muted-foreground group-hover:text-foreground/80 transition-colors mb-3">
                  {lang.description}
                </div>
                <div className="text-xs font-mono bg-muted/50 p-2 rounded border border-border/50 text-accent">
                  {lang.code}
                </div>
              </CardContent>
              
              {/* Hover glow effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-accent/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </Card>
          ))}
        </div>
        
        {/* Matrix code rain effect */}
        <div className="absolute top-0 right-10 opacity-20">
          <div className="text-matrix text-xs font-mono animate-matrix-rain">
            01010011<br/>
            01100101<br/>
            01100001<br/>
            01110010<br/>
            01100011<br/>
            01101000
          </div>
        </div>
      </div>
    </section>
  );
};
