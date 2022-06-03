import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Quizz } from "../../../domain/models/quizz.model";
import { QuizzRepository } from "../../../domain/ports/repositories/quiz.repository";
import { Option, Result } from "@swan-io/boxed";
import { QuizzEntity } from "./entities/quizz.entity";
import { QuizzEntityMapper } from "../mappers/quizz.mapper";
import { QuizzFilter } from "../filters/quizz.filter";
import { DefaultQuizzParams, QuizzParams } from "../params/quizz.param";
import { QuestionEntity } from "./entities/question.entity";
import { AlternativeEntity } from "./entities/alternative.entity";

@Injectable()
export class PsqlQuizzRepository extends QuizzRepository {
  constructor(
    @InjectRepository(QuizzEntity)
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
    const quizz = await this.quizzRepository
      .createQueryBuilder("quizz")
      .leftJoinAndSelect("quizz.user", "user", "quizz.userId = user.userId")
      .leftJoinAndMapMany(
        "quizz.questions",
        QuestionEntity,
        "question",
        "quizz.id = question.quizzId"
      )
      .leftJoinAndMapMany(
        "question.alternatives",
        AlternativeEntity,
        "alternatives",
        "question.id = alternatives.questionId"
      )
      .where("quizz.id = :id", { id })
      .getOne();
    return quizz
      ? Option.Some<Quizz>(this.quizzEntityMapper.entityToApi(quizz))
      : Option.None<Quizz>();
  }

  /**
   * Find all quizz
   * @returns all the quizz
   */
  async findAll(params: QuizzParams = DefaultQuizzParams): Promise<Quizz[]> {
    const queryBuilder = this.quizzRepository
      .createQueryBuilder("quizz")
      .leftJoinAndSelect("quizz.user", "user", "quizz.userId = user.userId")
      .leftJoinAndMapMany(
        "quizz.questions",
        QuestionEntity,
        "question",
        "quizz.id = question.quizzId"
      );
    this.quizzFilter.buildFilters(queryBuilder, params);
    this.quizzFilter.buildPaginationAndSort(queryBuilder, params);

    const result = await queryBuilder.getMany();
    return this.quizzEntityMapper.entitiesToApis(result);
  }

  /**
   * Create a Quizz into the database.
   * @param quizz quizz
   * @returns the fresh entity
   */
  async save(quizz: Quizz): Promise<Result<Quizz, Error>> {
    this.logger.log(`Creating quizz ${quizz.name}`);
    const entity = this.quizzEntityMapper.apiToEntity(quizz);

    const res = await this.quizzRepository.save(entity);

    return Result.Ok(this.quizzEntityMapper.entityToApi(res));
  }

  /**
   * Delete a quizz and it's metadata
   * @param id the id of the quizz to delete
   * @param userId should be the id of the user who created the quizz
   * @returns
   */
  remove(id: string): Result<unknown, Error> {
    this.logger.log(`Deleting quizz with id ${id}`);

    const result = this.quizzRepository.delete(id);
    Result.fromPromise(result);
    return Result.fromExecution(() => result);
  }

  /**
   * Count the number of quizz
   * @param params
   * @returns
   */
  async count(params: QuizzParams = DefaultQuizzParams): Promise<number> {
    this.logger.log(`Counting quizzes availables`);

    const queryBuilder = this.quizzRepository.createQueryBuilder("quizz");
    this.quizzFilter.buildFilters(queryBuilder, params);
    return queryBuilder.getCount();
  }
}
