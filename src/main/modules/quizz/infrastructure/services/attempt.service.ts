import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { CreateAttemptDto } from "../../application/dto/create-attempt.dto";
import { Attempt } from "../../domain/entities/attempt.entity";
import { PsqlAttemptRepository } from "../adapters/repositories/psql-attempt.repository";
import {
  AttemptParams,
  DefaultAttemptParams
} from "../adapters/params/attempt.param";
import { QuizzService } from "./quizz.service";

@Injectable()
export class AttemptService {
  constructor(
    readonly attemptRepository: PsqlAttemptRepository,
    readonly quizzService: QuizzService
  ) {}

  /**
   * Find a specific attempts
   * @param id id of the quizz attempts asked
   * @returns the attempts
   */
  async findOne(id: string): Promise<Attempt> {
    const attempt = await this.attemptRepository.findOne(id);

    return attempt.match({
      Some: (value: Attempt) => value,
      None: () => {
        throw new NotFoundException("Attempt not found");
      }
    });
  }

  /**
   * Find all attempts for all users
   * @returns all the attempts
   */
  async find(params: AttemptParams = DefaultAttemptParams): Promise<Attempt[]> {
    const attempts = await this.attemptRepository.findAll(params);

    return attempts;
  }

  /**
   * Create a attempts into the database.
   * @param dto attempt dto
   * @param userId the id of the user submitting
   * @returns the fresh entity
   */
  async create(
    dto: CreateAttemptDto,
    quizzId: string,
    userId: string
  ): Promise<Attempt> {
    const quizz = await this.quizzService.findOne(quizzId);
    const score = this.quizzService.computeScore(quizz, dto.answers);

    const attempt = await this.attemptRepository.save(
      Attempt.create({
        userId,
        quizzId,
        score,
        ...dto
      })
    );

    return attempt.match({
      Ok: (value: Attempt) => value,
      Error: () => {
        throw new UnprocessableEntityException("Attempt not created");
      }
    });
  }
}
