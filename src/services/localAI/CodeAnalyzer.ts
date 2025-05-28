
// Analyseur de code local pour détecter les erreurs
export interface CodeIssue {
  type: 'syntax' | 'logic' | 'style' | 'performance';
  severity: 'error' | 'warning' | 'info';
  line?: number;
  message: string;
  suggestion?: string;
}

export class CodeAnalyzer {
  analyzeCode(code: string, language: string): CodeIssue[] {
    const issues: CodeIssue[] = [];
    
    switch (language.toLowerCase()) {
      case 'python':
        issues.push(...this.analyzePython(code));
        break;
      case 'javascript':
        issues.push(...this.analyzeJavaScript(code));
        break;
      case 'java':
        issues.push(...this.analyzeJava(code));
        break;
      default:
        issues.push(...this.analyzeGeneral(code));
    }
    
    return issues;
  }

  private analyzePython(code: string): CodeIssue[] {
    const issues: CodeIssue[] = [];
    const lines = code.split('\n');

    lines.forEach((line, index) => {
      const trimmedLine = line.trim();
      
      // Vérifier l'indentation
      if (line.length > 0 && line[0] === ' ' && !line.startsWith('    ')) {
        if (line.match(/^\s+\S/)) {
          issues.push({
            type: 'style',
            severity: 'warning',
            line: index + 1,
            message: 'Indentation incorrecte. Python utilise 4 espaces.',
            suggestion: 'Utilisez 4 espaces pour l\'indentation.'
          });
        }
      }

      // Vérifier les parenthèses non fermées
      const openParens = (line.match(/\(/g) || []).length;
      const closeParens = (line.match(/\)/g) || []).length;
      if (openParens !== closeParens) {
        issues.push({
          type: 'syntax',
          severity: 'error',
          line: index + 1,
          message: 'Parenthèses non équilibrées',
          suggestion: 'Vérifiez que chaque parenthèse ouvrante a sa parenthèse fermante.'
        });
      }

      // Vérifier l'affectation dans les conditions
      if (trimmedLine.includes('if ') && trimmedLine.includes(' = ') && !trimmedLine.includes(' == ')) {
        issues.push({
          type: 'logic',
          severity: 'error',
          line: index + 1,
          message: 'Utilisation de = au lieu de == dans une condition',
          suggestion: 'Utilisez == pour les comparaisons, = pour les affectations.'
        });
      }

      // Vérifier les variables non définies (patterns basiques)
      if (trimmedLine.includes('print(') && !trimmedLine.includes('"') && !trimmedLine.includes("'")) {
        const match = trimmedLine.match(/print\(([^)]+)\)/);
        if (match && match[1] && !code.includes(`${match[1]} =`)) {
          issues.push({
            type: 'logic',
            severity: 'warning',
            line: index + 1,
            message: `La variable '${match[1]}' pourrait ne pas être définie`,
            suggestion: 'Assurez-vous que la variable est définie avant de l\'utiliser.'
          });
        }
      }
    });

    return issues;
  }

  private analyzeJavaScript(code: string): CodeIssue[] {
    const issues: CodeIssue[] = [];
    const lines = code.split('\n');

    lines.forEach((line, index) => {
      const trimmedLine = line.trim();

      // Vérifier les points-virgules manquants
      if (trimmedLine.length > 0 && 
          !trimmedLine.endsWith(';') && 
          !trimmedLine.endsWith('{') && 
          !trimmedLine.endsWith('}') &&
          !trimmedLine.startsWith('//') &&
          !trimmedLine.includes('function') &&
          !trimmedLine.includes('if') &&
          !trimmedLine.includes('for') &&
          !trimmedLine.includes('while')) {
        issues.push({
          type: 'style',
          severity: 'warning',
          line: index + 1,
          message: 'Point-virgule manquant',
          suggestion: 'Ajoutez un point-virgule à la fin de la ligne.'
        });
      }

      // Vérifier var vs let/const
      if (trimmedLine.includes('var ')) {
        issues.push({
          type: 'style',
          severity: 'info',
          line: index + 1,
          message: 'Utilisation de var déconseillée',
          suggestion: 'Utilisez let ou const à la place de var.'
        });
      }

      // Vérifier == vs ===
      if (trimmedLine.includes(' == ') && !trimmedLine.includes(' === ')) {
        issues.push({
          type: 'style',
          severity: 'warning',
          line: index + 1,
          message: 'Utilisation de == au lieu de ===',
          suggestion: 'Utilisez === pour une comparaison stricte.'
        });
      }
    });

    return issues;
  }

  private analyzeJava(code: string): CodeIssue[] {
    const issues: CodeIssue[] = [];
    const lines = code.split('\n');

    lines.forEach((line, index) => {
      const trimmedLine = line.trim();

      // Vérifier les points-virgules manquants
      if (trimmedLine.length > 0 && 
          !trimmedLine.endsWith(';') && 
          !trimmedLine.endsWith('{') && 
          !trimmedLine.endsWith('}') &&
          !trimmedLine.startsWith('//') &&
          !trimmedLine.includes('class') &&
          !trimmedLine.includes('if') &&
          !trimmedLine.includes('for') &&
          !trimmedLine.includes('while')) {
        issues.push({
          type: 'syntax',
          severity: 'error',
          line: index + 1,
          message: 'Point-virgule manquant',
          suggestion: 'Ajoutez un point-virgule à la fin de la ligne.'
        });
      }

      // Vérifier les conventions de nommage des classes
      if (trimmedLine.includes('class ')) {
        const match = trimmedLine.match(/class\s+([A-Za-z_]\w*)/);
        if (match && match[1] && match[1][0] !== match[1][0].toUpperCase()) {
          issues.push({
            type: 'style',
            severity: 'warning',
            line: index + 1,
            message: 'Le nom de classe devrait commencer par une majuscule',
            suggestion: 'Utilisez PascalCase pour les noms de classes.'
          });
        }
      }
    });

    return issues;
  }

  private analyzeGeneral(code: string): CodeIssue[] {
    const issues: CodeIssue[] = [];
    
    // Vérifications générales
    if (code.length > 1000) {
      issues.push({
        type: 'style',
        severity: 'info',
        message: 'Code très long',
        suggestion: 'Considérez diviser votre code en plusieurs fonctions ou fichiers.'
      });
    }

    return issues;
  }
}
