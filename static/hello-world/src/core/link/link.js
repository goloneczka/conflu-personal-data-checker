import React from "react";
import { useNavigate } from "react-router";

import "./link.css";

function Link({ to, children, queryParams }) {
  const navigate = useNavigate();

  const searchParams = new URLSearchParams(queryParams)?.toString();
  const fullPath = searchParams ? `${to}?${searchParams}` : to;

  return (
    <a
      className="remove-underline-decoration"
      href={to}
      onClick={(event) => {
        event.preventDefault();
        navigate(fullPath);
      }}
    >
      {children}
    </a>
  );
}

export default Link;
