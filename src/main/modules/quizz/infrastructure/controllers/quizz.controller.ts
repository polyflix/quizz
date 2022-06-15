import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query
} from "@nestjs/common";
import {
  CreateQuizzDTO,
  UpdateQuizzDTO
} from "../../application/dto/quizz.dto";
import { QuizzParams } from "../adapters/params/quizz.param";
import { QuizzService } from "../services/quizz.service";
import { IsAdmin, MeId } from "@polyflix/x-utils";

@Controller("quizzes")
export class QuizzController {
  constructor(private readonly quizzService: QuizzService) {}

  @Get()
  find(
    @Query() query: QuizzParams,
    @MeId() userId: string,
    @IsAdmin() isAdmin: boolean
  ) {
    return this.quizzService.find(query, { userId, isAdmin });
  }

  @Get(":id")
  findOne(
    @Query("solved") getResponse: boolean,
    @Param("id") id: string,
    @MeId() userId: string,
    @IsAdmin() isAdmin: boolean
  ) {
    return this.quizzService.findOne(
      id,
      { userId, isAdmin },
      false,
      getResponse
    );
  }

  @Post()
  create(@Body() createQuizzDto: CreateQuizzDTO, @MeId() userId: string) {
    return this.quizzService.create(createQuizzDto, { userId });
  }

  @Put(":id")
  completeOne(
    @Param("id") id: string,
    @Body() updateQuizzDto: UpdateQuizzDTO,
    @MeId() userId: string,
    @IsAdmin() isAdmin: boolean
  ) {
    return this.quizzService.update(id, updateQuizzDto, { userId, isAdmin });
  }

  @Delete(":id")
  deleteOne(
    @Param("id") id: string,
    @MeId() userId: string,
    @IsAdmin() isAdmin: boolean
  ) {
    return this.quizzService.delete(id, { userId, isAdmin });
  }
}
