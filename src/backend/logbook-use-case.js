import { fetchLogHistoryPageById, updateLogHistoryPage } from "../core/db/page-validation-result-repository";
import { runVerifyPageFacade } from "../event/event-core";
import { fetchLogsHistoryByPage } from "./db/logbook-repository";

export const getLogBooksForPage = async (context) => {
  const payload = context.payload;

  const dbResultData = payload.onlyActionNeeded ? await _fetchForActionNeeded(payload) : await _fetchLogsNormaly(payload);

  return dbResultData.map((item) => ({
    ...item.value,
    timestamp: item.key.split("-")[0],
    id: item.key,
    needAction: item.value.status === "unsafePage" && item.value.comment === "Action required",
  }));
};

export const getLogBookById = async (context) => {
  const payload = context.payload;
  const row = await fetchLogHistoryPageById(payload.id);
  console.log("row", row);
  return {
    ...row.value,
    id: row.key,
    timestamp: row.key.split("-")[0],
    needAction: row.value.status === "unsafePage" && row.value.comment === "Action required",
  };
};

export const markAsFalsePositive = async (context) => {
  const payload = context.payload;
  const row = await fetchLogHistoryPageById(payload.logbookId);

  const validationResultRowToChange = row.value.validationResult.find((it) => it.checkerType === payload.checkerType);
  const [deletedValue] = validationResultRowToChange.result.splice(payload.validationErrorIdPerCherkerType, 1);

  const newMarkedAsFalsePositive = row.value.markedAsFalsePositive.find((it) => it.checkerType === payload.checkerType);
  newMarkedAsFalsePositive.result.push(deletedValue);

  const totalErrorsNow = row.value.validationResult.reduce((acc, item) => acc + item.result.length, 0);
  if (totalErrorsNow === 0) {
    row.value.comment = "All errors marked as FP";
    await updateLogHistoryPage(row.key, row.value);
    await runVerifyPageFacade(row.value.confluencePageId);
  } else {
    await updateLogHistoryPage(row.key, row.value);
  }

  const newRow = await fetchLogHistoryPageById(payload.logbookId);
  return {
    ...newRow.value,
    id: newRow.key,
    timestamp: newRow.key.split("-")[0],
    needAction: newRow.value.status === "unsafePage" && newRow.value.comment === "Action required",
  };
};

export const countAllLogBooks = async (context) => {
  const payload = context.payload;

  let historyLogsWrapper = await fetchLogsHistoryByPage(99, payload.onlyActionNeeded);
  let sumOfRows = historyLogsWrapper.results.length;
  while (historyLogsWrapper.nextCursor) {
    historyLogsWrapper = await fetchLogsHistoryByPage(99, payload.onlyActionNeeded, historyLogsWrapper.nextCursor);
    sumOfRows += historyLogsWrapper.results.length;
  }
  return Math.max(1, Math.ceil(sumOfRows / payload.size));
};

const _fetchForActionNeeded = async (payload) => {
  const startIdx = (payload.page - 1) * payload.size;
  const endIdx = startIdx + payload.size;

  let historyLogsWrapper = await fetchLogsHistoryByPage(99, true);
  let allResults = [...historyLogsWrapper.results];

  // Fetch until we have enough results for the requested page or no more pages
  while (historyLogsWrapper.nextCursor && allResults.length < endIdx) {
    historyLogsWrapper = await fetchLogsHistoryByPage(99, true, historyLogsWrapper.nextCursor);
    allResults = allResults.concat(historyLogsWrapper.results);
  }

  return allResults.slice(startIdx, endIdx);
};

const _fetchLogsNormaly = async (payload) => {
  let historyLogsWrapper = await fetchLogsHistoryByPage(payload.size, false);
  for (let i = 1; i < payload.page; i++) {
    historyLogsWrapper = await fetchLogsHistoryByPage(payload.size, false, historyLogsWrapper.nextCursor);
  }
  return historyLogsWrapper.results;
};
