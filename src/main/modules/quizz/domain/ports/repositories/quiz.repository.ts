import { Option, Result } from "@swan-io/boxed";
import { Quizz } from "../../entities/quizz.entity";

export abstract class QuizzRepository {
  abstract findAll(): Promise<Quizz[]>;
  abstract findOne(id: string): Promise<Option<Quizz>>;
  abstract save(quizz: Quizz): Promise<Result<Quizz, Error>>;
  abstract remove(id: string): Result<unknown, Error>;
}
