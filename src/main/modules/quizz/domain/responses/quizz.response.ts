import { Quizz } from "../models/quizz.model";

export interface QuizzResponse {
  data: Quizz[];
  count: number;
  total: number;
  pageCount: number;
  page: number;
}
