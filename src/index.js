import Resolver from "@forge/resolver";
import { runVerifyPageFacade } from "./event/event-core";

const resolver = new Resolver();

resolver.define("getText", (req) => {
  console.log(req);

  return "Hello, world!";
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
