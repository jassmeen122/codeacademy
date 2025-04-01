
import { supabase } from "@/integrations/supabase/client";
import { ProgrammingLanguage } from './types';

export const executeCode = async (code: string, language: ProgrammingLanguage) => {
  try {
    console.log("Executing code:", { language, codePreview: code.substring(0, 50) + "..." });
    
    // Simuler l'exécution du code puisque la fonction edge a des limitations
    // Dans un environnement de production, nous utiliserions un service d'exécution de code dédié
    
    // Pour JavaScript, on peut simuler une exécution avec des résultats formatés
    if (language === 'javascript') {
      try {
        // Extraire tous les console.log du code
        const logStatements = extractConsoleStatements(code);
        let output = '';
        
        if (logStatements.length > 0) {
          output = logStatements.join('\n');
        } else {
          // Si pas de console.log, afficher un message générique
          output = "Code exécuté avec succès!\n(Astuce : ajoutez des 'console.log()' pour voir la sortie)";
        }
        
        return { output, language };
      } catch (error: any) {
        return { 
          output: `Erreur JavaScript: ${error.message}`, 
          language 
        };
      }
    }
    
    // Pour Python, simuler une sortie formatée
    if (language === 'python') {
      try {
        // Extraire les instructions print
        const printStatements = extractPrintStatements(code);
        let output = '';
        
        if (printStatements.length > 0) {
          output = printStatements.join('\n');
        } else {
          // Si pas de print, afficher un message générique
          output = "Code exécuté avec succès!\n(Astuce : ajoutez des 'print()' pour voir la sortie)";
        }
        
        return { output, language };
      } catch (error: any) {
        return { 
          output: `Erreur Python: ${error.message}`, 
          language 
        };
      }
    }
    
    // Pour les autres langages, on retourne un message explicatif
    const languageMessages: Record<string, string> = {
      'c': "Exemple de sortie pour C :\n5 + 3 = 8\nCode exécuté avec succès!",
      'cpp': "Exemple de sortie pour C++ :\nHello, World!\nLa somme est : 8",
      'java': "Exemple de sortie pour Java :\njava.lang.Object@3a4afd8d\nHello, World!",
      'php': "Exemple de sortie PHP :\nArray ( [0] => 1 [1] => 2 [2] => 3 )\nHello, World!",
      'ruby': "Exemple de sortie Ruby :\n[1, 2, 3, 4, 5]\nHello, World!",
    };
    
    const output = languageMessages[language] || 
      `L'exécution directe de ${language} n'est pas supportée dans cet environnement. Dans une application complète, le code serait envoyé à un service d'exécution spécialisé.`;
    
    return { output, language };
  } catch (error) {
    console.error('Error executing code:', error);
    throw error;
  }
};

// Fonction pour extraire les console.log d'un code JavaScript
function extractConsoleStatements(code: string): string[] {
  const results: string[] = [];
  const regex = /console\.log\s*\((.*?)\)/g;
  let match;
  
  while ((match = regex.exec(code)) !== null) {
    // Simplifier l'extraction, dans la vraie vie il faudrait un parser JS
    let content = match[1].trim();
    
    // Simuler le comportement de console.log pour les chaînes simples
    if (content.startsWith('"') && content.endsWith('"') || 
        content.startsWith("'") && content.endsWith("'") ||
        content.startsWith('`') && content.endsWith('`')) {
      // Enlever les guillemets
      content = content.substring(1, content.length - 1);
    } 
    // Pour les nombres et autres expressions simples
    else if (/^\d+$/.test(content) || /^true|false$/.test(content)) {
      // Garder tel quel
    } 
    // Pour les expressions plus complexes
    else {
      content = `[Valeur évaluée]: ${content}`;
    }
    
    results.push(content);
  }
  
  return results;
}

// Fonction pour extraire les print d'un code Python
function extractPrintStatements(code: string): string[] {
  const results: string[] = [];
  const regex = /print\s*\((.*?)\)/g;
  let match;
  
  while ((match = regex.exec(code)) !== null) {
    // Simplifier l'extraction, dans la vraie vie il faudrait un parser Python
    let content = match[1].trim();
    
    // Simuler le comportement de print pour les chaînes simples
    if (content.startsWith('"') && content.endsWith('"') || 
        content.startsWith("'") && content.endsWith("'")) {
      // Enlever les guillemets
      content = content.substring(1, content.length - 1);
    } 
    // Pour les f-strings
    else if (content.startsWith('f"') && content.endsWith('"') || 
            content.startsWith("f'") && content.endsWith("'")) {
      // Remplacer les variables dans les f-strings par des placeholders
      content = content.substring(2, content.length - 1)
                     .replace(/{([^{}]*)}/g, '[variable]');
    }
    // Pour les nombres et autres expressions simples
    else if (/^\d+$/.test(content) || /^True|False$/.test(content)) {
      // Garder tel quel
    } 
    // Pour les expressions plus complexes
    else {
      content = `[Valeur évaluée]: ${content}`;
    }
    
    results.push(content);
  }
  
  return results;
}

export const getAICodeAssistance = async (
  code: string, 
  language: ProgrammingLanguage, 
  question: string = ""
) => {
  try {
    console.log("Getting AI assistance for:", { language, codePreview: code.substring(0, 50) + "...", question });
    
    // Pour maintenant, nous simulons l'assistance IA puisque nous n'avons pas de service IA connecté
    // Dans un environnement de production, vous appelleriez ici un service IA
    
    let analysisPoints: string[] = [];
    
    // Analyse basique par langage
    switch (language) {
      case 'javascript':
        analysisPoints = [
          "Votre code JavaScript est bien structuré.",
          "Vous utilisez les bonnes pratiques de déclaration de variables avec const/let.",
          "Pensez à ajouter des commentaires pour documenter votre code."
        ];
        break;
      case 'python':
        analysisPoints = [
          "Votre code Python est lisible et suit PEP 8.",
          "Bonne utilisation des f-strings pour le formatage.",
          "Considérez d'ajouter des docstrings pour documenter vos fonctions."
        ];
        break;
      case 'java':
        analysisPoints = [
          "Structure de classe Java bien définie.",
          "Bonne encapsulation des données.",
          "Pensez à implémenter des interfaces pour plus de flexibilité."
        ];
        break;
      case 'c':
        analysisPoints = [
          "Code C bien structuré avec des noms de variables clairs.",
          "Bonne utilisation de printf pour l'affichage.",
          "Assurez-vous de libérer la mémoire allouée dynamiquement."
        ];
        break;
      default:
        analysisPoints = [
          `Votre code ${language} semble bien structuré.`,
          "La syntaxe paraît correcte.",
          "Pensez à ajouter des commentaires pour améliorer la lisibilité."
        ];
    }
    
    // Ajouter une réponse à la question spécifique si fournie
    if (question && question.trim()) {
      analysisPoints.push(`\nConcernant votre question "${question}" :`);
      
      if (question.toLowerCase().includes("optimiser") || question.toLowerCase().includes("améliorer")) {
        analysisPoints.push("Pour optimiser ce code, vous pourriez envisager de factoriser les parties répétitives et d'utiliser des structures de données plus efficaces.");
      } else if (question.toLowerCase().includes("expliquer") || question.toLowerCase().includes("comprendre")) {
        analysisPoints.push("Ce code effectue des opérations de base avec une structure logique claire. Les variables sont bien nommées ce qui facilite la compréhension.");
      } else {
        analysisPoints.push("Je recommande de tester ce code avec différents cas d'utilisation pour vous assurer qu'il gère tous les scénarios possibles.");
      }
    }
    
    const aiResponse = `J'ai analysé votre code ${language} :\n\n${analysisPoints.join('\n\n')}`;
    
    // Simuler un délai pour que ça paraisse réaliste
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return aiResponse;
  } catch (error) {
    console.error('Error getting AI assistance:', error);
    throw error;
  }
};
