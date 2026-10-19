export type Status = "Not Started" | "Learning" | "Practicing" | "Mastered";
export interface Problem {
  id: string;
  name: string;
  category: string;
  difficulty: string;
  url: string;
}
export interface Progress {
  status: Status;
  completed: boolean;
  confidence: number;
  notes: string;
  bookmarked: boolean;
  updated: number;
}
export interface Lesson {
  id: string;
  title: string;
  category: string;
  level: string;
  summary: string;
  intuition: string;
  clues: string;
  example: string[];
  state: string;
  invariant: string;
  code: string;
  time: string;
  space: string;
  pitfalls: string;
  edges: string;
  brute: string;
  interview: string;
  followup: string;
  simpler: string;
  quiz: {
    question: string;
    options: string[];
    answer: number;
    explanation: string;
  };
  cases: { args: unknown[]; expected: unknown }[];
}
export interface Review {
  due: number;
  interval: number;
  repetitions: number;
  lapses: number;
  history: { at: number; rating: string }[];
}
export interface Mistake {
  id: string;
  topic: string;
  confusion: string;
  correction: string;
  example: string;
  created: number;
}
export interface MockResult {
  id: string;
  problem: string;
  duration: number;
  elapsed: number;
  hints: number;
  scores: Record<string, number>;
  notes: string;
  created: number;
}
export interface StudyState {
  version: 1;
  problems: Record<string, Progress>;
  topics: Record<string, Progress>;
  reviews: Record<string, Review>;
  mistakes: Mistake[];
  mocks: MockResult[];
  activity: { at: number; text: string; topic?: string }[];
  preferences: {
    theme: "light" | "dark" | "focus";
    interviewDate: string;
    dailyMinutes: number;
  };
  drafts: Record<string, string>;
}
