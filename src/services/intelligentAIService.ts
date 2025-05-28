
import { nlpService, StudentQuery } from './nlpService';

export class IntelligentAIService {
  private generateSmartPrompt(query: string, analysis: StudentQuery, code?: string): string {
    let systemPrompt = `Tu es un assistant IA pédagogique spécialisé en programmation. Tu dois aider les étudiants avec patience et pédagogie.

CONTEXTE DE LA QUESTION:
- Type: ${analysis.type}
- Langage: ${analysis.language || 'non spécifié'}
- Niveau: ${analysis.difficulty}
- Intention: ${analysis.intent}
- Mots-clés: ${analysis.keywords.join(', ')}

RÈGLES IMPORTANTES:
1. Utilise un ton amical et encourageant
2. Explique simplement, étape par étape
3. Donne des exemples concrets
4. Propose des exercices si approprié
5. Détecte les erreurs communes chez les débutants

`;

    // Adapter le prompt selon le type de question
    switch (analysis.type) {
      case 'bug':
        systemPrompt += `
L'étudiant a un problème technique. Tu dois:
- Analyser le code s'il est fourni
- Identifier l'erreur probable
- Expliquer pourquoi ça ne marche pas
- Donner la solution étape par étape
- Proposer des bonnes pratiques pour éviter ce problème
`;
        break;

      case 'concept':
        systemPrompt += `
L'étudiant veut comprendre un concept. Tu dois:
- Expliquer clairement avec des analogies simples
- Donner des exemples de code
- Montrer les cas d'usage
- Proposer des exercices pour pratiquer
`;
        break;

      case 'exercise':
        systemPrompt += `
L'étudiant cherche de la pratique. Tu dois:
- Proposer des exercices adaptés à son niveau
- Donner des projets progressifs
- Expliquer les objectifs d'apprentissage
- Fournir des indices sans donner la solution complète
`;
        break;
    }

    if (code) {
      systemPrompt += `\n\nCODE FOURNI PAR L'ÉTUDIANT:\n\`\`\`${analysis.language || 'text'}\n${code}\n\`\`\`\n`;
    }

    systemPrompt += `\nQUESTION DE L'ÉTUDIANT: ${query}`;

    return systemPrompt;
  }

  public analyzeAndRespond(query: string, code?: string, language?: string): {
    analysis: StudentQuery;
    prompt: string;
    suggestions: string[];
  } {
    // Analyser la question avec le NLP
    const analysis = nlpService.analyzeQuery(query);
    
    // Ajuster le langage si fourni explicitement
    if (language) {
      analysis.language = language as StudentQuery['language'];
    }

    // Générer un prompt intelligent
    const prompt = this.generateSmartPrompt(query, analysis, code);

    // Générer des suggestions proactives
    const suggestions = nlpService.generateSuggestions(analysis);

    return {
      analysis,
      prompt,
      suggestions
    };
  }

  public getWelcomeMessage(): string {
    return `👋 Salut ! Je suis ton assistant IA de programmation.

🧠 **Ce que je peux faire pour toi :**
- 🐛 T'aider à corriger tes bugs
- 📚 T'expliquer les concepts difficiles  
- 💪 Te proposer des exercices adaptés
- 🎯 Te guider dans tes projets

💬 **Tu peux me parler naturellement !**
- "Mon code marche pas"
- "Comment faire une boucle en Python ?"
- "Je veux m'entraîner sur les fonctions"

🚀 **Langages supportés :** Python, Java, JavaScript, C, C++, PHP, SQL

Pose-moi ta question ou partage ton code !`;
  }

  public generateExerciseSuggestions(language: string, difficulty: string): string {
    const exercises = {
      python: {
        beginner: [
          "Calculatrice simple",
          "Jeu de devinette de nombre",
          "Gestion d'une liste de courses"
        ],
        intermediate: [
          "Gestionnaire de contacts",
          "Analyseur de fichier texte",
          "Mini-jeu du pendu"
        ],
        advanced: [
          "API REST simple avec Flask",
          "Web scraper avec BeautifulSoup",
          "Système de gestion d'inventaire"
        ]
      },
      javascript: {
        beginner: [
          "Calculatrice interactive",
          "Todo list simple",
          "Galerie d'images"
        ],
        intermediate: [
          "Application météo avec API",
          "Quiz interactif",
          "Système de notes"
        ],
        advanced: [
          "Application de chat en temps réel",
          "Dashboard d'analytics",
          "Mini e-commerce"
        ]
      }
    };

    const langExercises = exercises[language as keyof typeof exercises];
    if (!langExercises) return "Je peux te proposer des exercices adaptés à ton niveau !";

    const levelExercises = langExercises[difficulty as keyof typeof langExercises];
    if (!levelExercises) return "Dis-moi ton niveau pour des exercices personnalisés !";

    return `🎯 **Exercices ${difficulty} en ${language} :**\n\n` + 
           levelExercises.map((ex, i) => `${i + 1}. ${ex}`).join('\n') +
           '\n\nChoisis celui qui t\'intéresse et je t\'aiderai à le réaliser !';
  }
}

export const intelligentAI = new IntelligentAIService();
