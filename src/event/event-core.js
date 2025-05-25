import api, { route } from "@forge/api";
import { checkerOption, runCheckersByParams } from "./event-checker-strategy";
import { extractTextFromProseMirrorJSON } from "./utils/extract-text-utils";
import { prepareNewCommentIfNeccesary } from "./utils/send-comment-utils";
import { getLastValidationResults, createPageValidationNewResults, getAllMarkedAsFalsePositiveForPage } from "./db/history-page-service";
import { substractValidationByFalsePositive } from "./utils/validation-errors-helper-utils";

export const runVerifyPageFacade = async (pageId) => {
  // 1a. fetch the page content
  const pageRequestResponse = await api.asApp().requestConfluence(route`/wiki/api/v2/pages/${pageId}?body-format=atlas_doc_format`);
  const pageRequestData = await pageRequestResponse.json();

  // 1b. extract the text from the page content
  const text = extractTextFromProseMirrorJSON(pageRequestData.body.atlas_doc_format.value);

  // 2. check the text for sensitive data
  let verifyResults = await runCheckersByParams([checkerOption.BANK_CARD, checkerOption.EMAIL, checkerOption.SSN, checkerOption.PHONE_NUMBER], text);
  console.log("st verify results", verifyResults);

  // 3a. get last version and status of the page validation
  const currentValidationForPage = await getLastValidationResults(pageId);
  console.log("currentValidationForPage", currentValidationForPage);

  // 3b. get all marked as false positive for the page
  const markedAsFalsePositive = await getAllMarkedAsFalsePositiveForPage(pageId);
  console.log("markedAsFalsePositive", markedAsFalsePositive);

  // 4. clear the results from false positives
  verifyResults = substractValidationByFalsePositive(verifyResults, markedAsFalsePositive);
  console.log("nd verify results", verifyResults);

  // 5. send a comment if neccessary
  const potentialCommentRequest = prepareNewCommentIfNeccesary(pageId, verifyResults, currentValidationForPage);
  let newCommentResponseId = null;
  if (potentialCommentRequest) {
    const responseNewComment = await api.asApp().requestConfluence(route`/wiki/api/v2/footer-comments`, potentialCommentRequest);
    newCommentResponseId = (await responseNewComment.json()).id;
  }

  // 6. update the page status in db
  const updatedValidationForPage = await createPageValidationNewResults(
    pageId,
    pageRequestData.version.number,
    verifyResults,
    newCommentResponseId,
    currentValidationForPage
  );

  return true;
};
