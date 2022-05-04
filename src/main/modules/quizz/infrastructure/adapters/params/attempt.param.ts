import { IsOptional, IsString } from "class-validator";
import { Pagination } from "../../../../../core/types/pagination.type";

export const DefaultAttemptParams: AttemptParams = {
  page: 1,
  pageSize: 10
};

export class AttemptParams extends Pagination {
  @IsOptional()
  @IsString()
  userId?: string;

  @IsOptional()
  @IsString()
  quizzId?: string;
}
