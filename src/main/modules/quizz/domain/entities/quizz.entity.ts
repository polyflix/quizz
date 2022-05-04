import { Question } from "./question.entity";
import { Default } from "./default.entity";

export class Quizz extends Default {
  name: string;
  keepHighestScore: boolean;
  allowedRetries: number;
  questions: Question[];
  userId: string;
}
