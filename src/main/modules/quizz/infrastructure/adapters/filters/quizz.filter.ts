import { Injectable } from "@nestjs/common";
import { has } from "lodash";
import { SelectQueryBuilder } from "typeorm";
import { AbstractFilter, SortingTypeEnum } from "./abstract.filter";
import { QuizzParams } from "../params/quizz.param";
import { QuizzEntity } from "../repositories/entities/quizz.entity";
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
      queryBuilder.andWhere("quizz.user_id = :userId", {
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
      queryBuilder.andWhere("quizz.draft = :draft", {
        draft: params.draft
      });
    }

    // if (has(params, "visibility")) {
    //   queryBuilder.andWhere("quizz.visibility = :visibility", {
    //     visibility
    //   });
    // }
  }

  buildPaginationAndSort(
    queryBuilder: SelectQueryBuilder<QuizzEntity>,
    params: QuizzParams
  ): void {
    this.paginate(queryBuilder, params.page, params.pageSize);

    if (has(params, "order")) {
      const cleanedOrder = params.order?.startsWith("-")
        ? params.order?.substring(1)
        : params.order;
      const ordering =
        params.order.substring(0, 1).replace(/\s/g, "") === "-"
          ? SortingTypeEnum.DESC
          : SortingTypeEnum.ASC;
    }

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
