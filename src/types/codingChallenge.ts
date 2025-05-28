
export interface Challenge {
  id: number;
  title: string;
  description: string;
  code: string;
  correctAnswer: string;
  explanation: string;
  type: 'sql' | 'python' | 'javascript' | 'php' | 'java' | 'c' | 'cpp';
}

export interface GameLevel {
  id: number;
  name: string;
  challenge: Challenge;
  unlocked: boolean;
  completed: boolean;
}

export type GameMode = 'menu' | 'playing' | 'success';
