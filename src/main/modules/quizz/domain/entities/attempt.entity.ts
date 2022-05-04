import { Default } from "./default.entity";

export interface QuizzAnswers {
  [questionId: string]: string[];
}
export class Attempt extends Default {
  score: number;
  answers: QuizzAnswers;
  userId: string;
  quizzId: string;
}
