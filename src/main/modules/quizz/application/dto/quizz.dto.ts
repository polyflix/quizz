import { Type } from "class-transformer";
import { IsBoolean, IsOptional, IsString } from "class-validator";
import { Question } from "../../domain/models/question.model";
import { User } from "../../domain/models/user.model";

export class CreateQuizzDTO {
  @IsString({ always: true })
  name: string;

  @IsBoolean({ always: true })
  @IsOptional({ always: true })
  keepHighestScore: boolean;

  @IsOptional({ always: true })
  allowedRetries: number;

  @Type(() => Question)
  questions: Question[];

  @IsBoolean({ always: true })
  @IsOptional({ always: true })
  draft: boolean;

  @Type(() => User)
  user: User;
}

export class UpdateQuizzDTO extends CreateQuizzDTO {}
