
export type ProgrammingLanguage = 'javascript' | 'python' | 'java' | 'c' | 'cpp' | 'php';

export interface CodeEditorProps {
  initialLanguage?: ProgrammingLanguage;
  initialCode?: string;
  onChange?: (code: string) => void;
  onRun?: (output: string) => void;
}

export interface LanguageOption {
  label: string;
  monacoId: string;
  fileExtension: string;
}

export const languageOptions: Record<ProgrammingLanguage, LanguageOption> = {
  javascript: {
    label: 'JavaScript',
    monacoId: 'javascript',
    fileExtension: 'js'
  },
  python: {
    label: 'Python',
    monacoId: 'python',
    fileExtension: 'py'
  },
  java: {
    label: 'Java',
    monacoId: 'java',
    fileExtension: 'java'
  },
  c: {
    label: 'C',
    monacoId: 'c',
    fileExtension: 'c'
  },
  cpp: {
    label: 'C++',
    monacoId: 'cpp',
    fileExtension: 'cpp'
  },
  php: {
    label: 'PHP',
    monacoId: 'php',
    fileExtension: 'php'
  }
};

export const defaultCode: Record<ProgrammingLanguage, string> = {
  javascript: `// JavaScript Code Editor
// Bienvenue dans l'éditeur de code JavaScript!

function helloWorld() {
  console.log("Bonjour, monde!");
  return "Hello, world!";
}

// Exemple d'utilisation
helloWorld();
`,
  python: `# Python Code Editor
# Bienvenue dans l'éditeur de code Python!

def hello_world():
    print("Bonjour, monde!")
    return "Hello, world!"

# Exemple d'utilisation
hello_world()
`,
  java: `// Java Code Editor
// Bienvenue dans l'éditeur de code Java!

public class Main {
    public static void main(String[] args) {
        System.out.println("Bonjour, monde!");
    }
    
    public static String helloWorld() {
        return "Hello, world!";
    }
}
`,
  c: `// C Code Editor
// Bienvenue dans l'éditeur de code C!

#include <stdio.h>

int main() {
    printf("Bonjour, monde!\\n");
    return 0;
}
`,
  cpp: `// C++ Code Editor
// Bienvenue dans l'éditeur de code C++!

#include <iostream>
#include <memory>

int main() {
    std::cout << "Bonjour, monde!" << std::endl;
    
    // Exemple d'utilisation de smart pointer
    std::unique_ptr<int> ptr = std::make_unique<int>(42);
    std::cout << "Valeur: " << *ptr << std::endl;
    
    return 0;
}
`,
  php: `<?php
// PHP Code Editor
// Bienvenue dans l'éditeur de code PHP!

function helloWorld() {
    echo "Bonjour, monde!";
    return "Hello, world!";
}

// Exemple d'utilisation
helloWorld();
?>
`
};
