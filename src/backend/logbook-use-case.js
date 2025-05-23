import { fetchLogHistoryPageById, fetchLogsHistoryByPage } from "./db/logbook-repository";

export const getLogBooksForPage = async (context) => {
  const payload = context.payload;

  let historyLogsWrapper = await fetchLogsHistoryByPage(payload.size);
  for (let i = 1; i < payload.page; i++) {
    historyLogsWrapper = await fetchLogsHistoryByPage(payload.size, historyLogsWrapper.nextCursor);
  }
  console.log("historyLogsWrapper", historyLogsWrapper);
  return historyLogsWrapper.results.map((item) => ({
    ...item.value,
    timestamp: item.key.split("-")[0],
    id: item.key,
    needAction: item.value.status === "unsafePage",
  }));
};

export const getLogBookById = async (context) => {
  const payload = context.payload;
  const row = await fetchLogHistoryPageById(payload.id);
  console.log("row", row);
  return { ...row.value, id: row.key };
};
