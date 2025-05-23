import api, { route } from "@forge/api";
import { checkerOption, runCheckersByParams } from "./event-checker-strategy";
import { extractTextFromProseMirrorJSON } from "./utils/extract-text-utils";
import { prepareNewCommentIfNeccesary } from "./utils/send-comment-utils";
import { getLastValidationResults, createPageValidationNewResults, getAllMarkedAsFalsePositiveForPage } from "./db/history-page-service";

export const runVerifyPageFacade = async (pageId) => {
  // 1a. fetch the page content
  const pageRequestResponse = await api.asApp().requestConfluence(route`/wiki/api/v2/pages/${pageId}?body-format=atlas_doc_format`);
  const pageRequestData = await pageRequestResponse.json();

  // 1b. extract the text from the page content
  const text = extractTextFromProseMirrorJSON(pageRequestData.body.atlas_doc_format.value);

  // 2. check the text for sensitive data
  const verifyResults = await runCheckersByParams(
    [checkerOption.BANK_CARD, checkerOption.EMAIL, checkerOption.SSN, checkerOption.PHONE_NUMBER],
    text
  );
  console.log(verifyResults);

  // 3. obtain history status for personal data veryfication page in db
  // we need from last one: version, status
  // we need all MaFP TODO !!
  const currentValidationForPage = await getLastValidationResults(pageId);
  console.log("currentValidationForPage", currentValidationForPage);
  const markedAsFalsePositive = await getAllMarkedAsFalsePositiveForPage(pageId);
  console.log("markedAsFalsePositive", markedAsFalsePositive);

  // 3b. send a comment if neccessary
  const potentialCommentRequest = prepareNewCommentIfNeccesary(pageId, verifyResults, currentValidationForPage);
  let newCommentResponseId = null;
  if (potentialCommentRequest) {
    const responseNewComment = await api.asApp().requestConfluence(route`/wiki/api/v2/footer-comments`, potentialCommentRequest);
    newCommentResponseId = (await responseNewComment.json()).id;
  }

  // 4. update the page status in db
  const updatedValidationForPage = await createPageValidationNewResults(
    pageId,
    pageRequestData.version.number,
    verifyResults,
    newCommentResponseId,
    currentValidationForPage
  );

  return true;
};
