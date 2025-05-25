import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";

import Pagination from "@atlaskit/pagination";
import Button from "@atlaskit/button/new";
import ShieldStrikethroughIcon from "@atlaskit/icon/core/shield-strikethrough";

import "./logbook.css";
import Path from "../core/link/link-path";
import { invoke } from "@forge/bridge";

export const LogBookContainer = () => {
  const logsPerPage = 5;

  const navigate = useNavigate();
  const location = useLocation();

  const [currentLogs, setCurrentLogs] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const page = params.get("page") || 1;
    setCurrentPage(parseInt(page));
  }, [location.search]);

  useEffect(() => {
    invoke("getLogBooksForPage", { page: currentPage, size: logsPerPage }).then((logbooks) => {
      setCurrentLogs(logbooks);
    });
  }, [currentPage]);

  const handlePageChange = (_, newPage) => {
    const params = new URLSearchParams({ page: newPage });
    navigate(`${Path.LOG_BOOK}?${params.toString()}`);
  };

  const handleLogClick = (id) => {
    const params = new URLSearchParams({ id: id });
    navigate(`${Path.LOG_BOOK_DETAILS}?${params.toString()}`);
  };

  return (
    <div>
      <h1>LogBook</h1>
      <p>This is the logbook page. You can view the history of your actions here.</p>

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
        <Pagination pages={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]} onChange={handlePageChange} />
      </div>
    </div>
  );
};
