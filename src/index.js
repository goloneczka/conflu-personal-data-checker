import Resolver from "@forge/resolver";
import { runVerifyPageFacade } from "./event/event-core";
import { countAllLogBooks, getLogBookById, getLogBooksForPage, markAsFalsePositive } from "./backend/logbook-use-case";
import { initializeStorage } from "./core/init-storage-service";
import { fetchValidationTypes } from "./backend/validator-use-case";
import {
  addAdminGroups,
  deleteAdminGroup,
  fetchAdminGroups,
  fetchAllAttlasianGroups,
  hasUserAdminAccess,
  verifyIfAppInitialized,
} from "./backend/admin-group-use-case";

const resolver = new Resolver();

resolver.define("getLogbookDataById", async (context) => {
  console.debug("method getLogbookDataById, params:", context?.payload);
  return await getLogBookById(context);
});

resolver.define("getLogBooksForPage", async (context) => {
  console.debug("method getLogBooksForPage, params:", context?.payload);
  return await getLogBooksForPage(context);
});

resolver.define("markAsFalsePositive", async (context) => {
  console.debug("method markAsFalsePositive, params:", JSON.stringify(context?.payload));
  return await markAsFalsePositive(context);
});

resolver.define("countAllLogBooks", async (context) => {
  console.debug("method countAllLogBooks");
  return await countAllLogBooks(context);
});

resolver.define("fetchValidationTypes", async (context) => {
  console.debug("method fetchValidationTypes");
  return await fetchValidationTypes(context);
});

resolver.define("fetchAdminGroups", async (context) => {
  console.debug("method fetchAdminGroups");
  return await fetchAdminGroups(context);
});

resolver.define("fetchAttlasianGroups", async (context) => {
  console.debug("method fetchAttlasianGroups");
  return await fetchAllAttlasianGroups(context);
});

resolver.define("deleteAdminGroup", async (context) => {
  console.debug("method deleteAdminGroup, params:", context?.payload);
  return await deleteAdminGroup(context);
});

resolver.define("addAdminGroups", async (context) => {
  console.debug("method addAdminGroups, params:", context?.payload);
  return await addAdminGroups(context);
});

resolver.define("hasUserAdminAccess", async (context) => {
  return await hasUserAdminAccess(context);
});

resolver.define("verifyIfAppInitialized", async (context) => {
  console.debug("method verifyIfAppInitialized");
  return await verifyIfAppInitialized(context);
});

export async function runHookDocumentVerify(event, context) {
  try {
    await runVerifyPageFacade(event?.content?.id);
  } catch (error) {
    console.error("Error in runHookDocumentVerify:", error);
    return true;
  }
  return true;
}

export const runInstallationHook = (context) => {
  initializeStorage();
};

export const handler = resolver.getDefinitions();
