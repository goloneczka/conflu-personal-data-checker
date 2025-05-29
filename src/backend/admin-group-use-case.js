import { createActiveAdminGroup } from "../core/db/admin-groups-repository";
import { generateSortableId } from "../core/db/sortable-id";
import { deleteActiveAdminGroup, fetchAllAdminGroups } from "./db/admin-group-repostiory";
import api, { route } from "@forge/api";

export const fetchAdminGroups = async () => {
  const dbData = await fetchAllAdminGroups();
  console.log("Fetched admin groups:", dbData);
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
  await deleteActiveAdminGroup(adminGroupId);
};

export const fetchAllAttlasianGroups = async () => {
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
