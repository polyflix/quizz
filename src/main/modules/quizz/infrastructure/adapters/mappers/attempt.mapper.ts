import { AbstractMapper } from "src/main/core/helpers/abstract.mapper";
import { Attempt, AttemptProps } from "../../../domain/models/attempt.model";
import { AttemptEntity } from "../repositories/entities/attempt.entity";

export class AttemptEntityMapper extends AbstractMapper<
  AttemptEntity,
  Attempt
> {
  apiToEntity(apiModel: Attempt): AttemptEntity {
    const entity = new AttemptEntity();
    Object.assign(entity, apiModel);
    entity.user_id = apiModel.user.id;
    entity.user_lastName = apiModel.user.lastName;
    entity.user_firstName = apiModel.user.firstName;
    entity.user_avatar = apiModel.user.avatar;
    return entity;
  }

  entityToApi(entity: AttemptEntity): Attempt {
    const attempt = Attempt.create({
      id: entity.id,
      quizzId: entity.quizzId,
      score: entity.score,
      answers: entity.answers,
      user: {
        id: entity.user_id,
        lastName: entity.user_lastName,
        firstName: entity.user_firstName,
        avatar: entity.user_avatar
      },
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
      __v: entity.__v
    } as unknown as AttemptProps);

    return attempt;
  }
}
