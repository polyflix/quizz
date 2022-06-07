import { IsBoolean, IsOptional, IsString, IsEnum } from "class-validator";
import { ToBoolean } from "src/main/core/types/dto.type";
import { Pagination } from "../../../../../core/types/pagination.type";
import { Visibility } from "../repositories/entities/quizz.entity";

export const DefaultQuizzParams: QuizzParams = {
  page: 1,
  pageSize: 10,
  draft: false
  // visibility: Visibility.PUBLIC
};

export class QuizzParams extends Pagination {
  @IsEnum(Visibility)
  @IsOptional()
  visibility?: Visibility;

  @IsBoolean()
  @ToBoolean()
  @IsOptional()
  draft: boolean;

  @IsOptional()
  @IsString()
  userId?: string;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @ToBoolean()
  @IsBoolean()
  isDone?: boolean;
}
