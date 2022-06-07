import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseBoolPipe,
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
import { isBoolean } from "class-validator";
import { query } from "express";

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
    @Param("id") id: string,
    @MeId() userId: string,
    @IsAdmin() isAdmin: boolean
  ) {
    return this.quizzService.findOne(id, { userId, isAdmin });
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
