import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Quizz } from "../../../domain/entities/quizz.entity";
import { QuizzRepository } from "../../../domain/ports/repositories/quiz.repository";
import { Option, Result } from "@swan-io/boxed";

@Injectable()
export class InPostgresQuizzRepository extends QuizzRepository {
  constructor(
    @InjectRepository(Quizz) readonly quizzRepository: Repository<Quizz>
  ) {
    super();
  }

  /**
   * Find a specific Quizz
   * @param id id of the quizz asked
   * @returns the focused quizz
   */
  async findOne(id: string): Promise<Option<Quizz>> {
    return Option.fromNullable(await this.quizzRepository.findOne(id));
  }

  /**
   * Find all quizz
   * @returns all the quizz
   */
  // TODO: add pagination
  async findAll(): Promise<Quizz[]> {
    return this.quizzRepository.find();
  }

  /**
   * Create a Quizz into the database.
   * @param dto quizz dto
   * @param userId the quizz owner id
   * @returns the fresh entity
   */
  async save(quizz: Quizz): Promise<Result<Quizz, Error>> {
    return Result.fromPromise(this.quizzRepository.save(quizz));
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
