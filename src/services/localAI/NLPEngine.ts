
// Moteur de traitement du langage naturel local
export class NLPEngine {
  private stopWords = new Set([
    'le', 'la', 'les', 'un', 'une', 'des', 'du', 'de', 'et', 'ou', 'est', 'sont',
    'dans', 'sur', 'avec', 'par', 'pour', 'sans', 'mais', 'car', 'donc', 'que',
    'qui', 'quoi', 'comment', 'pourquoi', 'où', 'quand', 'si', 'alors', 'ainsi'
  ]);

  private programmingKeywords = {
    concepts: [
      'variable', 'fonction', 'boucle', 'condition', 'classe', 'objet', 'méthode',
      'algorithme', 'structure', 'données', 'tableau', 'liste', 'dictionnaire',
      'string', 'integer', 'boolean', 'float', 'char', 'void', 'return', 'if',
      'else', 'for', 'while', 'switch', 'case', 'break', 'continue', 'try',
      'catch', 'throw', 'import', 'export', 'class', 'interface', 'abstract'
    ],
    languages: [
      'python', 'javascript', 'java', 'c', 'c++', 'php', 'sql', 'html', 'css'
    ],
    problems: [
      'erreur', 'bug', 'problème', 'dysfonctionnement', 'plantage', 'crash',
      'exception', 'syntax error', 'runtime error', 'logic error', 'debug'
    ],
    learning: [
      'apprendre', 'comprendre', 'expliquer', 'tutoriel', 'cours', 'leçon',
      'exercice', 'exemple', 'démonstration', 'pratique', 'débutant', 'avancé'
    ]
  };

  tokenize(text: string): string[] {
    return text
      .toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .split(/\s+/)
      .filter(token => token.length > 2 && !this.stopWords.has(token));
  }

  extractIntent(text: string): {
    intent: 'question' | 'help' | 'explanation' | 'debug' | 'exercise' | 'general';
    confidence: number;
    keywords: string[];
    language?: string;
  } {
    const tokens = this.tokenize(text);
    const keywords: string[] = [];
    let language: string | undefined;

    // Identifier les mots-clés pertinents
    tokens.forEach(token => {
      if (this.programmingKeywords.concepts.includes(token) ||
          this.programmingKeywords.problems.includes(token) ||
          this.programmingKeywords.learning.includes(token)) {
        keywords.push(token);
      }
      if (this.programmingKeywords.languages.includes(token)) {
        language = token;
      }
    });

    // Déterminer l'intention
    let intent: 'question' | 'help' | 'explanation' | 'debug' | 'exercise' | 'general' = 'general';
    let confidence = 0.5;

    const questionWords = ['comment', 'pourquoi', 'quoi', 'que', 'quel', 'quelle'];
    const helpWords = ['aide', 'aidez', 'aider', 'help', 'assistance'];
    const explanationWords = ['expliquer', 'explication', 'comprendre', 'définir'];
    const debugWords = ['erreur', 'bug', 'problème', 'debug', 'réparer', 'corriger'];
    const exerciseWords = ['exercice', 'pratique', 'entraînement', 'défi'];

    if (tokens.some(token => questionWords.includes(token))) {
      intent = 'question';
      confidence = 0.8;
    } else if (tokens.some(token => helpWords.includes(token))) {
      intent = 'help';
      confidence = 0.8;
    } else if (tokens.some(token => explanationWords.includes(token))) {
      intent = 'explanation';
      confidence = 0.9;
    } else if (tokens.some(token => debugWords.includes(token))) {
      intent = 'debug';
      confidence = 0.9;
    } else if (tokens.some(token => exerciseWords.includes(token))) {
      intent = 'exercise';
      confidence = 0.8;
    }

    // Augmenter la confiance si des mots-clés pertinents sont trouvés
    if (keywords.length > 0) {
      confidence = Math.min(confidence + (keywords.length * 0.1), 1.0);
    }

    return { intent, confidence, keywords, language };
  }

  calculateSimilarity(text1: string, text2: string): number {
    const tokens1 = new Set(this.tokenize(text1));
    const tokens2 = new Set(this.tokenize(text2));
    
    const intersection = new Set([...tokens1].filter(x => tokens2.has(x)));
    const union = new Set([...tokens1, ...tokens2]);
    
    return intersection.size / union.size;
  }
}
