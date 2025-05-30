import { Filter, FilterConditions, kvs, Sort, WhereConditions } from "@forge/kvs";

export async function fetchAllAdminGroups() {
  return await kvs.entity("admin-group").query().index("by-key").limit(100).getMany();
}

export async function fetchAdminGroup(id) {
  return await kvs.entity("admin-group").query().index("by-key").where(WhereConditions.equalTo(id)).getOne();
}

export async function deleteActiveAdminGroup(id) {
  return await kvs.entity("admin-group").delete(id);
}
