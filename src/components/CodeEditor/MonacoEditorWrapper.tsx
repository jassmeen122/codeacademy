
import React from 'react';
import MonacoEditor from '@monaco-editor/react';
import { ProgrammingLanguage, languageOptions } from './types';

interface MonacoEditorWrapperProps {
  language: ProgrammingLanguage;
  code: string;
  onChange: (value: string | undefined) => void;
}

export const MonacoEditorWrapper: React.FC<MonacoEditorWrapperProps> = ({ 
  language, 
  code, 
  onChange 
}) => {
  return (
    <MonacoEditor
      height="400px"
      language={languageOptions[language].monacoId}
      value={code}
      onChange={(value) => onChange(value || "")}
      theme="vs-dark"
      options={{
        minimap: { enabled: false },
        fontSize: 14,
        lineNumbers: 'on',
        roundedSelection: false,
        scrollBeyondLastLine: false,
        automaticLayout: true,
        tabSize: 2,
      }}
    />
  );
};
