import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Option, Result } from "@swan-io/boxed";
import { AttemptRepository } from "../../../domain/ports/repositories/attempt.repository";
import { Attempt } from "../../../domain/models/attempt.model";
import { AttemptEntityMapper } from "../mappers/attempt.mapper";
import { AttemptEntity } from "./entities/attempt.entity";
import { AttemptFilter } from "../filters/attempt.filter";
import { AttemptParams, DefaultAttemptParams } from "../params/attempt.param";

@Injectable()
export class PsqlAttemptRepository extends AttemptRepository {
  constructor(
    @InjectRepository(AttemptEntity)
    readonly attemptRepository: Repository<AttemptEntity>,
    private readonly attemptEntityMapper: AttemptEntityMapper,
    private readonly attemptFilter: AttemptFilter
  ) {
    super();
  }

  /**
   * Find a specific Attempt
   * @param id id of the Attempt asked
   * @returns the focused Attempt
   */
  async findOne(id: string): Promise<Option<Attempt>> {
    return Option.fromNullable<Attempt>(
      this.attemptEntityMapper.entityToApi(
        await this.attemptRepository.findOne(id)
      )
    );
  }

  /**
   * Find all Attempt
   * @returns all the Attempt
   */
  async findAll(
    params: AttemptParams = DefaultAttemptParams
  ): Promise<Attempt[]> {
    const queryBuilder = this.attemptRepository
      .createQueryBuilder("attempt")
      .leftJoinAndSelect(
        "attempt.user",
        "user",
        "attempt.userId = user.userId"
      );
    this.attemptFilter.buildFilters(queryBuilder, params);
    this.attemptFilter.buildPaginationAndSort(queryBuilder, params);

    const result = await queryBuilder.getMany();

    return this.attemptEntityMapper.entitiesToApis(result);
  }

  /**
   * Create a Attempt into the database.
   * @param dto Attempt dto
   * @param userId the Attempt owner id
   * @returns the fresh entity
   */
  async save(Attempt: Attempt): Promise<Result<Attempt, Error>> {
    return Result.Ok(
      this.attemptEntityMapper.entityToApi(
        await this.attemptRepository.save(
          this.attemptEntityMapper.apiToEntity(Attempt)
        )
      )
    );
  }

  /**
   * Count the number of attempts
   * @param params
   * @returns
   */
  async count(params: AttemptParams = DefaultAttemptParams): Promise<number> {
    const queryBuilder = this.attemptRepository.createQueryBuilder("attempt");
    this.attemptFilter.buildFilters(queryBuilder, params);
    return queryBuilder.getCount();
  }
}
