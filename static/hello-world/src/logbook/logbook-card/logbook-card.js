import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { invoke } from "@forge/bridge";

import Button from "@atlaskit/button/new";

import "./logbook-card.css";

export const LogBookCard = () => {
  const location = useLocation();

  const [logbookData, setlogbookData] = useState({});
  const [areButtonsDisabled, setAreButtonsDisabled] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const pageValidationId = params.get("id");
    invoke("getLogbookDataById", { id: pageValidationId }).then((logbook) => {
      setlogbookData(logbook);
    });
  }, [location.search]);

  const markAsFalsePositive = async (checkerType, id) => {
    setAreButtonsDisabled(true);
    invoke("markAsFalsePositive", { logbookId: logbookData.id, checkerType: checkerType, validationErrorIdPerCherkerType: id }).then((newLogBook) => {
      setlogbookData(newLogBook);
      setAreButtonsDisabled(false);
    });
  };

  return (
    <div>
      <h1>Event log {logbookData.id} details </h1>
      <p>This is the event log details page. You can view the result of the scanned Confluence page.</p>
      <p>Mark as false positive (FP) when the text has been misqualified. </p>

      <div style={{ marginTop: "20px" }}>
        <table className="logbook-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Page ID</th>
              <th>Status</th>
              <th>Comment</th>
              <th>Script page Version</th>
              <th>Page Version</th>
              <th>Timestamp</th>
            </tr>
          </thead>
          <tbody>
            <tr key={logbookData.id}>
              <td>{logbookData.id}</td>
              <td>{logbookData.confluencePageId}</td>
              <td>{logbookData.status}</td>
              <td className="logbook-comment">{logbookData.comment}</td>
              <td>{logbookData.version}</td>
              <td>{logbookData.confluPageVersion}</td>
              <td>{logbookData.timestamp ? new Date(Number(logbookData.timestamp)).toLocaleString() : ""}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="logbook-details-sections">
        <div>
          <h3>Found pottential vulunbarity:</h3>
          {logbookData.validationResult?.map((validation) => (
            <div key={validation.checkerType}>
              <h5>{validation.checkerType}</h5>

              {validation.result.map((validationError, idx) => (
                <div key={idx} className="vulnerability-row">
                  <p style={{ margin: 0 }}>
                    {validationError.wordsBefore} <b>{validationError.val}</b> {validationError.wordsAfter}
                  </p>
                  {logbookData.needAction && (
                    <Button appearance="default" onClick={() => markAsFalsePositive(validation.checkerType, idx)} isDisabled={areButtonsDisabled}>
                      Mark as FP
                    </Button>
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>

        <div>
          <h3>Marked as False Positive: </h3> <h6>(These values won't be checked in future for this page)</h6>
          {logbookData.markedAsFalsePositive?.map((validation) => (
            <div key={validation.checkerType}>
              <h5>{validation.checkerType}</h5>

              {validation.result.map((validationError, idx) => (
                <div key={idx} className="vulnerability-row">
                  <p style={{ margin: 0 }}>
                    {validationError.wordsBefore} <b>{validationError.val}</b> {validationError.wordsAfter}
                  </p>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
