import { Type } from "class-transformer";
import { IsObject } from "class-validator";
import { QuizzAnswers } from "../../domain/models/attempt.model";
import { User } from "../../domain/models/user.model";

export class CreateAttemptDto {
  @IsObject()
  answers: QuizzAnswers;

  @Type(() => User)
  user: User;
}
