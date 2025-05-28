import { Filter, FilterConditions, kvs, Sort, WhereConditions } from "@forge/kvs";

export async function fetchAllValidatorTypes() {
  return await kvs.entity("validation-type").query().index("by-key").sort(Sort.DESC).limit(100).getMany();
}
