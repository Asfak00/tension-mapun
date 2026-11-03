export type CategoryId =
  | "job"
  | "business"
  | "relationship"
  | "money"
  | "study"
  | "family"
  | "social"
  | "future"
  | "random";

export type Mood = "chill" | "worried" | "panic" | "meltdown" | "dead";

export interface Category {
  id: CategoryId;
  name: string;
  emoji: string;
  color: string;
  /** Multiplier applied to this category's score when combining. */
  intensity: number;
  tagline: string;
  problems: string[];
  selectJokes: string[];
}

export interface QuestionOption {
  label: string;
  hint?: string;
  /** 0 (no tension) to 100 (maximum tension). */
  points: number;
  reaction: string;
}

export interface Question {
  id: string;
  category: CategoryId;
  text: string;
  options: QuestionOption[];
}

/** Option index per question in quiz order, or null when skipped. */
export type Answer = number | null;

export type LevelId = "chill" | "minor" | "gorom" | "jhamela" | "emergency";

export interface Level {
  id: LevelId;
  min: number;
  max: number;
  name: string;
  bn: string;
  color: string;
  mood: Mood;
}

export interface TensionResult {
  code: string;
  score: number;
  level: Level;
  categories: CategoryId[];
  categoryScores: Partial<Record<CategoryId, number>>;
  topCategory: CategoryId;
  answered: number;
  skipped: number;
  seed: number;
}

export interface Stat {
  label: string;
  value: string;
  bar: number;
}

export interface ResultReport {
  headline: string;
  diagnosis: string;
  prediction: string;
  treatments: string[];
  stats: Stat[];
  shareJoke: string;
}
