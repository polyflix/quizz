import { Injectable } from "@nestjs/common";
import { has } from "lodash";
import { SelectQueryBuilder } from "typeorm";
import { AbstractFilter, SortingTypeEnum } from "./abstract.filter";
import { AttemptParams } from "../params/attempt.param";
import { AttemptEntity } from "../repositories/entities/attempt.entity";

@Injectable()
export class AttemptFilter extends AbstractFilter<AttemptEntity> {
  buildFilters(
    queryBuilder: SelectQueryBuilder<AttemptEntity>,
    params: AttemptParams
  ): void {
    if (has(params, "quizzId")) {
      queryBuilder.andWhere("attempt.quizzId = :quizzId", {
        quizzId: params.quizzId
      });
    }

    if (has(params, "userId")) {
      queryBuilder.andWhere("attempt.userId = :userId", {
        userId: params.userId
      });
    }
  }

  buildPaginationAndSort(
    queryBuilder: SelectQueryBuilder<AttemptEntity>,
    params: AttemptParams
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
      "attempt",
      queryBuilder,
      has(params, "order") ? params.order : "score",
      ["score", "createdAt", "updatedAt"]
    );
  }

  totalCount(
    queryBuilder: SelectQueryBuilder<AttemptEntity>,
    params: AttemptParams
  ): void {
    this.buildFilters(queryBuilder, params);
    queryBuilder.select("COUNT(DISTINCT attempt.id) AS total");
  }
}
