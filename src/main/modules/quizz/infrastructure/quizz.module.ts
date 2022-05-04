import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Alternative } from "../domain/entities/alternative.entity";
import { Question } from "../domain/entities/question.entity";
import { Attempt } from "../domain/entities/attempt.entity";
import { Quizz } from "../domain/entities/quizz.entity";
import { QuizzController } from "./controllers/quizz.controller";
import { AttemptController } from "./controllers/attempt.controller";
import { AttemptService } from "./services/attempt.service";
import { QuizzService } from "./services/quizz.service";

@Module({
  imports: [TypeOrmModule.forFeature([Quizz, Alternative, Question, Attempt])],
  controllers: [QuizzController, AttemptController],
  providers: [QuizzService, AttemptService],
  exports: [QuizzService, AttemptService]
})
export class QuizzModule {}
