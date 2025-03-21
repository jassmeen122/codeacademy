
import React from 'react';
import MonacoEditor from '@monaco-editor/react';
import { ProgrammingLanguage, languageOptions } from './types';

interface MonacoEditorWrapperProps {
  language: ProgrammingLanguage;
  code: string;
  onChange: (value: string | undefined) => void;
  height?: string;
}

export const MonacoEditorWrapper: React.FC<MonacoEditorWrapperProps> = ({ 
  language, 
  code, 
  onChange,
  height = "400px"
}) => {
  return (
    <MonacoEditor
      height={height}
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
