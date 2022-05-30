import { Body, Controller, Get, Param, Post, Query } from "@nestjs/common";
import { IsAdmin, MeId } from "@polyflix/x-utils";
import { CreateAttemptDto } from "../../application/dto/attempt.dto";
import { AttemptParams } from "../adapters/params/attempt.param";
import { AttemptService } from "../services/attempt.service";

@Controller("quizzes/:quizzId/attempts")
export class AttemptController {
  constructor(private readonly attemptService: AttemptService) {}

  @Get()
  find(
    @Param("quizzId") quizzId: string,
    @Query() query: AttemptParams,
    @MeId() userId: string,
    @IsAdmin() isAdmin: boolean
  ) {
    // Return only attempts of the specified user
    return this.attemptService.find(
      { quizzId, ...query },
      {
        userId,
        isAdmin
      }
    );
  }

  @Get(":id")
  findOne(
    @Param("id") id: string,
    @MeId() userId: string,
    @IsAdmin() isAdmin: boolean
  ) {
    return this.attemptService.findOne(id, {
      userId,
      isAdmin
    });
  }

  @Post()
  create(
    @Body() createAttemptDto: CreateAttemptDto,
    @Param("quizzId") quizzId: string,
    @MeId() userId: string,
    @IsAdmin() isAdmin: boolean
  ) {
    return this.attemptService.create(createAttemptDto, quizzId, {
      userId,
      isAdmin
    });
  }
}
