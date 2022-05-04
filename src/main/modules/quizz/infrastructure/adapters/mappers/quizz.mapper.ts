import { AbstractMapper } from "src/main/core/helpers/abstract.mapper";
import { Quizz, QuizzProps } from "../../../domain/entities/quizz.entity";
import { QuizzEntity } from "../repositories/entities/quizz.entity";

export class QuizzEntityMapper extends AbstractMapper<QuizzEntity, Quizz> {
  apiToEntity(apiModel: Quizz): QuizzEntity {
    const entity = new QuizzEntity();
    Object.assign(entity, apiModel);
    return entity;
  }

  entityToApi(entity: QuizzEntity): Quizz {
    const quizz = Quizz.create(Object.assign(new QuizzProps(), entity));
    Object.assign(quizz, entity);
    return quizz;
  }
}
