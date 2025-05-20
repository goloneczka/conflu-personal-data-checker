import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";

import Pagination from "@atlaskit/pagination";
import { LogBookCard } from "./logbook-card/logbook-card";

import "./logbook.css";
import Path from "../core/link/link-path";
import { invoke } from "@forge/bridge";

const mockLogbooks = [
  { id: 1, pageId: "A123", status: "clean", comment: "No issues found.", version: "1.0.0", timestamp: "2025-05-20 10:01" },
  { id: 2, pageId: "B456", status: "unclean", comment: "Sensitive data detected.", version: "1.0.1", timestamp: "2025-05-20 10:05" },
  { id: 3, pageId: "C789", status: "clean", comment: "Checked and verified.", version: "1.0.2", timestamp: "2025-05-20 10:10" },
  { id: 4, pageId: "D012", status: "unclean", comment: "PII present in comments.", version: "1.0.3", timestamp: "2025-05-20 10:15" },
  { id: 5, pageId: "E345", status: "clean", comment: "All clear.", version: "1.0.4", timestamp: "2025-05-20 10:20" },
  { id: 6, pageId: "F678", status: "unclean", comment: "Unencrypted email found.", version: "1.0.5", timestamp: "2025-05-20 10:25" },
  { id: 7, pageId: "G901", status: "clean", comment: "No personal data.", version: "1.0.6", timestamp: "2025-05-20 10:30" },
  { id: 8, pageId: "H234", status: "unclean", comment: "Phone number detected.", version: "1.0.7", timestamp: "2025-05-20 10:35" },
  { id: 9, pageId: "I567", status: "clean", comment: "Safe for sharing.", version: "1.0.8", timestamp: "2025-05-20 10:40" },
  { id: 10, pageId: "J890", status: "unclean", comment: "Address information present.", version: "1.0.9", timestamp: "2025-05-20 10:45" },
  { id: 11, pageId: "K111", status: "clean", comment: "No issues.", version: "1.1.0", timestamp: "2025-05-20 10:50" },
  { id: 12, pageId: "L222", status: "unclean", comment: "Credit card info found.", version: "1.1.1", timestamp: "2025-05-20 10:55" },
  { id: 13, pageId: "M333", status: "clean", comment: "Verified.", version: "1.1.2", timestamp: "2025-05-20 11:00" },
  { id: 14, pageId: "N444", status: "unclean", comment: "Sensitive attachment.", version: "1.1.3", timestamp: "2025-05-20 11:05" },
  { id: 15, pageId: "O555", status: "clean", comment: "No PII found.", version: "1.1.4", timestamp: "2025-05-20 11:10" },
];

export const LogBookContainer = () => {
  const logsPerPage = 5;

  const navigate = useNavigate();
  const location = useLocation();

  const [currentLogs, setCurrentLogs] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const page = params.get("page") || 1;
    setCurrentPage(page);
    setCurrentLogs([mockLogbooks[page], mockLogbooks[parseInt(page) + 1]]);
  }, [location.search]);

  useEffect(() => {
    invoke("getLogBooksForPage", { page: currentPage, size: logsPerPage }).then((logbooks) => {
      console.log(logbooks);
      setCurrentLogs(logbooks);
    });
  }, [currentPage]);

  const handlePageChange = (_, newPage) => {
    const params = new URLSearchParams({ page: newPage });
    navigate(`${Path.LOG_BOOK}?${params.toString()}`);
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
            <th>Version</th>
            <th>Timestamp</th>
          </tr>
        </thead>
        <tbody>
          {currentLogs.map((log) => (
            <tr key={log.id}>
              <td>{log.id}</td>
              <td>{log.pageId}</td>
              <td>{log.status}</td>
              <td>{log.comment}</td>
              <td>{log.version}</td>
              <td>{log.timestamp}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div style={{ marginTop: 24, display: "flex", justifyContent: "center" }}>
        <Pagination pages={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]} defaultSelectedIndex={currentPage} onChange={handlePageChange} />
      </div>
    </div>
  );
};
