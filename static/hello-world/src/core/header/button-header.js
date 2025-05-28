import React, { useEffect, useState } from "react";

import DatabaseIcon from "@atlaskit/icon/core/database";
import SettingsIcon from "@atlaskit/icon/core/settings";
import FlagIcon from "@atlaskit/icon/core/flag";
import { ButtonGroup } from "@atlaskit/button";
import Button from "@atlaskit/button/new";
import { useNavigate } from "react-router";
import Path from "../link/link-path";

export const ButtonHeader = ({ activeIndex }) => {
  const navigate = useNavigate();

  const goTo = (index) => () => {
    if (activeIndex === index) return;

    if (index === 0) return navigate(`${Path.LOG_BOOK}`);
    else if (index === 1) return navigate(`${Path.VALIDATOR}`);
    else if (index === 2) return navigate(`${Path.ACCES}`);
  };

  return (
    <div style={{ display: "flex", alignItems: "center", marginBottom: 8 }}>
      <ButtonGroup>
        <Button isSelected={activeIndex === 0} appearance="default" iconAfter={DatabaseIcon} onClick={goTo(0)}>
          LogBook
        </Button>
        <Button isSelected={activeIndex === 1} appearance="default" iconAfter={FlagIcon} onClick={goTo(1)}>
          Validators
        </Button>
        <Button isSelected={activeIndex === 2} appearance="default" iconAfter={SettingsIcon} onClick={goTo(2)}>
          Acces
        </Button>
      </ButtonGroup>
    </div>
  );
};
