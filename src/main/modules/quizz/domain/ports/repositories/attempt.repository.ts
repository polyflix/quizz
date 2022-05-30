import { Option, Result } from "@swan-io/boxed";
import { AttemptParams } from "../../../infrastructure/adapters/params/attempt.param";
import { Attempt } from "../../models/attempt.model";

export abstract class AttemptRepository {
  abstract findAll(params: AttemptParams): Promise<Attempt[]>;
  abstract findOne(id: string): Promise<Option<Attempt>>;
  abstract save(attempt: Attempt): Promise<Result<Attempt, Error>>;
}
