import React, { useState, useEffect } from "react";

import Banner from "@atlaskit/banner";
import WarningIcon from "@atlaskit/icon/glyph/warning";
import EmptyState from "@atlaskit/empty-state";
import { invoke } from "@forge/bridge";

export const GeneralErrorRoute = () => {
  const [isAppInitialized, setIsAppInitialized] = useState(true);

  useEffect(() => {
    invoke("verifyIfAppInitialized").then(setIsAppInitialized);
  }, []);

  return (
    <div>
      {!isAppInitialized && (
        <Banner appearance="warning" icon={<WarningIcon label="Warning" secondaryColor="inherit" />}>
          App is initializing, it may take up to 10 minutes to load.
        </Banner>
      )}

      <EmptyState
        header="You don't have access to this work item"
        description="Contact your project admin for permission to see the project's work items. Or try later."
      />
    </div>
  );
};
