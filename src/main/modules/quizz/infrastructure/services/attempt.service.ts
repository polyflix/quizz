import {
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
  UnprocessableEntityException
} from "@nestjs/common";
import { CreateAttemptDto } from "../../application/dto/attempt.dto";
import { Attempt } from "../../domain/models/attempt.model";
import { PsqlAttemptRepository } from "../adapters/repositories/psql-attempt.repository";
import {
  AttemptParams,
  DefaultAttemptParams
} from "../adapters/params/attempt.param";
import { QuizzService } from "./quizz.service";
import { AttemptResponse } from "../../domain/responses/attempt.response";

@Injectable()
export class AttemptService {
  protected readonly logger = new Logger(QuizzService.name);

  constructor(
    readonly attemptRepository: PsqlAttemptRepository,
    readonly quizzService: QuizzService
  ) {}

  /**
   * Find a specific attempts
   * @param id id of the quizz attempts asked
   * @returns the attempts
   */
  async findOne(
    id: string,
    user: { userId: string; isAdmin: boolean }
  ): Promise<Attempt> {
    this.logger.debug(`Searching for attempt with id ${id}`);

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
  async find(
    params: AttemptParams = DefaultAttemptParams,
    user: { userId: string; isAdmin: boolean }
  ): Promise<AttemptResponse> {
    this.logger.debug(
      `Searching all attempts for user id ${user.userId} and quizz id ${params.quizzId}`
    );

    const quizz = await this.quizzService.findOne(params.quizzId, user, false);
    if (!quizz) {
      this.logger.debug(`Cannot found quizz with the id ${params.quizzId}`);

      throw new NotFoundException("Quizz not found");
    }

    const attempts = await this.attemptRepository.findAll(params);
    const totalAttempts = await this.attemptRepository.count(params);
    return {
      count: attempts.length,
      data: attempts,
      total: totalAttempts,
      pageCount: Math.ceil(totalAttempts / (params.pageSize || 10)),
      page: params.page || 1
    };
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
    user: { userId: string; isAdmin: boolean }
  ): Promise<Attempt> {
    this.logger.debug(
      `Handled attempts submission request for quizz with id ${quizzId} and user ${user.userId}`
    );

    const quizz = await this.quizzService.findOne(quizzId, user, true);

    if (dto.user.id !== user.userId) {
      this.logger.debug(
        `Rejected attempts submission request for quizz with id ${quizzId} and user ${dto.user.id}`
      );
      return Promise.reject(
        new UnauthorizedException("User ID provided don't match your user ID")
      );
    }

    const score = this.quizzService.computeScore(quizz, dto.answers);

    const attempt = await this.attemptRepository.save(
      Attempt.create({
        quizzId,
        score,
        ...dto
      })
    );

    return attempt.match({
      Ok: (value: Attempt) => {
        this.logger.debug(`Created attempt ${value.id}`);

        return value;
      },
      Error: () => {
        throw new UnprocessableEntityException("Attempt not created");
      }
    });
  }
}
