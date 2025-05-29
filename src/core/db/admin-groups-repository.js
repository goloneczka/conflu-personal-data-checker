import { kvs, Sort, WhereConditions } from "@forge/kvs";

export async function createActiveAdminGroup(id, activeAdminGroup) {
  return await kvs.entity("admin-group").set(id, activeAdminGroup);
}
