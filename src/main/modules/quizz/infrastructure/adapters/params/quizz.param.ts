import { IsBoolean, IsOptional, IsString } from "class-validator";
import { Pagination } from "../../../../../core/types/pagination.type";

export const DefaultQuizzParams: QuizzParams = {
  page: 1,
  pageSize: 10,
  draft: false
  // visibility: Visibility.PUBLIC
};

export class QuizzParams extends Pagination {
  // @IsEnum(Visibility)
  // @IsOptional()
  // visibility?: Visibility;

  @IsBoolean()
  @IsOptional()
  draft: boolean;

  @IsOptional()
  @IsString()
  userId?: string;

  @IsOptional()
  @IsString()
  name?: string;
}
