
export type ProgrammingLanguage = "python" | "java" | "javascript" | "c" | "cpp" | "php" | "sql";

export interface CodeEditorProps {
  initialLanguage?: ProgrammingLanguage;
  initialCode?: string;
}

export interface LanguageOption {
  label: string;
  monacoId: string;
}

export const languageOptions: Record<ProgrammingLanguage, LanguageOption> = {
  python: { label: "Python", monacoId: "python" },
  java: { label: "Java", monacoId: "java" },
  javascript: { label: "JavaScript", monacoId: "javascript" },
  c: { label: "C", monacoId: "c" },
  cpp: { label: "C++", monacoId: "cpp" },
  php: { label: "PHP", monacoId: "php" },
  sql: { label: "SQL", monacoId: "sql" }
};

export const defaultCode: Record<ProgrammingLanguage, string> = {
  python: '# Write your Python code here\nprint("Hello, World!")',
  java: 'public class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello, World!");\n    }\n}',
  javascript: '// Write your JavaScript code here\nconsole.log("Hello, World!");',
  c: '#include <stdio.h>\n\nint main() {\n    printf("Hello, World!\\n");\n    return 0;\n}',
  cpp: '#include <iostream>\n\nint main() {\n    std::cout << "Hello, World!" << std::endl;\n    return 0;\n}',
  php: '<?php\n// Write your PHP code here\necho "Hello, World!";',
  sql: '-- Write your SQL query here\nSELECT "Hello, World!" as greeting;'
};
