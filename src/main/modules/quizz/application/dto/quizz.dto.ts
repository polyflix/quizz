import { Type } from "class-transformer";
import { IsBoolean, IsEnum, IsOptional, IsString } from "class-validator";
import { Question } from "../../domain/models/question.model";
import { User } from "../../domain/models/user.model";
import { Visibility } from "../../infrastructure/adapters/repositories/entities/quizz.entity";

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

  @IsEnum(Visibility, { always: true })
  @IsOptional({ always: true })
  visibility: Visibility;

  @Type(() => User)
  user: User;
}

export class UpdateQuizzDTO extends CreateQuizzDTO {}
