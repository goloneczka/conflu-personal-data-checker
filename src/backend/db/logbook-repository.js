import { Filter, FilterConditions, kvs, Sort, WhereConditions } from "@forge/kvs";

export async function fetchLogsHistoryByPage(size, onlyActionNeeded, cursor) {
  const queryBuilder = kvs.entity("confluence-page-validation-result-v2").query().index("by-key").sort(Sort.DESC).limit(size).cursor(cursor);
  if (onlyActionNeeded) {
    return queryBuilder
      .filters(new Filter().and("status", FilterConditions.equalTo("unsafePage")).and("comment", FilterConditions.equalTo("Action required")))
      .getMany();
  }
  return await queryBuilder.getMany();
}
