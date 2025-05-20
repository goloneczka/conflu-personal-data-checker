import { kvs, Sort, WhereConditions } from "@forge/kvs";

export async function fetchLogsHistoryByPage(size, cursor) {
  return await kvs.entity("confluence-page-validation-result").query().index().sort(Sort.DESC).limit(size).cursor(cursor).getMany();
}
