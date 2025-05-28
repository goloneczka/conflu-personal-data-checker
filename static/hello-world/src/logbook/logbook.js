import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";

import Pagination from "@atlaskit/pagination";
import Button from "@atlaskit/button/new";
import { Checkbox } from "@atlaskit/checkbox";
import ShieldStrikethroughIcon from "@atlaskit/icon/core/shield-strikethrough";

import "./logbook.css";
import Path from "../core/link/link-path";
import { invoke } from "@forge/bridge";
import { ButtonHeader } from "../core/header/button-header";

export const LogBookContainer = () => {
  const logsPerPage = 5;
  const navigate = useNavigate();
  const location = useLocation();

  const [currentLogs, setCurrentLogs] = useState([]);
  const [totalPages, setTotalPages] = useState(1);

  // Always derive from URL
  const params = new URLSearchParams(location.search);
  const page = parseInt(params.get("page") || "1", 10);
  const onlyActionNeeded = params.get("onlyActionNeeded") === "true";

  // Update total pages when filter changes
  useEffect(() => {
    invoke("countAllLogBooks", { size: logsPerPage, onlyActionNeeded }).then(setTotalPages);
  }, [logsPerPage, onlyActionNeeded]);

  // Fetch logs when page or filter changes
  useEffect(() => {
    invoke("getLogBooksForPage", { page, size: logsPerPage, onlyActionNeeded }).then(setCurrentLogs);
  }, [page, logsPerPage, onlyActionNeeded]);

  const handlePageChange = (_, newPage) => {
    const params = new URLSearchParams({ page: newPage, onlyActionNeeded: onlyActionNeeded });
    navigate(`${Path.LOG_BOOK}?${params.toString()}`);
  };

  const handleLogClick = (id) => {
    const params = new URLSearchParams({ id: id });
    navigate(`${Path.LOG_BOOK_DETAILS}?${params.toString()}`);
  };

  const onChangeChecbkoxActionOnly = (_) => {
    const params = new URLSearchParams({ page: 1, onlyActionNeeded: !onlyActionNeeded });
    navigate(`${Path.LOG_BOOK}?${params.toString()}`);
  };

  return (
    <div>
      <ButtonHeader activeIndex={0} />
      <p>This is the logbook page. You can view the history of your actions here.</p>

      <div className="logbook-toolbar">
        <div></div> {/* Empty div for left alignment, can be used for future controls */}
        <div className="logbook-filter">
          <Checkbox isChecked={onlyActionNeeded} label="only Action Needed" name="checkbox-action-needed" onChange={onChangeChecbkoxActionOnly} />
        </div>
      </div>

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
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentLogs.map((log) => (
            <tr key={log.id}>
              <td>{log.id}</td>
              <td>{log.confluencePageId}</td>
              <td>{log.status}</td>
              <td className="logbook-comment">{log.comment}</td>
              <td>{log.version}</td>
              <td>{log.confluPageVersion}</td>
              <td>{log.timestamp ? new Date(Number(log.timestamp)).toLocaleString() : ""}</td>
              <td>
                {log.needAction ? (
                  <Button iconBefore={ShieldStrikethroughIcon} appearance="primary" onClick={() => handleLogClick(log.id)}>
                    Need Action
                  </Button>
                ) : (
                  <Button appearance="default" onClick={() => handleLogClick(log.id)}>
                    Details
                  </Button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div style={{ marginTop: 24, display: "flex", justifyContent: "center" }}>
        <Pagination pages={Array.from({ length: totalPages }, (_, i) => i + 1)} onChange={handlePageChange} selectedIndex={page - 1} />
      </div>
    </div>
  );
};
