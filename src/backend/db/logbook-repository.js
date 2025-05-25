import { kvs, Sort, WhereConditions } from "@forge/kvs";

export async function fetchLogsHistoryByPage(size, cursor) {
  return await kvs.entity("confluence-page-validation-result-v2").query().index("by-key").sort(Sort.DESC).limit(size).cursor(cursor).getMany();
}
