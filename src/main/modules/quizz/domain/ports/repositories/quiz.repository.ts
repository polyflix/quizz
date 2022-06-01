import { Logger } from "@nestjs/common";
import { Option, Result } from "@swan-io/boxed";
import { QuizzParams } from "../../../infrastructure/adapters/params/quizz.param";
import { Quizz } from "../../models/quizz.model";

export abstract class QuizzRepository {
  protected readonly logger = new Logger(this.constructor.name);
  abstract findAll(params: QuizzParams): Promise<Quizz[]>;
  abstract findOne(id: string): Promise<Option<Quizz>>;
  abstract save(quizz: Quizz): Promise<Result<Quizz, Error>>;
  abstract remove(id: string): Result<unknown, Error>;
}
