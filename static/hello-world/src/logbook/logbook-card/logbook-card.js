import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { invoke } from "@forge/bridge";

import Button from "@atlaskit/button/new";

import "./logbook-card.css";

export const LogBookCard = () => {
  const location = useLocation();

  const [logbookData, setlogbookData] = useState({});

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const pageValidationId = params.get("id");
    invoke("getLogbookDataById", { id: pageValidationId }).then((logbook) => {
      setlogbookData(logbook);
    });
  }, [location.search]);

  return (
    <div>
      <h1>LogBook {logbookData.id} details </h1>
      <p>This is the logbook details page. You can view the details of script and take actions.</p>

      <div>
        <table className="logbook-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Page ID</th>
              <th>Status</th>
              <th>Comment</th>
              <th>Version</th>
              <th>Timestamp</th>
            </tr>
          </thead>
          <tbody>
            <tr key={logbookData.id}>
              <td>{logbookData.id}</td>
              <td>{logbookData.pageId}</td>
              <td>{logbookData.status}</td>
              <td>{logbookData.comment}</td>
              <td>{logbookData.version}</td>
              <td>{logbookData.timestamp}</td>
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
                    {validationError.wordsBefore} {validationError.val} {validationError.wordsAfter}
                  </p>
                  <Button appearance="default"> MaFP </Button>
                </div>
              ))}
            </div>
          ))}
        </div>

        <div>
          <h3>Marked as False Positive:</h3>
          {logbookData.markedAsFalsePositive?.map((validation) => (
            <div key={validation.checkerType}>
              <p>{validation.checkerType}</p>

              {validation.result.map((validationError, idx) => (
                <span key={idx}>{validationError.val}</span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
