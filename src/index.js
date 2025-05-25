import Resolver from "@forge/resolver";
import { runVerifyPageFacade } from "./event/event-core";
import { countAllLogBooks, getLogBookById, getLogBooksForPage, markAsFalsePositive } from "./backend/logbook-use-case";

const resolver = new Resolver();

resolver.define("getLogbookDataById", async (context) => {
  return await getLogBookById(context);
});

resolver.define("getLogBooksForPage", async (context) => {
  return await getLogBooksForPage(context);
});

resolver.define("markAsFalsePositive", async (context) => {
  return await markAsFalsePositive(context);
});

resolver.define("countAllLogBooks", async (context) => {
  return await countAllLogBooks(context);
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

export const handler = resolver.getDefinitions();
