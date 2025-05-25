import { kvs, Sort, WhereConditions } from "@forge/kvs";

export async function fetchLogsHistoryByPage(size, cursor) {
  return await kvs.entity("confluence-page-validation-result-v2").query().index("by-key").sort(Sort.DESC).limit(size).cursor(cursor).getMany();
}

export async function fetchLogHistoryPageById(id) {
  return await kvs.entity("confluence-page-validation-result-v2").query().index("by-key").where(WhereConditions.equalTo(id)).getOne();
}

export async function updateLogHistoryPage(id, value) {
  return await kvs.entity("confluence-page-validation-result-v2").set(id, value);
}
