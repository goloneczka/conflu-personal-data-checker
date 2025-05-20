import Resolver from "@forge/resolver";
import { runVerifyPageFacade } from "./event/event-core";
import { getLogBooksForPage } from "./backend/logbook-use-case";

const resolver = new Resolver();

resolver.define("getText", (req) => {
  console.log(req);

  return "Hello, world!";
});

resolver.define("getLogBooksForPage", async (context) => {
  return await getLogBooksForPage(context);
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
