import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
  UnprocessableEntityException
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import {
  CreateQuizzDTO,
  UpdateQuizzDTO
} from "../../application/dto/quizz.dto";
import { QuizzAnswers } from "../../domain/entities/attempt.entity";
import { Quizz } from "../../domain/entities/quizz.entity";
import {
  DefaultQuizzParams,
  QuizzParams
} from "../adapters/params/quizz.param";
import { InPostgresQuizzRepository } from "../adapters/repositories/psql-quizz.repository";

@Injectable()
export class QuizzService {
  constructor(
    @InjectRepository(Quizz) readonly quizzRepository: InPostgresQuizzRepository
  ) {}

  /**
   * Find a specific Quizz
   * @param id id of the quizz asked
   * @returns the focused quizz
   */
  async findOne(id: string): Promise<Quizz> {
    const quizz = await this.quizzRepository.findOne(id);

    return quizz.match({
      Some: (value: Quizz) => value,
      None: () => {
        throw new NotFoundException("Quizz not found");
      }
    });
  }

  /**
   * Find all quizz
   * @returns all the quizz
   */
  async find(params: QuizzParams = DefaultQuizzParams): Promise<Quizz[]> {
    return this.quizzRepository.findAll(params);
  }

  /**
   * Create a Quizz into the database.
   * @param dto quizz dto
   * @param userId the quizz owner id
   * @returns the fresh entity
   */
  async create(dto: CreateQuizzDTO, userId: string): Promise<Quizz> {
    const quizz = await this.quizzRepository.save(
      Quizz.create({
        userId,
        ...dto
      })
    );

    return quizz.match({
      Ok: (value: Quizz) => value,
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
    userId: string
  ): Promise<Quizz> {
    // Get the entity and check if the user is the creator of the resource
    const focusedQuizz = await this.quizzRepository.findOne(id);
    if (focusedQuizz.isSome() && focusedQuizz.value.userId !== userId) {
      throw new UnauthorizedException("You are not the owner of this quizz");
    }

    const quizz = await this.quizzRepository.save(
      Quizz.create({ id, userId, ...dto })
    );

    return quizz.match({
      Ok: (value: Quizz) => value,
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
  async delete(id: string, userId: string) {
    // Get the entity and check if the user is the creator of the resource
    const focusedQuizz = await this.quizzRepository.findOne(id);
    if (focusedQuizz.isSome() && focusedQuizz.value.userId !== userId) {
      throw new UnauthorizedException("You are not the owner of this quizz");
    }
    return this.quizzRepository.remove(id);
  }

  /**
   * Compute the score of the quizz with the answers received
   */
  computeScore(quizz: Quizz, answers: QuizzAnswers): number {
    let score = 0;
    let malus = 0;

    Object.entries(answers).forEach(([questionId, questionAnswers]) => {
      const { alternatives } = quizz.questions.find((q) => q.id === questionId);
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
