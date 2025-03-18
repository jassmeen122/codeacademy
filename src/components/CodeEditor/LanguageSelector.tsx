
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ProgrammingLanguage, languageOptions } from './types';

interface LanguageSelectorProps {
  language: ProgrammingLanguage;
  onChange: (language: ProgrammingLanguage) => void;
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({ language, onChange }) => {
  return (
    <Select
      value={language}
      onValueChange={(value) => onChange(value as ProgrammingLanguage)}
    >
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select language" />
      </SelectTrigger>
      <SelectContent>
        {Object.entries(languageOptions).map(([key, { label }]) => (
          <SelectItem key={key} value={key}>{label}</SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
