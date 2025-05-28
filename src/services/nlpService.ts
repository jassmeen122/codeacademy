
export interface StudentQuery {
  type: 'bug' | 'concept' | 'exercise' | 'explanation' | 'general';
  language?: 'python' | 'java' | 'javascript' | 'c' | 'cpp' | 'php' | 'sql';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  intent: string;
  keywords: string[];
}

export class NLPService {
  // Mots-clés pour détecter les types de questions
  private bugKeywords = [
    'marche pas', 'fonctionne pas', 'erreur', 'bug', 'problème', 'crash', 
    'ne s\'exécute pas', 'ça marche pas', 'ça foire', 'plantage', 'cassé'
  ];

  private conceptKeywords = [
    'qu\'est-ce que', 'comment', 'pourquoi', 'expliquer', 'comprendre',
    'différence', 'définition', 'c\'est quoi', 'ça veut dire quoi'
  ];

  private exerciseKeywords = [
    'exercice', 'pratique', 'entraînement', 'exemple', 'projet',
    'faire du code', 'coder', 'programmer', 'challenge'
  ];

  private languagePatterns = {
    python: ['python', 'py', 'django', 'flask', 'pandas'],
    java: ['java', 'spring', 'classe', 'objet'],
    javascript: ['javascript', 'js', 'node', 'react', 'html', 'css'],
    c: ['langage c', ' c ', 'gcc'],
    cpp: ['c++', 'cpp', 'classe c++'],
    php: ['php', 'laravel', 'symfony'],
    sql: ['sql', 'base de données', 'mysql', 'postgresql', 'select', 'insert']
  };

  analyzeQuery(query: string): StudentQuery {
    const lowerQuery = query.toLowerCase();
    
    // Détecter le type de question
    let type: StudentQuery['type'] = 'general';
    
    if (this.containsKeywords(lowerQuery, this.bugKeywords)) {
      type = 'bug';
    } else if (this.containsKeywords(lowerQuery, this.exerciseKeywords)) {
      type = 'exercise';
    } else if (this.containsKeywords(lowerQuery, this.conceptKeywords)) {
      type = 'concept';
    } else if (lowerQuery.includes('expliquer') || lowerQuery.includes('comment')) {
      type = 'explanation';
    }

    // Détecter le langage
    let language: StudentQuery['language'] | undefined;
    for (const [lang, keywords] of Object.entries(this.languagePatterns)) {
      if (this.containsKeywords(lowerQuery, keywords)) {
        language = lang as StudentQuery['language'];
        break;
      }
    }

    // Détecter le niveau de difficulté
    const difficulty = this.detectDifficulty(lowerQuery);

    // Extraire les mots-clés principaux
    const keywords = this.extractKeywords(lowerQuery);

    // Déterminer l'intention
    const intent = this.determineIntent(type, lowerQuery);

    return {
      type,
      language,
      difficulty,
      intent,
      keywords
    };
  }

  private containsKeywords(text: string, keywords: string[]): boolean {
    return keywords.some(keyword => text.includes(keyword));
  }

  private detectDifficulty(query: string): StudentQuery['difficulty'] {
    const beginnerTerms = ['débutant', 'simple', 'facile', 'commencer', 'base'];
    const advancedTerms = ['avancé', 'complexe', 'difficile', 'optimiser', 'performance'];
    
    if (this.containsKeywords(query, beginnerTerms)) return 'beginner';
    if (this.containsKeywords(query, advancedTerms)) return 'advanced';
    return 'intermediate';
  }

  private extractKeywords(query: string): string[] {
    // Mots vides à ignorer
    const stopWords = ['le', 'la', 'les', 'un', 'une', 'de', 'du', 'des', 'et', 'ou', 'que', 'qui', 'dans', 'avec', 'pour', 'sur'];
    
    return query
      .split(/\s+/)
      .filter(word => word.length > 2 && !stopWords.includes(word.toLowerCase()))
      .slice(0, 5); // Garder les 5 mots-clés les plus importants
  }

  private determineIntent(type: StudentQuery['type'], query: string): string {
    switch (type) {
      case 'bug':
        return 'L\'étudiant a un problème technique avec son code';
      case 'concept':
        return 'L\'étudiant veut comprendre un concept';
      case 'exercise':
        return 'L\'étudiant cherche de la pratique';
      case 'explanation':
        return 'L\'étudiant demande une explication détaillée';
      default:
        return 'Question générale sur la programmation';
    }
  }

  // Générer des suggestions proactives basées sur l'analyse
  generateSuggestions(analysis: StudentQuery): string[] {
    const suggestions: string[] = [];

    switch (analysis.type) {
      case 'bug':
        suggestions.push(
          "📝 Partage ton code pour que je puisse t'aider",
          "🔍 Décris l'erreur que tu vois",
          "💡 Explique ce que tu essaies de faire"
        );
        break;
      
      case 'concept':
        suggestions.push(
          "📚 Je peux t'expliquer avec des exemples simples",
          "🎯 Veux-tu voir un code d'exemple ?",
          "📝 Préfères-tu une explication théorique ou pratique ?"
        );
        break;
      
      case 'exercise':
        suggestions.push(
          "🏋️ Je peux te proposer des exercices adaptés à ton niveau",
          "💪 Veux-tu un défi progressif ?",
          "📊 Quel type d'exercice préfères-tu ?"
        );
        break;
    }

    if (analysis.language) {
      suggestions.push(`🔧 Exercices spécifiques en ${analysis.language}`);
    }

    return suggestions;
  }
}

export const nlpService = new NLPService();
