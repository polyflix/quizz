import { Body, Controller, Get, Param, Post, Query } from "@nestjs/common";
import { CreateAttemptDto } from "../../application/dto/attempt.dto";
import { AttemptParams } from "../adapters/params/attempt.param";
import { AttemptService } from "../services/attempt.service";

@Controller("quizzes/:quizzId/attempts")
export class AttemptController {
  constructor(private readonly attemptService: AttemptService) {}

  @Get()
  find(@Param("quizzId") quizzId: string, @Query() query: AttemptParams) {
    // Return only attempts of the specified user
    return this.attemptService.find({ quizzId, ...query });
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.attemptService.findOne(id);
  }

  @Post()
  create(
    @Body() createAttemptDto: CreateAttemptDto,
    @Param("quizzId") quizzId: string
  ) {
    return this.attemptService.create(createAttemptDto, quizzId, "");
  }
}
