import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { QuizzController } from "./controllers/quizz.controller";
import { AttemptController } from "./controllers/attempt.controller";
import { AttemptService } from "./services/attempt.service";
import { QuizzService } from "./services/quizz.service";
import { AttemptEntity } from "./adapters/repositories/entities/attempt.entity";
import { QuizzEntity } from "./adapters/repositories/entities/quizz.entity";
import { AlternativeEntity } from "./adapters/repositories/entities/alternative.entity";
import { QuestionEntity } from "./adapters/repositories/entities/question.entity";
import { PsqlQuizzRepository } from "./adapters/repositories/psql-quizz.repository";
import { QuizzRepository } from "../domain/ports/repositories/quiz.repository";
import { QuizzFilter } from "./adapters/filters/quizz.filter";
import { QuizzEntityMapper } from "./adapters/mappers/quizz.mapper";
import { AttemptRepository } from "../domain/ports/repositories/attempt.repository";
import { PsqlAttemptRepository } from "./adapters/repositories/psql-attempt.repository";
import { AttemptFilter } from "./adapters/filters/attempt.filter";
import { AttemptEntityMapper } from "./adapters/mappers/attempt.mapper";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      QuizzEntity,
      AlternativeEntity,
      QuestionEntity,
      AttemptEntity
    ])
  ],
  controllers: [QuizzController, AttemptController],
  providers: [
    QuizzService,
    AttemptService,
    PsqlQuizzRepository,
    PsqlAttemptRepository,
    QuizzFilter,
    AttemptFilter,
    QuizzEntityMapper,
    AttemptEntityMapper,
    { provide: QuizzRepository, useClass: PsqlQuizzRepository },
    { provide: AttemptRepository, useClass: PsqlAttemptRepository }
  ],
  exports: [QuizzService, AttemptService]
})
export class QuizzModule {}
