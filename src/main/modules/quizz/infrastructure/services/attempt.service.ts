import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { CreateAttemptDto } from "../../application/dto/create-attempt.dto";
import { Attempt } from "../../domain/entities/attempt.entity";
import { AttemptRepository } from "../../domain/ports/repositories/attempt.repository";
import { QuizzService } from "./quizz.service";

@Injectable()
export class AttemptService {
  constructor(
    @InjectRepository(Attempt)
    readonly attemptRepository: AttemptRepository,
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
   * Find all attempts for a specific user
   * @param userId id of the wanted user
   * @returns all the attempts of the user
   */
  //TODO: add pagination
  async findByUserId(userId: string): Promise<Attempt[]> {
    // FIXME: add options filter
    const attempts = await this.attemptRepository.findAll();

    return attempts.filter((attempt) => attempt.userId === userId);
  }

  /**
   * Find all attempts for all users
   * @returns all the attempts
   */
  // TODO: add pagination
  async find(quizzId: string): Promise<Attempt[]> {
    const attempts = await this.attemptRepository.findAll();

    return attempts.filter((attempt) => attempt.quizzId === quizzId);
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

    const attempt = await this.attemptRepository.save({
      userId,
      quizzId,
      score,
      ...dto
    });

    return attempt.match({
      Ok: (value: Attempt) => value,
      Error: () => {
        throw new UnprocessableEntityException("Attempt not created");
      }
    });
  }
}
