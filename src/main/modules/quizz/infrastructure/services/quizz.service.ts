import {
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
  UnprocessableEntityException
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { ClientKafka } from "@nestjs/microservices";
import {
  InjectKafkaClient,
  PolyflixKafkaMessage,
  TriggerType
} from "@polyflix/x-utils";
import {
  CreateQuizzDTO,
  UpdateQuizzDTO
} from "../../application/dto/quizz.dto";
import { QuizzAnswers } from "../../domain/models/attempt.model";
import { Quizz } from "../../domain/models/quizz.model";
import { QuizzResponse } from "../../domain/responses/quizz.response";
import {
  DefaultQuizzParams,
  QuizzParams
} from "../adapters/params/quizz.param";
import { Visibility } from "../adapters/repositories/entities/quizz.entity";
import { PsqlQuizzRepository } from "../adapters/repositories/psql-quizz.repository";

@Injectable()
export class QuizzService {
  private KAFKA_QUIZZ_TOPIC: string;
  protected readonly logger = new Logger(QuizzService.name);

  constructor(
    readonly quizzRepository: PsqlQuizzRepository,
    private readonly configService: ConfigService,
    @InjectKafkaClient() private readonly kafkaClient: ClientKafka
  ) {
    this.KAFKA_QUIZZ_TOPIC =
      this.configService.get<string>("kafka.topics.quizz");
  }

  /**
   * Find a specific Quizz
   * @param id id of the quizz asked
   * @returns the focused quizz
   */
  async findOne(
    id: string,
    user: { userId: string; isAdmin: boolean },
    solved = false
  ): Promise<Quizz> {
    this.logger.debug(`Searching for quizz with id ${id}`);

    const quizz = await this.quizzRepository.findOne(id);
    quizz.isSome()
      ? this.logger.debug(`Quizz found by id`)
      : this.logger.debug(`Quizz not found by id`);

    if (
      quizz.isNone() ||
      (quizz.value.user.id !== user.userId && !user.isAdmin)
    ) {
      solved = false;
    }

    if (
      quizz.isSome() &&
      (quizz.value.visibility === Visibility.PRIVATE ||
        quizz.value.draft === true) &&
      quizz.value.user.id !== user.userId &&
      !user.isAdmin
    ) {
      throw new ForbiddenException("You can't access this private quizz");
    }

    return quizz.match({
      Some: (value: Quizz) => (solved ? value : this.removeSolutions(value)),
      None: () => {
        throw new NotFoundException("Quizz not found");
      }
    });
  }

  /**
   * Find all quizz
   * @returns all the quizz
   */
  async find(
    params: QuizzParams = DefaultQuizzParams,
    user: { userId: string; isAdmin: boolean }
  ): Promise<QuizzResponse> {
    this.logger.debug(`Searching for all quizzes`);

    params = this.validateParams(params, user);

    const quizzes = await this.quizzRepository.findAll(params);
    const totalQuizzes = await this.quizzRepository.count(params);
    return {
      count: quizzes.length,
      data: quizzes,
      total: totalQuizzes,
      pageCount: Math.ceil(totalQuizzes / (params.pageSize || 10)),
      page: params.page || 1
    };
  }

  /**
   * Create a Quizz into the database.
   * @param dto quizz dto
   * @param userId the quizz owner id
   * @returns the fresh entity
   */
  async create(dto: CreateQuizzDTO, user: { userId: string }): Promise<Quizz> {
    this.logger.debug(`Handled quizz creation request for quizz ${dto.name}`);
    if (dto.user.id !== user.userId) {
      this.logger.debug(
        `Rejected quizz creation request for quizz ${dto.name} and user ${dto.user.id}`
      );

      return Promise.reject(
        new UnauthorizedException("User ID provided don't match your user ID")
      );
    }

    const quizz = await this.quizzRepository.save(Quizz.create(dto));

    return quizz.match({
      Ok: (value: Quizz) => {
        this.logger.debug(`Created quizz ${value.name}`);
        this.kafkaClient.emit<string, PolyflixKafkaMessage>(
          this.KAFKA_QUIZZ_TOPIC,
          {
            key: value.id,
            value: {
              trigger: TriggerType.CREATE,
              payload: value
            }
          }
        );
        return value;
      },
      Error: () => {
        throw new UnprocessableEntityException("Quizz not created");
      }
    });
  }

  /**
   * Update a quizz with new dto
   * @param id the id of the quizz to delete
   * @param dto the new quizz dto
   * @param userId should be the id of the user who created the quizz
   * @returns
   */
  async update(
    id: string,
    dto: UpdateQuizzDTO,
    user: { userId: string; isAdmin: boolean }
  ): Promise<Quizz> {
    this.logger.debug(`Handled quizz update request for quizz ${dto.name}`);

    // Get the entity and check if the user is the creator of the resource
    const focusedQuizz = await this.quizzRepository.findOne(id);
    focusedQuizz.isSome()
      ? this.logger.debug(`Succefully found existing quizz named ${dto.name}`)
      : this.logger.debug(`Cannot find the specified quizz named ${dto.name}`);

    if (
      focusedQuizz.isNone() ||
      (focusedQuizz.value.user.id !== user.userId && !user.isAdmin)
    ) {
      this.logger.debug(
        `Rejected quizz update request for quizz ${dto.name} and user ${dto.user.id}`
      );
      return Promise.reject(
        new UnauthorizedException("You are not the owner of this quizz")
      );
    }

    const quizz = await this.quizzRepository.save(
      Quizz.create({ id, ...focusedQuizz.value, ...dto })
    );

    return quizz.match({
      Ok: (value: Quizz) => {
        this.logger.debug(`Created quizz ${dto.name}`);
        this.kafkaClient.emit<string, PolyflixKafkaMessage>(
          this.KAFKA_QUIZZ_TOPIC,
          {
            key: value.id,
            value: {
              trigger: TriggerType.UPDATE,
              payload: value
            }
          }
        );
        return value;
      },
      Error: () => {
        throw new UnprocessableEntityException("Quizz not updated");
      }
    });
  }

  /**
   * Delete a quizz and it's metadata
   * @param id the id of the quizz to delete
   * @param userId should be the id of the user who created the quizz
   * @returns
   */
  async delete(id: string, user: { userId: string; isAdmin: boolean }) {
    // Get the entity and check if the user is the creator of the resource
    let focusedQuizz;
    try {
      focusedQuizz = await this.quizzRepository.findOne(id);
    } catch {
      this.logger.debug(
        `Cannot found quizz corresponding to the specified id ${id}`
      );
      return new UnprocessableEntityException();
    }

    if (
      focusedQuizz.isNone() ||
      (focusedQuizz.value.user.id !== user.userId && !user.isAdmin)
    ) {
      this.logger.debug(
        `Rejected quizz deletion request for quizz with id ${id} and user with id ${user.userId}`
      );
      return Promise.reject(
        new UnauthorizedException("You are not the owner of this quizz")
      );
    }

    focusedQuizz = focusedQuizz.value;

    const response = this.quizzRepository.remove(id);

    this.logger.debug(`Deleted quizz ${focusedQuizz.name}`);

    this.kafkaClient.emit<string, PolyflixKafkaMessage>(
      this.KAFKA_QUIZZ_TOPIC,
      {
        key: focusedQuizz.id,
        value: {
          trigger: TriggerType.DELETE,
          payload: focusedQuizz
        }
      }
    );

    return { response: { statusCode: response.tag } };
  }

  /**
   *  Remove quizz questions solutions
   * @param quizz
   * @returns quizz
   */
  removeSolutions(quizz: Quizz): Quizz {
    this.logger.debug(`Removing answers solutions for quizz ${quizz.name}`);
    quizz.data.questions.forEach((question) => {
      question.alternatives.forEach((alternative) => {
        delete alternative.isCorrect;
      });
    });
    return quizz;
  }

  /**
   * Compute the score of the quizz with the answers received
   */
  computeScore(quizz: Quizz, answers: QuizzAnswers): number {
    let score = 0;
    let malus = 0;
    this.logger.debug(`Computing score for quizz ${quizz.name}`);

    Object.entries(answers).forEach(([questionId, questionAnswers]) => {
      const { alternatives } = quizz.data.questions.find(
        (q) => q.id === questionId
      );
      // The total correct alternatives for the question
      const totalGoodAlt = alternatives.filter(
        ({ isCorrect }) => isCorrect
      ).length;

      // The total correct alternatives in the user answers
      const totalUserGoodAlt = alternatives.filter(
        ({ id, isCorrect }) => questionAnswers.includes(id) && isCorrect
      ).length;

      const hasMalus = questionAnswers.length > totalGoodAlt;
      if (hasMalus) {
        malus +=
          (questionAnswers.length - totalUserGoodAlt) / alternatives.length;
      }

      score += totalUserGoodAlt / totalGoodAlt;
    });

    return score - malus;
  }

  /**
   * Validate the params asked by the User
   * @param params the params
   * @param user the user
   * @returns the validated params
   */
  validateParams(
    params: QuizzParams,
    user: { userId: string; isAdmin: boolean }
  ): QuizzParams {
    this.logger.debug(`Validating params for quizz`);

    // Admin can use all by default
    if (user.isAdmin) return params;
    if (params.userId !== user.userId) {
      // User can see other draft params
      params.draft = false;

      // User can't see other private quizz
      params.visibility =
        params.visibility == Visibility.PRIVATE
          ? Visibility.PUBLIC
          : params.visibility;
    }

    return params;
  }
}
