import { Option, Result } from "@swan-io/boxed";
import { Attempt } from "../../entities/attempt.entity";

export abstract class AttemptRepository {
  abstract findAll(): Promise<Attempt[]>;
  abstract findOne(id: string): Promise<Option<Attempt>>;
  abstract save(attempt: Attempt): Promise<Result<Attempt, Error>>;
}
