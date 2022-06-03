import { Injectable } from "@nestjs/common";
import { AbstractMapper } from "src/main/core/helpers/abstract.mapper";
import { allColors } from "winston/lib/winston/config";
import { Quizz, QuizzProps } from "../../../domain/models/quizz.model";
import { User } from "../../../domain/models/user.model";
import { QuizzEntity, Visibility } from "../repositories/entities/quizz.entity";
import { UserEntityMapper } from "./user.mapper";

@Injectable()
export class QuizzEntityMapper extends AbstractMapper<QuizzEntity, Quizz> {
  constructor(private readonly userEntityMapper: UserEntityMapper) {
    super();
  }

  apiToEntity(apiModel: Quizz): QuizzEntity {
    const entity: QuizzEntity = {
      keepHighestScore: apiModel.data?.keepHighestScore,
      allowedRetries: apiModel.data?.allowedRetries,
      questions: apiModel.data?.questions,
      user: this.userEntityMapper.apiToEntity(apiModel.user),
      name: apiModel.name,
      draft: apiModel.draft,
      visibility: apiModel.visibility
    };

    if (apiModel.id) {
      entity.id = apiModel.id;
    }

    return Object.assign(new QuizzEntity(), entity);
  }

  entityToApi(entity: QuizzEntity): Quizz {
    const quizzProps: QuizzProps = {
      name: entity.name,
      keepHighestScore: entity.keepHighestScore,
      allowedRetries: entity.allowedRetries,
      questions: entity.questions,
      user: this.userEntityMapper.entityToApi(entity.user),
      visibility: entity.visibility,
      draft: entity.draft,
      id: entity.id,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
      __v: entity.__v
    };

    return Quizz.create(Object.assign(new QuizzProps(), quizzProps));
  }
}
