import { kvs, Sort, WhereConditions } from "@forge/kvs";

export const fetchAllPageValidationHistory = async (pageId, cursor) => {
  return await kvs
    .entity("confluence-page-validation-result-v2")
    .query()
    .index("by-version-per-confluence-page", {
      partition: [pageId],
    })
    .cursor(cursor)
    .limit(20)
    .getMany();
};

export const fetchLastPageValidationHistory = async (pageId) => {
  return await kvs
    .entity("confluence-page-validation-result-v2")
    .query()
    .index("by-version-per-confluence-page", {
      partition: [pageId],
    })
    .sort(Sort.DESC)
    .limit(1)
    .getOne();
};

export const createPageValidationHistory = async (newId, objectToSave) => {
  return await kvs.entity("confluence-page-validation-result-v2").set(newId, objectToSave);
};

export const deleteLogBookById = async (id) => {
  return await kvs.entity("confluence-page-validation-result-v2").delete(id);
};
