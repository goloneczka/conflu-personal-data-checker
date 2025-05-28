import { kvs, Sort, WhereConditions } from "@forge/kvs";

export async function createValidationType(id, validationType) {
  return await kvs.entity("validation-type").set(id, validationType);
}
