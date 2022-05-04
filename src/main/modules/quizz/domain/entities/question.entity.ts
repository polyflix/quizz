import { Alternative } from "./alternative.entity";
import { Default } from "./default.entity";
import { Quizz } from "./quizz.entity";

export class Question extends Default {
  index: number;
  label: string;
  alternatives: Alternative[];
  quizz?: Quizz;
}
