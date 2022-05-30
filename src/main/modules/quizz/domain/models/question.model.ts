import { Alternative } from "./alternative.model";
import { Default } from "./default.model";

export class Question extends Default {
  index: number;
  label: string;
  alternatives: Alternative[];
}
