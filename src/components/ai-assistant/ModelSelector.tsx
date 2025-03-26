
import React from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AIModel } from "@/hooks/useAIAssistant";
import { BrainCircuit, Bot } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface ModelSelectorProps {
  selectedModel: AIModel;
  onModelChange: (model: AIModel) => void;
  disabled?: boolean;
}

export const ModelSelector = ({ selectedModel, onModelChange, disabled }: ModelSelectorProps) => {
  return (
    <div className="flex items-center gap-2">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Select 
              value={selectedModel} 
              onValueChange={(value) => onModelChange(value as AIModel)}
              disabled={disabled}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sélectionner un modèle" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="openai" className="flex items-center">
                  <div className="flex items-center">
                    <BrainCircuit className="h-4 w-4 mr-2" />
                    <span>OpenAI (GPT)</span>
                  </div>
                </SelectItem>
                <SelectItem value="huggingface">
                  <div className="flex items-center">
                    <Bot className="h-4 w-4 mr-2" />
                    <span>Hugging Face</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </TooltipTrigger>
          <TooltipContent>
            <p>Changer de modèle d'IA</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};
