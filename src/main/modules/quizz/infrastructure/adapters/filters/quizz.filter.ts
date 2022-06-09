import { Injectable } from "@nestjs/common";
import { has } from "lodash";
import { SelectQueryBuilder } from "typeorm";
import { AbstractFilter } from "./abstract.filter";
import { QuizzParams } from "../params/quizz.param";
import { QuizzEntity, Visibility } from "../repositories/entities/quizz.entity";
import { AttemptEntity } from "../repositories/entities/attempt.entity";

@Injectable()
export class QuizzFilter extends AbstractFilter<QuizzEntity> {
  buildFilters(
    queryBuilder: SelectQueryBuilder<QuizzEntity>,
    params: QuizzParams
  ): void {
    if (has(params, "name")) {
      queryBuilder.andWhere("quizz.name = :name", { name: params.name });
    }

    if (has(params, "userId")) {
      queryBuilder.andWhere("quizz.userId = :userId", {
        userId: params.userId
      });
      if (has(params, "isDone")) {
        queryBuilder.innerJoinAndSelect(
          AttemptEntity,
          "attempt",
          "quizz.id = attempt.quizzId"
        );
      }
    }

    if (has(params, "draft")) {
      if (params.draft == false) {
        queryBuilder.andWhere("quizz.draft = :draft", {
          draft: params.draft
        });
      }
    }

    if (has(params, "visibility")) {
      if (params.visibility === Visibility.PUBLIC) {
        queryBuilder.andWhere("quizz.visibility = :visibility", {
          visibility: Visibility.PUBLIC
        });
      }
      if (params.visibility === Visibility.PROTECTED) {
        queryBuilder.andWhere("quizz.visibility != :visibility", {
          visibility: Visibility.PRIVATE
        });
      }
    }
  }

  buildPaginationAndSort(
    queryBuilder: SelectQueryBuilder<QuizzEntity>,
    params: QuizzParams
  ): void {
    this.paginate(queryBuilder, params.page, params.pageSize);

    this.order(
      "quizz",
      queryBuilder,
      has(params, "order") ? params.order : "name",
      ["name", "createdAt", "updatedAt"]
    );
  }

  totalCount(
    queryBuilder: SelectQueryBuilder<QuizzEntity>,
    params: QuizzParams
  ): void {
    this.buildFilters(queryBuilder, params);
    queryBuilder.select("COUNT(DISTINCT quizz.id) AS total");
  }
}
