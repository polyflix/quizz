import { Question } from "./question.model";
import { Default } from "./default.model";

export class Alternative extends Default {
  label: string;
  isCorrect: boolean;
  question?: Question;
}
