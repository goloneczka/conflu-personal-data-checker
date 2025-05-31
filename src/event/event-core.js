import api, { route } from "@forge/api";
import { checkerOption, runCheckersByParams } from "./event-checker-strategy";
import { extractTextFromProseMirrorJSON } from "./utils/extract-text-utils";
import { prepareNewCommentIfNeccesary } from "./utils/send-comment-utils";
import {
  getLastValidationResults,
  createPageValidationNewResults,
  getAllMarkedAsFalsePositiveForPage,
  updatePreviousPageValidationComment,
} from "./db/history-page-service";
import { substractValidationByFalsePositive } from "./utils/validation-errors-helper-utils";

export const runVerifyPageFacade = async (pageId) => {
  // 1a. fetch the page content
  console.debug("verifaction script started! ...");
  const pageRequestResponse = await api.asApp().requestConfluence(route`/wiki/api/v2/pages/${pageId}?body-format=atlas_doc_format`);
  const pageRequestData = await pageRequestResponse.json();

  // 1b. extract the text from the page content
  const text = extractTextFromProseMirrorJSON(pageRequestData.body.atlas_doc_format.value);

  // 2. check the text for sensitive data
  let verifyResults = await runCheckersByParams(
    [
      checkerOption.BANK_CARD,
      checkerOption.EMAIL,
      checkerOption.SSN,
      checkerOption.PHONE_NUMBER,
      checkerOption.DRIVER_LICENSE,
      checkerOption.IP_ADDRESS,
    ],
    text
  );
  console.debug("text scaned! ...");

  // 3a. get last version and status of the page validation
  const currentValidationForPage = await getLastValidationResults(pageId);

  // 3b. get all marked as false positive for the page
  const markedAsFalsePositive = await getAllMarkedAsFalsePositiveForPage(pageId);
  console.debug("fetched data for previous validation for page! ...");

  // 4. clear the results from false positives
  verifyResults = substractValidationByFalsePositive(verifyResults, markedAsFalsePositive);

  // 5. send a comment if neccessary
  const potentialCommentRequest = prepareNewCommentIfNeccesary(pageId, verifyResults, currentValidationForPage);
  let newCommentResponseId = null;
  if (potentialCommentRequest) {
    const responseNewComment = await api.asApp().requestConfluence(route`/wiki/api/v2/footer-comments`, potentialCommentRequest);
    newCommentResponseId = (await responseNewComment.json()).id;
  }
  console.debug("Comment prepared and sent if neccessary! ...");

  // 6. create new history entry with the new validation results
  const updatedValidationForPage = await createPageValidationNewResults(
    pageId,
    pageRequestData.version.number,
    verifyResults,
    newCommentResponseId,
    currentValidationForPage
  );

  // 7.update previous validation comment
  await updatePreviousPageValidationComment(currentValidationForPage.id);
  console.debug("Script finished successfully!");
  return true;
};
