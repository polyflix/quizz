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

@Controller("quizzes")
export class QuizzController {
  constructor(private readonly quizzService: QuizzService) {}

  @Get()
  find(@Query() query: QuizzParams) {
    return this.quizzService.find(query);
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.quizzService.findOne(id);
  }

  @Post()
  create(@Body() createQuizzDto: CreateQuizzDTO) {
    return this.quizzService.create(createQuizzDto, "");
  }

  @Put(":id")
  completeOne(@Param("id") id: string, @Body() updateQuizzDto: UpdateQuizzDTO) {
    return this.quizzService.update(id, updateQuizzDto, "");
  }

  @Delete(":id")
  deleteOne(@Param("id") id: string) {
    return this.quizzService.delete(id, "");
  }
}
