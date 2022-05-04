import { IsOptional, IsString } from "class-validator";
import { Pagination } from "../../../../../core/types/pagination.type";

export const DefaultQuizzParams: QuizzParams = {
  page: 1,
  pageSize: 10
  // visibility: Visibility.PUBLIC
};

export class QuizzParams extends Pagination {
  // @IsEnum(Visibility)
  // @IsOptional()
  // visibility?: Visibility;

  @IsOptional()
  @IsString()
  userId?: string;

  @IsOptional()
  @IsString()
  name?: string;
}
