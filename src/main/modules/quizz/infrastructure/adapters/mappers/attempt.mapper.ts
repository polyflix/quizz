import { AbstractMapper } from "src/main/core/helpers/abstract.mapper";
import { Attempt, AttemptProps } from "../../../domain/entities/attempt.entity";
import { AttemptEntity } from "../repositories/entities/attempt.entity";

export class AttemptEntityMapper extends AbstractMapper<
  AttemptEntity,
  Attempt
> {
  apiToEntity(apiModel: Attempt): AttemptEntity {
    const entity = new AttemptEntity();
    Object.assign(entity, apiModel);
    return entity;
  }

  entityToApi(entity: AttemptEntity): Attempt {
    const attempt = Attempt.create(Object.assign(new AttemptProps(), entity));
    Object.assign(attempt, entity);
    return attempt;
  }
}
