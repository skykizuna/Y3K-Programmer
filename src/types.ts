export type GameMode = 'TIME_TRIAL' | 'TAP_MODE' | 'GLITCH_MODE' | 'ALGORITHM_QUEST' | 'BOSS_ROUND';

export type Character = {
  id: string;
  name: string;
  description: string;
  color: string;
  avatar: string;
  ability: {
    name: string;
    description: string;
    type: 'TIME' | 'ERASE' | 'MULTIPLIER';
  };
};

export type Question = {
  id: number;
  text: string;
  options?: string[];
  answer: string;
  explanation?: string;
  difficulty: number;
  code?: string;
};

export type TappleRound = {
  id: number;
  category: string;
  examples: string[];
};

export type GlitchRound = {
  id: number;
  corruptedCode: string;
  error: string;
  cause: string;
  fix: string;
  hint: string;
  explanation: string;
  difficulty: number;
};

export type QuestRound = {
  id: number;
  scenario: string;
  options: { label: string; value: string }[];
  correctValue: string;
  reasoning: string;
};

export type Difficulty = 'EASY' | 'HARD';

export type GameState = {
  screen: 'INTRO' | 'CHAR_SELECT' | 'DIFFICULTY_SELECT' | 'MENU' | 'PLAYING' | 'BOSS' | 'RESULTS';
  selectedMode: GameMode | null;
  character: Character | null;
  difficulty: Difficulty;
  points: number;
  badges: string[];
  completedModes: GameMode[];
  powerActive: boolean;
  powerUsed: boolean;
};
