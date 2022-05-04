import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Quizz } from "../../../domain/entities/quizz.entity";
import { QuizzRepository } from "../../../domain/ports/repositories/quiz.repository";
import { Option, Result } from "@swan-io/boxed";
import { QuizzEntity } from "./entities/quizz.entity";
import { QuizzEntityMapper } from "../mappers/quizz.mapper";
import { QuizzFilter } from "../filters/quizz.filter";
import { DefaultQuizzParams, QuizzParams } from "../params/quizz.param";

@Injectable()
export class InPostgresQuizzRepository extends QuizzRepository {
  constructor(
    @InjectRepository(Quizz)
    private readonly quizzRepository: Repository<QuizzEntity>,
    private readonly quizzEntityMapper: QuizzEntityMapper,
    private readonly quizzFilter: QuizzFilter
  ) {
    super();
  }

  /**
   * Find a specific Quizz
   * @param id id of the quizz asked
   * @returns the focused quizz
   */
  async findOne(id: string): Promise<Option<Quizz>> {
    return Option.fromNullable<Quizz>(
      this.quizzEntityMapper.entityToApi(await this.quizzRepository.findOne(id))
    );
  }

  /**
   * Find all quizz
   * @returns all the quizz
   */
  async findAll(params: QuizzParams = DefaultQuizzParams): Promise<Quizz[]> {
    const queryBuilder = this.quizzRepository.createQueryBuilder("quizz");
    this.quizzFilter.buildFilters(queryBuilder, params);
    this.quizzFilter.buildPaginationAndSort(queryBuilder, params);

    const result = await queryBuilder.getMany();

    return this.quizzEntityMapper.entitiesToApis(result);
  }

  /**
   * Create a Quizz into the database.
   * @param dto quizz dto
   * @param userId the quizz owner id
   * @returns the fresh entity
   */
  async save(quizz: Quizz): Promise<Result<Quizz, Error>> {
    return Result.Ok(
      this.quizzEntityMapper.entityToApi(
        await this.quizzRepository.save(
          this.quizzEntityMapper.apiToEntity(quizz)
        )
      )
    );
  }

  /**
   * Delete a quizz and it's metadata
   * @param id the id of the quizz to delete
   * @param userId should be the id of the user who created the quizz
   * @returns
   */
  remove(id: string): Result<unknown, Error> {
    const result = this.quizzRepository.delete(id);
    Result.fromPromise(result);
    return Result.fromExecution(() => result);
  }
}
