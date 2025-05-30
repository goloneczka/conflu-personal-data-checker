import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import Path from "../link/link-path";
import { invoke } from "@forge/bridge";

export const ProtectedRoute = ({ children }) => {
  const navigate = useNavigate();
  const [hasAccess, setHasAccess] = useState(null);

  useEffect(() => {
    let isMounted = true;
    invoke("hasUserAdminAccess").then((result) => {
      if (isMounted) {
        setHasAccess(result);
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (hasAccess === false) {
      navigate(Path.ERROR, { replace: true });
    }
  }, [hasAccess, navigate]);

  if (hasAccess === null) return <div>Loading...</div>;
  if (!hasAccess) return null;
  return children;
};
