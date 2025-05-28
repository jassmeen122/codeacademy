
// Assistant IA local principal
import { NLPEngine } from './NLPEngine';
import { KnowledgeBase, KnowledgeItem } from './KnowledgeBase';
import { CodeAnalyzer, CodeIssue } from './CodeAnalyzer';

export interface AIResponse {
  content: string;
  type: 'explanation' | 'suggestion' | 'exercise' | 'debug' | 'general';
  confidence: number;
  relatedTopics?: string[];
  codeAnalysis?: CodeIssue[];
}

export class LocalAIAssistant {
  private nlp: NLPEngine;
  private knowledge: KnowledgeBase;
  private codeAnalyzer: CodeAnalyzer;

  constructor() {
    this.nlp = new NLPEngine();
    this.knowledge = new KnowledgeBase();
    this.codeAnalyzer = new CodeAnalyzer();
  }

  async processQuery(
    query: string, 
    code?: string, 
    language?: string
  ): Promise<AIResponse> {
    // Analyser l'intention de la requête
    const analysis = this.nlp.extractIntent(query);
    
    // Si du code est fourni, l'analyser
    let codeAnalysis: CodeIssue[] = [];
    if (code && language) {
      codeAnalysis = this.codeAnalyzer.analyzeCode(code, language);
    }

    // Générer une réponse basée sur l'intention
    let response: AIResponse;

    switch (analysis.intent) {
      case 'explanation':
        response = this.generateExplanation(analysis.keywords, analysis.language);
        break;
      case 'debug':
        response = this.generateDebugHelp(query, codeAnalysis, analysis.language);
        break;
      case 'exercise':
        response = this.generateExercise(analysis.language);
        break;
      case 'help':
        response = this.generateHelp(analysis.keywords, analysis.language);
        break;
      default:
        response = this.generateGeneralResponse(query, analysis.keywords, analysis.language);
    }

    // Ajouter l'analyse de code si disponible
    if (codeAnalysis.length > 0) {
      response.codeAnalysis = codeAnalysis;
    }

    response.confidence = analysis.confidence;
    return response;
  }

  private generateExplanation(keywords: string[], language?: string): AIResponse {
    const relevantKnowledge = this.knowledge.search(keywords, language);
    
    if (relevantKnowledge.length > 0) {
      const bestMatch = relevantKnowledge[0];
      let content = `## ${bestMatch.topic}\n\n${bestMatch.content}`;
      
      if (bestMatch.examples && bestMatch.examples.length > 0) {
        content += '\n\n**Exemples :**\n```' + (bestMatch.language || '') + '\n';
        content += bestMatch.examples.join('\n\n');
        content += '\n```';
      }
      
      return {
        content,
        type: 'explanation',
        confidence: 0.9,
        relatedTopics: relevantKnowledge.slice(1, 3).map(k => k.topic)
      };
    }
    
    return {
      content: "Je n'ai pas trouvé d'information spécifique sur ce sujet. Pouvez-vous reformuler votre question ou être plus précis ?",
      type: 'general',
      confidence: 0.3
    };
  }

  private generateDebugHelp(query: string, codeIssues: CodeIssue[], language?: string): AIResponse {
    let content = "## Analyse de votre code\n\n";
    
    if (codeIssues.length === 0) {
      content += "✅ Aucune erreur évidente détectée dans votre code !\n\n";
      content += "Si vous rencontrez toujours des problèmes, vérifiez :\n";
      content += "- La logique de votre algorithme\n";
      content += "- Les cas limites (valeurs nulles, listes vides, etc.)\n";
      content += "- Les types de données utilisés\n";
    } else {
      const errors = codeIssues.filter(issue => issue.severity === 'error');
      const warnings = codeIssues.filter(issue => issue.severity === 'warning');
      
      if (errors.length > 0) {
        content += "🚨 **Erreurs critiques :**\n";
        errors.forEach(error => {
          content += `- Ligne ${error.line || '?'} : ${error.message}\n`;
          if (error.suggestion) {
            content += `  💡 *${error.suggestion}*\n`;
          }
        });
        content += "\n";
      }
      
      if (warnings.length > 0) {
        content += "⚠️ **Avertissements :**\n";
        warnings.forEach(warning => {
          content += `- Ligne ${warning.line || '?'} : ${warning.message}\n`;
          if (warning.suggestion) {
            content += `  💡 *${warning.suggestion}*\n`;
          }
        });
      }
    }
    
    return {
      content,
      type: 'debug',
      confidence: 0.8,
      codeAnalysis: codeIssues
    };
  }

  private generateExercise(language?: string): AIResponse {
    const exercise = this.knowledge.getRandomExercise(language);
    
    const content = `## 💪 Exercice pratique\n\n${exercise}\n\n` +
      `**Conseils :**\n` +
      `- Commencez par comprendre le problème\n` +
      `- Décomposez en étapes simples\n` +
      `- Testez votre code avec différentes valeurs\n` +
      `- N'hésitez pas à demander de l'aide si besoin !`;
    
    return {
      content,
      type: 'exercise',
      confidence: 0.9
    };
  }

  private generateHelp(keywords: string[], language?: string): AIResponse {
    const helpTopics = [
      "Je peux vous aider avec :",
      "📚 **Explications de concepts** - Demandez-moi d'expliquer variables, fonctions, boucles, etc.",
      "🔍 **Analyse de code** - Partagez votre code et je l'analyserai",
      "💪 **Exercices pratiques** - Demandez un exercice pour vous entraîner",
      "🐛 **Résolution de bugs** - Montrez-moi votre code problématique",
      "",
      "**Langages supportés :** Python, JavaScript, Java, C, C++, PHP, SQL",
      "",
      "**Exemples de questions :**",
      "- \"Explique-moi les fonctions en Python\"",
      "- \"Mon code Python ne fonctionne pas\"",
      "- \"Donne-moi un exercice sur les boucles\"",
      "- \"Comment déclarer une variable en JavaScript ?\""
    ];
    
    return {
      content: helpTopics.join('\n'),
      type: 'general',
      confidence: 0.9
    };
  }

  private generateGeneralResponse(query: string, keywords: string[], language?: string): AIResponse {
    // Essayer de trouver une réponse dans la base de connaissances
    const relevantKnowledge = this.knowledge.search(keywords, language);
    
    if (relevantKnowledge.length > 0) {
      const bestMatch = relevantKnowledge[0];
      const content = `Voici ce que j'ai trouvé sur **${bestMatch.topic}** :\n\n${bestMatch.content}`;
      
      return {
        content,
        type: 'general',
        confidence: 0.7,
        relatedTopics: relevantKnowledge.slice(1, 2).map(k => k.topic)
      };
    }
    
    // Réponse par défaut
    const defaultResponses = [
      "Je comprends que vous avez une question sur la programmation. Pouvez-vous être plus spécifique ?",
      "Pour mieux vous aider, précisez le langage de programmation et votre question exacte.",
      "Je suis là pour vous aider ! Essayez de reformuler votre question avec plus de détails."
    ];
    
    const randomResponse = defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
    
    return {
      content: randomResponse,
      type: 'general',
      confidence: 0.4
    };
  }
}
