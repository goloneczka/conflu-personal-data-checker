import { createActiveAdminGroup } from "../core/db/admin-groups-repository";
import { generateSortableId } from "../core/db/sortable-id";
import { deleteActiveAdminGroup, fetchAdminGroup, fetchAllAdminGroups } from "./db/admin-group-repostiory";
import api, { route } from "@forge/api";

export const fetchAdminGroups = async () => {
  const dbData = await fetchAllAdminGroups();
  return dbData.results.map((item) => ({
    ...item.value,
    id: item.key,
  }));
};

export const addAdminGroups = async (context) => {
  const adminGroups = context.payload;
  const promises = [];

  for (const group of adminGroups) {
    promises.push(createActiveAdminGroup(generateSortableId(), { name: group.label, canBeDeleted: true }));
  }
  await Promise.all(promises);
};

export const deleteAdminGroup = async (context) => {
  const adminGroupId = context.payload.id;
  const rowToDelete = await fetchAdminGroup(adminGroupId);
  console.log("Deleting admin group:", rowToDelete);
  if (rowToDelete.value?.canBeDeleted) {
    await deleteActiveAdminGroup(adminGroupId);
  }
};

export const hasUserAdminAccess = async (site) => {
  // carefull -> it return only 200 first groups
  const response = await api.asApp().requestConfluence(route`/wiki/rest/api/user/memberof?accountId=${site.context.accountId}`, {
    headers: {
      Accept: "application/json",
    },
  });

  const userGroups = await response.json();
  const dbAdminGroups = await fetchAdminGroups();
  return userGroups.results.some((userGroup) => dbAdminGroups.some((adminGroup) => adminGroup.name === userGroup.name));
};

export const fetchAllAttlasianGroups = async () => {
  // carefull -> it return only 200 first groups
  const response = await api.asApp().requestConfluence(route`/wiki/rest/api/group`, {
    headers: {
      Accept: "application/json",
    },
  });

  const responseJson = await response.json();
  return responseJson.results.map((item) => ({
    label: item.name,
    value: item.name,
  }));
};

export const verifyIfAppInitialized = async () => {
  return (await fetchAllAdminGroups()).results.length;
};
