import { Question } from "./question.entity";
import { Default } from "./default.entity";

export class Alternative extends Default {
  label: string;
  isCorrect: boolean;
  question?: Question;
}
