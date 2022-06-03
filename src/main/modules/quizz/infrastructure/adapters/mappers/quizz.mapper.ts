import { AbstractMapper } from "src/main/core/helpers/abstract.mapper";
import { Quizz, QuizzProps } from "../../../domain/models/quizz.model";
import { QuizzEntity } from "../repositories/entities/quizz.entity";

export class QuizzEntityMapper extends AbstractMapper<QuizzEntity, Quizz> {
  apiToEntity(apiModel: Quizz): QuizzEntity {
    const entity = new QuizzEntity();
    Object.assign(entity, apiModel);

    entity.keepHighestScore = apiModel.data.keepHighestScore;
    entity.allowedRetries = apiModel.data.allowedRetries;
    entity.questions = apiModel.data.questions;
    entity.user_id = apiModel.user.id;
    entity.user.lastName = apiModel.user.lastName;
    entity.user.firstName = apiModel.user.firstName;
    entity.user.avatar = apiModel.user.avatar;

    return entity;
  }

  entityToApi(entity: QuizzEntity): Quizz {
    const quizz = Quizz.create({
      name: entity.name,
      keepHighestScore: entity.keepHighestScore,
      allowedRetries: entity.allowedRetries,
      questions: entity.questions,
      user: {
        id: entity.user_id,
        lastName: entity.user.lastName,
        firstName: entity.user.firstName,
        avatar: entity.user.avatar
      },
      visibility: entity.visibility,
      draft: entity.draft,
      id: entity.id,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
      __v: entity.__v
    } as unknown as QuizzProps);
    return quizz;
  }
}
