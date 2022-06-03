import { Injectable } from "@nestjs/common";
import { AbstractMapper } from "src/main/core/helpers/abstract.mapper";
import { Attempt, AttemptProps } from "../../../domain/models/attempt.model";
import { AttemptEntity } from "../repositories/entities/attempt.entity";
import { UserEntityMapper } from "./user.mapper";

@Injectable()
export class AttemptEntityMapper extends AbstractMapper<
  AttemptEntity,
  Attempt
> {
  constructor(private readonly userEntityMapper: UserEntityMapper) {
    super();
  }
  apiToEntity(apiModel: Attempt): AttemptEntity {
    const entity = new AttemptEntity();
    Object.assign(entity, apiModel);
    entity.user = this.userEntityMapper.apiToEntity(apiModel.user);

    return entity;
  }

  entityToApi(entity: AttemptEntity): Attempt {
    const attempt = Attempt.create({
      id: entity.id,
      quizzId: entity.quizzId,
      score: entity.score,
      answers: entity.answers,
      user: this.userEntityMapper.entityToApi(entity.user),
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
      __v: entity.__v
    } as unknown as AttemptProps);

    return attempt;
  }
}
