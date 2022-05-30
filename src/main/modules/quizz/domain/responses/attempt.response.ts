import { Attempt } from "../models/attempt.model";

export interface AttemptResponse {
  data: Attempt[];
  count: number;
  total: number;
  pageCount: number;
  page: number;
}
