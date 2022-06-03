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
import { UserEntity } from "./adapters/repositories/entities/user.entity";
import { UserService } from "./services/user.service";
import { UserController } from "./controllers/user.controller";
import {
  UserApiMapper,
  UserEntityMapper
} from "./adapters/mappers/user.mapper";
import { UserRepository } from "../domain/ports/repositories/user.repository";
import { PsqlUserRepository } from "./adapters/repositories/psql-user.repository";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      QuizzEntity,
      UserEntity,
      AlternativeEntity,
      QuestionEntity,
      AttemptEntity
    ])
  ],
  controllers: [QuizzController, AttemptController, UserController],
  providers: [
    QuizzService,
    AttemptService,
    PsqlQuizzRepository,
    PsqlAttemptRepository,
    UserService,
    QuizzFilter,
    AttemptFilter,
    QuizzEntityMapper,
    AttemptEntityMapper,
    UserEntityMapper,
    UserApiMapper,
    { provide: QuizzRepository, useClass: PsqlQuizzRepository },
    { provide: AttemptRepository, useClass: PsqlAttemptRepository },
    { provide: UserRepository, useClass: PsqlUserRepository }
  ],
  exports: [QuizzService, AttemptService, UserService]
})
export class QuizzModule {}
