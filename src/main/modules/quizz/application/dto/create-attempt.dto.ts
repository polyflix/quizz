import { IsObject } from "class-validator";
import { QuizzAnswers } from "../../domain/entities/attempt.entity";

export class CreateAttemptDto {
  @IsObject()
  answers: QuizzAnswers;
}
