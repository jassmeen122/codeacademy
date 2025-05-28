
interface LocalResponse {
  answer: string;
  suggestions?: string[];
  confidence: number;
}

interface KnowledgeBase {
  [key: string]: {
    keywords: string[];
    answer: string;
    suggestions?: string[];
    language?: string;
  };
}

export class LocalAIService {
  private knowledgeBase: KnowledgeBase = {
    // Erreurs communes
    "syntax_error": {
      keywords: ["syntax error", "erreur syntaxe", "invalid syntax", "unexpected token"],
      answer: `🐛 **Erreur de syntaxe détectée !**

Les erreurs de syntaxe sont très communes. Voici comment les corriger :

**Vérifications communes :**
- ✅ Parenthèses bien fermées : \`()\`, \`[]\`, \`{}\`
- ✅ Points-virgules manquants (JavaScript)
- ✅ Indentation correcte (Python)
- ✅ Guillemets bien fermés : \`""\` ou \`''\`

**Astuce :** L'erreur est souvent sur la ligne indiquée ou juste avant !`,
      suggestions: ["🔍 Montrer mon code pour analyse", "📝 Expliquer les erreurs de syntaxe", "💡 Bonnes pratiques de codage"]
    },

    "undefined_variable": {
      keywords: ["undefined", "not defined", "variable", "name error"],
      answer: `🔍 **Variable non définie !**

Cette erreur signifie que vous utilisez une variable qui n'existe pas.

**Solutions :**
1. **Vérifier l'orthographe** de la variable
2. **Déclarer la variable** avant de l'utiliser
3. **Vérifier la portée** (scope) de la variable

**Exemple en Python :**
\`\`\`python
# ❌ Erreur
print(ma_variable)  # NameError

# ✅ Correct  
ma_variable = "Hello"
print(ma_variable)
\`\`\``,
      suggestions: ["🐍 Exemples Python", "🟨 Exemples JavaScript", "📚 Comprendre les variables"]
    },

    "python_basics": {
      keywords: ["python", "débutant", "commencer", "base", "apprendre python"],
      answer: `🐍 **Python pour débutants**

**Concepts essentiels :**
1. **Variables :** \`nom = "John"\`
2. **Types :** \`int\`, \`str\`, \`list\`, \`dict\`
3. **Conditions :** \`if\`, \`elif\`, \`else\`
4. **Boucles :** \`for\`, \`while\`
5. **Fonctions :** \`def ma_fonction():\`

**Premier programme :**
\`\`\`python
nom = input("Ton nom : ")
print(f"Salut {nom} !")
\`\`\``,
      suggestions: ["🏋️ Exercices Python débutant", "📖 Variables en Python", "🔄 Boucles Python"]
    },

    "javascript_basics": {
      keywords: ["javascript", "js", "web", "html", "css"],
      answer: `🟨 **JavaScript pour débutants**

**Bases essentielles :**
1. **Variables :** \`let nom = "John";\`
2. **Fonctions :** \`function saluer() {}\`
3. **DOM :** \`document.getElementById("id")\`
4. **Événements :** \`onclick\`, \`onchange\`

**Premier script :**
\`\`\`javascript
function saluer() {
    alert("Hello World!");
}
\`\`\``,
      suggestions: ["🌐 DOM et événements", "🎨 JavaScript + HTML", "⚡ Fonctions JavaScript"]
    },

    "loops": {
      keywords: ["boucle", "loop", "for", "while", "répéter"],
      answer: `🔄 **Les boucles expliquées simplement**

**Types de boucles :**

**1. Boucle FOR (nombre fixe) :**
\`\`\`python
for i in range(5):
    print(f"Tour {i}")
\`\`\`

**2. Boucle WHILE (condition) :**
\`\`\`python
compteur = 0
while compteur < 5:
    print(compteur)
    compteur += 1
\`\`\`

**Astuce :** FOR = nombre connu, WHILE = condition`,
      suggestions: ["🏃 Exercices de boucles", "🐍 Boucles Python avancées", "🟨 Boucles JavaScript"]
    },

    "functions": {
      keywords: ["fonction", "function", "def", "méthode"],
      answer: `⚙️ **Les fonctions : réutiliser son code**

**Pourquoi les fonctions ?**
- ✅ Éviter la répétition
- ✅ Code plus lisible
- ✅ Faciliter les tests

**Structure d'une fonction :**
\`\`\`python
def ma_fonction(parametre):
    # Code de la fonction
    return resultat

# Utilisation
resultat = ma_fonction("valeur")
\`\`\``,
      suggestions: ["📝 Créer ma première fonction", "🔧 Paramètres et return", "🎯 Exercices fonctions"]
    },

    "debug_help": {
      keywords: ["bug", "problème", "erreur", "marche pas", "debug"],
      answer: `🔧 **Guide de débogage step-by-step**

**1. Lire l'erreur attentivement**
- Le message d'erreur donne des indices précieux

**2. Technique du "print debugging" :**
\`\`\`python
print("Début du programme")
print(f"Variable x = {x}")
print("Fin du programme")
\`\`\`

**3. Vérifications systématiques :**
- ✅ Syntaxe correcte
- ✅ Variables définies
- ✅ Types de données corrects
- ✅ Logique du programme

**4. Diviser pour régner :** Tester chaque partie séparément`,
      suggestions: ["🔍 Analyser mon erreur", "📝 Techniques de debug", "🧪 Tester mon code"]
    }
  };

  public analyzeQuery(query: string): LocalResponse {
    const normalizedQuery = query.toLowerCase();
    
    // Recherche par mots-clés
    let bestMatch: { key: string; score: number } | null = null;
    
    for (const [key, knowledge] of Object.entries(this.knowledgeBase)) {
      let score = 0;
      
      for (const keyword of knowledge.keywords) {
        if (normalizedQuery.includes(keyword.toLowerCase())) {
          score += keyword.length; // Plus le mot-clé est long, plus il est spécifique
        }
      }
      
      if (score > 0 && (!bestMatch || score > bestMatch.score)) {
        bestMatch = { key, score };
      }
    }

    if (bestMatch) {
      const knowledge = this.knowledgeBase[bestMatch.key];
      return {
        answer: knowledge.answer,
        suggestions: knowledge.suggestions,
        confidence: Math.min(bestMatch.score / 10, 1) // Normaliser entre 0 et 1
      };
    }

    // Réponse par défaut si aucune correspondance
    return this.getDefaultResponse(normalizedQuery);
  }

  private getDefaultResponse(query: string): LocalResponse {
    // Détection du langage dans la question
    if (query.includes('python')) {
      return {
        answer: `🐍 **Question sur Python détectée !**

Je n'ai pas de réponse spécifique, mais je peux t'aider avec :
- Les bases de Python (variables, fonctions, boucles)
- Le débogage d'erreurs communes
- Des exercices pratiques

Peux-tu être plus précis sur ce que tu veux apprendre ?`,
        suggestions: ["🐍 Bases Python", "🐛 Debug Python", "🏋️ Exercices Python"],
        confidence: 0.6
      };
    }

    if (query.includes('javascript') || query.includes('js')) {
      return {
        answer: `🟨 **Question sur JavaScript !**

Je peux t'expliquer :
- Les bases du JavaScript
- L'interaction avec HTML/CSS
- Les fonctions et événements

Dis-moi exactement ce qui te pose problème !`,
        suggestions: ["🟨 Bases JavaScript", "🌐 DOM JavaScript", "🎨 JS + HTML"],
        confidence: 0.6
      };
    }

    // Réponse générale
    return {
      answer: `🤖 **IA Locale Active**

Je suis ton assistant de programmation local ! 

**Je peux t'aider avec :**
- 🐛 Débogage d'erreurs
- 📚 Explication de concepts
- 🐍 Python (variables, fonctions, boucles)
- 🟨 JavaScript (DOM, événements)
- 💡 Conseils de programmation

**Pour une meilleure aide, précise :**
- Le langage de programmation
- Le problème exact que tu rencontres
- Ton niveau (débutant, intermédiaire)`,
      suggestions: ["🐍 Aide Python", "🟨 Aide JavaScript", "🐛 Déboguer un problème", "📚 Apprendre les bases"],
      confidence: 0.3
    };
  }

  public generateExercises(language: string, level: string): LocalResponse {
    const exercises = {
      python: {
        beginner: `🏋️ **Exercices Python Débutant**

**1. Variables et affichage :**
\`\`\`python
# Crée un programme qui demande ton nom et ton âge
# puis affiche : "Salut [nom], tu as [âge] ans !"
\`\`\`

**2. Calculatrice simple :**
\`\`\`python
# Demande deux nombres et affiche leur somme
\`\`\`

**3. Conditions :**
\`\`\`python
# Demande un nombre et dis s'il est pair ou impair
\`\`\``,
        intermediate: `🚀 **Exercices Python Intermédiaire**

**1. Gestion de liste :**
\`\`\`python
# Crée une liste de courses et permet d'ajouter/supprimer des éléments
\`\`\`

**2. Fonctions :**
\`\`\`python
# Crée une fonction qui calcule la moyenne d'une liste
\`\`\``,
        advanced: `🎯 **Exercices Python Avancé**

**1. Mini-projet :**
\`\`\`python
# Gestionnaire de contacts avec fichier JSON
\`\`\``
      },
      javascript: {
        beginner: `🌐 **Exercices JavaScript Débutant**

**1. Interaction basique :**
\`\`\`javascript
// Bouton qui change le texte d'un paragraphe
\`\`\`

**2. Calculatrice web :**
\`\`\`javascript
// Interface avec boutons + - * /
\`\`\``,
        intermediate: `⚡ **Exercices JavaScript Intermédiaire**

**1. To-Do List :**
\`\`\`javascript
// Ajouter/supprimer des tâches dynamiquement
\`\`\``,
        advanced: `🔥 **Exercices JavaScript Avancé**

**1. Application météo :**
\`\`\`javascript
// Utilisation d'API et affichage dynamique
\`\`\``
      }
    };

    const langExercises = exercises[language as keyof typeof exercises];
    const levelExercises = langExercises?.[level as keyof typeof langExercises];

    return {
      answer: levelExercises || "Exercices non disponibles pour ce niveau",
      suggestions: ["🎯 Autre niveau", "🔄 Autre langage", "💡 Conseils pour réussir"],
      confidence: 0.9
    };
  }

  public isAvailable(): boolean {
    return true; // L'IA locale est toujours disponible
  }
}

export const localAI = new LocalAIService();
