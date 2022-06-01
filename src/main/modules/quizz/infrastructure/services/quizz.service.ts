import {
  Injectable,
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
import { PsqlQuizzRepository } from "../adapters/repositories/psql-quizz.repository";

@Injectable()
export class QuizzService {
  private KAFKA_QUIZZ_TOPIC: string;

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
    const quizz = await this.quizzRepository.findOne(id);
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
    if (dto.user.id !== user.userId) {
      return Promise.reject(
        new UnauthorizedException("User ID provided don't match your user ID")
      );
    }

    const quizz = await this.quizzRepository.save(Quizz.create(dto));

    return quizz.match({
      Ok: (value: Quizz) => {
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
    // Get the entity and check if the user is the creator of the resource
    const focusedQuizz = await this.quizzRepository.findOne(id);

    if (
      focusedQuizz.isSome() &&
      (focusedQuizz.value.user.id !== user.userId || !user.isAdmin)
    ) {
      return Promise.reject(
        new UnauthorizedException("You are not the owner of this quizz")
      );
    }

    const quizz = await this.quizzRepository.save(
      Quizz.create({ id, ...focusedQuizz.value, ...dto })
    );
    return quizz.match({
      Ok: (value: Quizz) => {
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
      return new UnprocessableEntityException();
    }

    if (
      focusedQuizz.isSome() &&
      (focusedQuizz.value.user.id !== user.userId || !user.isAdmin)
    ) {
      return Promise.reject(
        new UnauthorizedException("You are not the owner of this quizz")
      );
    }

    focusedQuizz = focusedQuizz.value;

    const response = this.quizzRepository.remove(id);

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

    quizz.data.questions.forEach((q) => console.log(q));

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
}
