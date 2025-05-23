import { createPageValidationHistory, fetchAllPageValidationHistory, fetchLastPageValidationHistory } from "./history-page-repository";

export const createPageValidationNewResults = async (pageId, confluPageVersion, newValidationResults, commentResult, currentValidationForPage) => {
  const newStatus = newValidationResults.filter((item) => item.result.length).length ? "unsafePage" : "safePage";

  const newValidationResult = {
    confluencePageId: pageId,
    status: newStatus,
    sendedCommentId: commentResult || "null",
    validationResult: newValidationResults,
    markedAsFalsePositive: [],
    comment: newStatus === "unsafePage" ? "Action required" : "null",
    version: currentValidationForPage?.version + 1 || 1,
    confluPageVersion: confluPageVersion,
  };

  return await createPageValidationHistory(generateSortableId(), newValidationResult);
};

// return {} if no validation history
export const getLastValidationResults = async (pageId) => {
  const pageHistoryWrapper = await fetchLastPageValidationHistory(pageId);

  return pageHistoryWrapper?.value || {};
};

export const getAllMarkedAsFalsePositiveForPage = async (pageId) => {
  const allMarkedAsFalsePositive = [];
  let pageHistoryWrapper = await fetchAllPageValidationHistory(pageId);
  allMarkedAsFalsePositive.push(...pageHistoryWrapper.results.map((item) => item.value.markedAsFalsePositive));

  while (pageHistoryWrapper.nextCursor) {
    pageHistoryWrapper = await fetchAllPageValidationHistory(pageId, pageHistoryWrapper.nextCursor);
    allMarkedAsFalsePositive.push(...pageHistoryWrapper.results.map((item) => item.value.markedAsFalsePositive));
  }

  return allMarkedAsFalsePositive;
};

function generateSortableId() {
  const timestamp = Date.now().toString(); // 13-digit milliseconds timestamp
  const random = Math.random().toString(36).slice(2, 8); // 6-char random string
  return `${timestamp}-${random}`;
}
