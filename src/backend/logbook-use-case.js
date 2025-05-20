import { fetchLogsHistoryByPage } from "./db/logbook-repository";

export const getLogBooksForPage = async (context) => {
  const payload = context.payload;

  let historyLogsWrapper = await fetchLogsHistoryByPage(payload.size);
  for (let i = 1; i < payload.page; i++) {
    historyLogsWrapper = await fetchLogsHistoryByPage(payload.size, historyLogsWrapper.nextCursor);
  }
  console.log("historyLogsWrapper", historyLogsWrapper);
  return historyLogsWrapper.results.value;
};
