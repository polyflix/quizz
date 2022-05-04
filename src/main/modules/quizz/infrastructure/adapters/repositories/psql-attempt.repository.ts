import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Option, Result } from "@swan-io/boxed";
import { AttemptRepository } from "../../../domain/ports/repositories/attempt.repository";
import { Attempt } from "../../../domain/entities/attempt.entity";

@Injectable()
export class InPostgresAttemptRepository extends AttemptRepository {
  constructor(
    @InjectRepository(Attempt) readonly AttemptRepository: Repository<Attempt>
  ) {
    super();
  }

  /**
   * Find a specific Attempt
   * @param id id of the Attempt asked
   * @returns the focused Attempt
   */
  async findOne(id: string): Promise<Option<Attempt>> {
    return Option.fromNullable(await this.AttemptRepository.findOne(id));
  }

  /**
   * Find all Attempt
   * @returns all the Attempt
   */
  // TODO: add pagination
  async findAll(): Promise<Attempt[]> {
    return this.AttemptRepository.find();
  }

  /**
   * Create a Attempt into the database.
   * @param dto Attempt dto
   * @param userId the Attempt owner id
   * @returns the fresh entity
   */
  async save(Attempt: Attempt): Promise<Result<Attempt, Error>> {
    return Result.fromPromise(this.AttemptRepository.save(Attempt));
  }
}
