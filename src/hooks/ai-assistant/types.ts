
export type Message = {
  role: "user" | "assistant";
  content: string;
  suggestions?: string[];
  isLocal?: boolean;
};

export interface AIAssistantState {
  messages: Message[];
  isLoading: boolean;
  errorMessage: string | null;
  useHuggingFace: boolean;
  useLocalAI: boolean;
}

export interface AIAssistantActions {
  sendMessage: (userInput: string, code?: string, language?: string) => Promise<void>;
  clearChat: () => void;
  retryLastMessage: () => void;
  switchAssistantModel: () => void;
  toggleLocalAI: () => void;
}
