import React, { useEffect, useState } from "react";
import { invoke } from "@forge/bridge";
import { Router, Route, Routes, Navigate } from "react-router";
import { view } from "@forge/bridge";

import Path from "./core/link/link-path";
import { LogBookContainer } from "./logbook/logbook";
import { LogBookCard } from "./logbook/logbook-card/logbook-card";
import { Validator } from "./validator/validator";
import { Acces } from "./acces/acces";

function App() {
  const [history, setHistory] = useState(null);
  const [historyState, setHistoryState] = useState(null);

  useEffect(() => {
    view.getContext().then((data) => console.log(data));
    view.createHistory().then((newHistory) => {
      setHistory(newHistory);
    });
  }, []);

  useEffect(() => {
    if (!historyState && history) {
      setHistoryState({
        action: history.action,
        location: history.location,
      });
    }
  }, [history, historyState]);

  useEffect(() => {
    if (history) {
      history.listen((location, action) => {
        setHistoryState({
          action,
          location,
        });
      });
    }
  }, [history]);

  return (
    <>
      {history && historyState ? (
        <Router navigator={history} navigationType={historyState.action} location={historyState.location}>
          <Routes>
            <Route path="/" element={<Navigate to={Path.LOG_BOOK} />} />
            <Route path={Path.LOG_BOOK} element={<LogBookContainer />} />
            <Route path={Path.LOG_BOOK_DETAILS} element={<LogBookCard />} />
            <Route path={Path.VALIDATOR} element={<Validator />} />
            <Route path={Path.ACCES} element={<Acces />} />
          </Routes>
        </Router>
      ) : (
        "Loading..."
      )}
    </>
  );
}
export default App;
